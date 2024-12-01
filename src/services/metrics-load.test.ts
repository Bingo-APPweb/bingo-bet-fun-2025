// src/tests/services/metrics-load.test.ts

import { MetricsService } from '../../services/metrics/MetricsService';
import { CircuitBreaker } from '../../services/protection/CircuitBreaker';
import { MemoryMonitor } from '../../services/monitoring/MemoryMonitor';
import { AlertSystem } from '../../services/monitoring/AlertSystem';

describe('Metrics Service Load Testing', () => {
  let metricsService: MetricsService;
  let memoryMonitor: MemoryMonitor;
  let circuitBreaker: CircuitBreaker;
  let alertSystem: AlertSystem;

  beforeEach(() => {
    metricsService = MetricsService.getInstance();
    memoryMonitor = new MemoryMonitor();
    circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000,
    });
    alertSystem = new AlertSystem();
  });

  test('should handle high event load', async () => {
    const eventCount = 10000;
    const results = [];
    const startMemory = memoryMonitor.getCurrentUsage();

    // Simula carga alta de eventos
    for (let i = 0; i < eventCount; i++) {
      if (circuitBreaker.isOpen()) {
        console.log('Circuit breaker opened, stopping load test');
        break;
      }

      try {
        const result = await metricsService.trackEvent({
          type: 'loadTest',
          data: { iteration: i },
        });
        results.push(result);
      } catch (error) {
        circuitBreaker.recordFailure();
      }
    }

    const endMemory = memoryMonitor.getCurrentUsage();
    const memoryDelta = endMemory - startMemory;

    expect(results.length).toBeGreaterThan(0);
    expect(memoryDelta).toBeLessThan(100 * 1024 * 1024); // 100MB limit
  });
});

// src/services/monitoring/MemoryMonitor.ts
export class MemoryMonitor {
  private memoryThreshold: number;
  private alertSystem: AlertSystem;

  constructor() {
    this.memoryThreshold = 85; // 85% do limite
    this.alertSystem = new AlertSystem();
    this.startMonitoring();
  }

  getCurrentUsage(): number {
    const used = process.memoryUsage();
    return (used.heapUsed / used.heapTotal) * 100;
  }

  private startMonitoring(): void {
    setInterval(() => {
      const usage = this.getCurrentUsage();

      if (usage > this.memoryThreshold) {
        this.alertSystem.trigger('memory', {
          level: 'warning',
          message: `Memory usage at ${usage.toFixed(2)}%`,
          timestamp: new Date(),
        });
      }
    }, 10000); // Check every 10 seconds
  }
}

// src/services/protection/CircuitBreaker.ts
export class CircuitBreaker {
  private failures: number;
  private lastFailureTime: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;

  constructor(config: { failureThreshold: number; resetTimeout: number }) {
    this.failures = 0;
    this.state = 'CLOSED';
    this.failureThreshold = config.failureThreshold;
    this.resetTimeout = config.resetTimeout;
    this.lastFailureTime = 0;
  }

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failures = 0;
    }
  }
}

// src/services/monitoring/AlertSystem.ts
export class AlertSystem {
  private thresholds: Map<string, number>;
  private alertHandlers: Map<string, Function>;

  constructor() {
    this.thresholds = new Map([
      ['memory', 85],
      ['responseTime', 1000],
      ['errorRate', 5],
      ['bufferUtilization', 90],
    ]);

    this.alertHandlers = new Map();
    this.initializeHandlers();
  }

  trigger(type: string, data: any): void {
    const handler = this.alertHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  private initializeHandlers(): void {
    // Handler para alertas de memória
    this.alertHandlers.set('memory', (data) => {
      console.error(`[MEMORY ALERT] ${data.message}`);
      // Aqui você pode integrar com sistemas externos de alerta
      // como Slack, Email, SMS, etc.
    });

    // Handler para alertas de tempo de resposta
    this.alertHandlers.set('responseTime', (data) => {
      console.error(`[RESPONSE TIME ALERT] High response time detected: ${data.time}ms`);
    });

    // Handler para taxa de erros
    this.alertHandlers.set('errorRate', (data) => {
      console.error(`[ERROR RATE ALERT] High error rate detected: ${data.rate}%`);
    });

    // Handler para utilização do buffer
    this.alertHandlers.set('bufferUtilization', (data) => {
      console.error(`[BUFFER ALERT] High buffer utilization: ${data.utilization}%`);
    });
  }
}

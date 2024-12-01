// packages/maintainer/tests/unit/monitoring/MetricsCollector.test.ts
import { MetricsCollector } from '../../../src/monitoring/MetricsCollector';
import { MetricType, GameMetric } from '../../../src/types/metrics';

describe('MetricsCollector', () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector();
  });

  describe('Metrics Collection', () => {
    test('collects basic game metrics', () => {
      const metric: GameMetric = {
        type: MetricType.ACTIVE_PLAYERS,
        value: 150,
        timestamp: new Date(),
        gameId: 'game123',
      };

      collector.collect(metric);
      const metrics = collector.getMetrics();

      expect(metrics).toContainEqual(
        expect.objectContaining({
          type: MetricType.ACTIVE_PLAYERS,
          value: 150,
        })
      );
    });

    test('aggregates metrics by time window', () => {
      const baseTime = new Date();

      // Simulate metrics over time
      for (let i = 0; i < 5; i++) {
        collector.collect({
          type: MetricType.TRANSACTIONS_PER_SECOND,
          value: 100 + i,
          timestamp: new Date(baseTime.getTime() + i * 1000),
          gameId: 'game123',
        });
      }

      const aggregated = collector.getAggregatedMetrics('1m');
      expect(aggregated.length).toBe(1);
      expect(aggregated[0].value).toBe(102); // Average value
    });

    test('handles different metric types', () => {
      collector.collect({
        type: MetricType.ACTIVE_PLAYERS,
        value: 150,
        timestamp: new Date(),
        gameId: 'game123',
      });

      collector.collect({
        type: MetricType.RESPONSE_TIME,
        value: 45,
        timestamp: new Date(),
        gameId: 'game123',
      });

      const metrics = collector.getMetricsByType(MetricType.RESPONSE_TIME);
      expect(metrics.length).toBe(1);
      expect(metrics[0].value).toBe(45);
    });
  });
});

// packages/maintainer/tests/unit/monitoring/AlertSystem.test.ts
import { AlertSystem } from '../../../src/monitoring/AlertSystem';
import { AlertRule, AlertSeverity } from '../../../src/types/alerts';

describe('AlertSystem', () => {
  let alertSystem: AlertSystem;

  beforeEach(() => {
    alertSystem = new AlertSystem();
  });

  describe('Alert Rules', () => {
    test('evaluates threshold rules', () => {
      const rule: AlertRule = {
        id: 'high-latency',
        metric: MetricType.RESPONSE_TIME,
        threshold: 100,
        operator: '>',
        severity: AlertSeverity.HIGH,
      };

      alertSystem.addRule(rule);

      const alert = alertSystem.evaluateMetric({
        type: MetricType.RESPONSE_TIME,
        value: 150,
        timestamp: new Date(),
      });

      expect(alert).toBeTruthy();
      expect(alert?.severity).toBe(AlertSeverity.HIGH);
    });

    test('handles composite rules', () => {
      const rule: AlertRule = {
        id: 'system-overload',
        conditions: [
          { metric: MetricType.CPU_USAGE, threshold: 90, operator: '>' },
          { metric: MetricType.MEMORY_USAGE, threshold: 85, operator: '>' },
        ],
        severity: AlertSeverity.CRITICAL,
      };

      alertSystem.addRule(rule);

      const alert = alertSystem.evaluateMetrics([
        { type: MetricType.CPU_USAGE, value: 95, timestamp: new Date() },
        { type: MetricType.MEMORY_USAGE, value: 88, timestamp: new Date() },
      ]);

      expect(alert).toBeTruthy();
      expect(alert?.severity).toBe(AlertSeverity.CRITICAL);
    });
  });

  describe('Alert Notifications', () => {
    test('triggers notification callbacks', (done) => {
      alertSystem.onAlert((alert) => {
        expect(alert.rule.id).toBe('test-rule');
        done();
      });

      alertSystem.addRule({
        id: 'test-rule',
        metric: MetricType.ERROR_RATE,
        threshold: 5,
        operator: '>',
        severity: AlertSeverity.MEDIUM,
      });

      alertSystem.evaluateMetric({
        type: MetricType.ERROR_RATE,
        value: 10,
        timestamp: new Date(),
      });
    });
  });
});

// packages/maintainer/tests/unit/monitoring/MetricsStorage.test.ts
import { MetricsStorage } from '../../../src/monitoring/MetricsStorage';
import { MetricRecord } from '../../../src/types/metrics';

describe('MetricsStorage', () => {
  let storage: MetricsStorage;

  beforeEach(async () => {
    storage = new MetricsStorage();
    await storage.initialize();
  });

  afterEach(async () => {
    await storage.cleanup();
  });

  describe('Persistence', () => {
    test('stores and retrieves metrics', async () => {
      const metric: MetricRecord = {
        type: MetricType.ACTIVE_PLAYERS,
        value: 100,
        timestamp: new Date(),
        gameId: 'game123',
      };

      await storage.store(metric);
      const retrieved = await storage.query({
        type: MetricType.ACTIVE_PLAYERS,
        from: new Date(Date.now() - 3600000),
      });

      expect(retrieved).toContainEqual(
        expect.objectContaining({
          value: 100,
          gameId: 'game123',
        })
      );
    });

    test('handles time-series queries', async () => {
      const baseTime = new Date();
      const metrics = Array.from({ length: 5 }, (_, i) => ({
        type: MetricType.TRANSACTIONS_PER_SECOND,
        value: 100 + i,
        timestamp: new Date(baseTime.getTime() + i * 1000),
        gameId: 'game123',
      }));

      await Promise.all(metrics.map((m) => storage.store(m)));

      const result = await storage.queryTimeSeries({
        type: MetricType.TRANSACTIONS_PER_SECOND,
        interval: '1s',
        from: baseTime,
        to: new Date(baseTime.getTime() + 5000),
      });

      expect(result.length).toBe(5);
      expect(result[4].value).toBe(104);
    });
  });
});

// packages/maintainer/tests/unit/monitoring/DashboardServer.test.ts
import { DashboardServer } from '../../../src/monitoring/DashboardServer';
import WebSocket from 'ws';

describe('DashboardServer', () => {
  let server: DashboardServer;
  let client: WebSocket;

  beforeEach((done) => {
    server = new DashboardServer({ port: 8080 });
    server.start().then(() => {
      client = new WebSocket('ws://localhost:8080');
      client.on('open', done);
    });
  });

  afterEach((done) => {
    client.close();
    server.stop().then(done);
  });

  describe('Real-time Updates', () => {
    test('broadcasts metric updates', (done) => {
      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        expect(message.type).toBe('metric-update');
        expect(message.data).toHaveProperty('value');
        done();
      });

      server.broadcastMetric({
        type: MetricType.ACTIVE_PLAYERS,
        value: 100,
        timestamp: new Date(),
      });
    });

    test('handles client subscriptions', (done) => {
      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === 'subscription-success') {
          done();
        }
      });

      client.send(
        JSON.stringify({
          type: 'subscribe',
          metrics: [MetricType.ACTIVE_PLAYERS],
        })
      );
    });
  });

  describe('Alert Broadcasting', () => {
    test('sends alerts to subscribed clients', (done) => {
      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === 'alert') {
          expect(message.data.severity).toBe(AlertSeverity.HIGH);
          done();
        }
      });

      server.broadcastAlert({
        rule: { id: 'test-alert' },
        severity: AlertSeverity.HIGH,
        timestamp: new Date(),
        message: 'Test alert',
      });
    });
  });
});

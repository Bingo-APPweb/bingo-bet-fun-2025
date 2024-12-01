
import { MetricsCollector } from './MetricsCollector';
import { AlertManager } from './AlertManager';
import { Metric } from '../../types/monitoring';
import { logger } from '../../utils/logger';

export class MonitoringService {
  private metricsCollector: MetricsCollector;
  private alertManager: AlertManager;
  private isRunning: boolean = false;

  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.alertManager = new AlertManager();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    this.monitor();
  }

  private async monitor(): Promise<void> {
    while (this.isRunning) {
      try {
        const metrics = await this.collectSystemMetrics();

        for (const metric of metrics) {
          await this.metricsCollector.collect(metric);
          const alert = await this.alertManager.checkMetric(metric);

          if (alert) {
            logger.warn('Alert generated:', alert);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        logger.error('Monitoring error:', error);
      }
    }
  }

  private async collectSystemMetrics(): Promise<Metric[]> {
    // Implementação real coletaria métricas do sistema
    return [
      {
        name: 'cpu_usage',
        value: Math.random() * 100,
        timestamp: new Date(),
        labels: { host: 'server-1' },
      },
      {
        name: 'memory_usage',
        value: Math.random() * 16384,
        timestamp: new Date(),
        labels: { host: 'server-1' },
      },
    ];
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }
}

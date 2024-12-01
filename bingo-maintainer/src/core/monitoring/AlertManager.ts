
import { Alert, Metric } from '../../types/monitoring';
import { NotificationService } from '../../notifications/NotificationService';

export class AlertManager {
  private thresholds: Map<string, number>;
  private notificationService: NotificationService;

  constructor() {
    this.thresholds = new Map();
    this.notificationService = new NotificationService();
  }

  async checkMetric(metric: Metric): Promise<Alert | null> {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold || metric.value <= threshold) {
      return null;
    }

    const alert: Alert = {
      id: crypto.randomUUID(),
      severity: this.calculateSeverity(metric.value, threshold),
      metric: metric.name,
      threshold,
      currentValue: metric.value,
      message: `Metric ${metric.name} exceeded threshold: ${metric.value} > ${threshold}`,
      timestamp: new Date(),
    };

    await this.notificationService.sendAlert(alert);
    return alert;
  }

  private calculateSeverity(value: number, threshold: number): Alert['severity'] {
    const ratio = value / threshold;
    if (ratio > 2) return 'CRITICAL';
    if (ratio > 1.5) return 'HIGH';
    if (ratio > 1.2) return 'MEDIUM';
    return 'LOW';
  }
}


import { BingoMetric, BingoMetricType } from '../../types/monitoring';
import { BingoAlert, BingoAlertType } from '../../types/alerts';
import { NotificationService } from '../../notifications/NotificationService';

export class BingoAlertManager {
  private static readonly THRESHOLDS = {
    [BingoMetricType.GAME_LATENCY]: 200, // ms
    [BingoMetricType.PATTERN_VALIDATION_TIME]: 100, // ms
    [BingoMetricType.NUMBER_GENERATION_ENTROPY]: 80, // %
    [BingoMetricType.CONCURRENT_PLAYERS]: 5000,
    [BingoMetricType.WIN_RATE]: 0.3, // 30%
    [BingoMetricType.TRANSACTION_PROCESSING_TIME]: 500, // ms
  };

  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async checkMetric(metric: BingoMetric): Promise<BingoAlert | null> {
    const threshold = BingoAlertManager.THRESHOLDS[metric.type];
    if (!threshold) return null;

    const alert = this.createAlert(metric, threshold);
    if (alert) {
      await this.notificationService.sendAlert(alert);
      await this.triggerAutomaticAction(alert);
    }

    return alert;
  }

  private createAlert(metric: BingoMetric, threshold: number): BingoAlert | null {
    switch (metric.type) {
      case BingoMetricType.GAME_LATENCY:
        return metric.value > threshold
          ? {
              id: crypto.randomUUID(),
              type: BingoAlertType.HIGH_LATENCY,
              severity: this.calculateSeverity(metric.value, threshold),
              metric: metric.name,
              threshold,
              currentValue: metric.value,
              message: `High game latency detected: ${metric.value}ms`,
              timestamp: new Date(),
              gameId: metric.gameId,
              recommendedAction: 'Consider scaling up game servers',
            }
          : null;

      case BingoMetricType.NUMBER_GENERATION_ENTROPY:
        return metric.value < threshold
          ? {
              id: crypto.randomUUID(),
              type: BingoAlertType.LOW_ENTROPY,
              severity: 'CRITICAL',
              metric: metric.name,
              threshold,
              currentValue: metric.value,
              message: `Low number generation entropy detected: ${metric.value}%`,
              timestamp: new Date(),
              gameId: metric.gameId,
              recommendedAction: 'Verify random number generator integrity',
            }
          : null;

      case BingoMetricType.PATTERN_VALIDATION_TIME:
        return metric.value > threshold
          ? {
              id: crypto.randomUUID(),
              type: BingoAlertType.PATTERN_VALIDATION_DELAY,
              severity: this.calculateSeverity(metric.value, threshold),
              metric: metric.name,
              threshold,
              currentValue: metric.value,
              message: `Pattern validation taking too long: ${metric.value}ms`,
              timestamp: new Date(),
              gameId: metric.gameId,
              recommendedAction: 'Optimize pattern validation algorithm',
            }
          : null;

      case BingoMetricType.CONCURRENT_PLAYERS:
        return metric.value > threshold
          ? {
              id: crypto.randomUUID(),
              type: BingoAlertType.PLAYER_SURGE,
              severity: 'HIGH',
              metric: metric.name,
              threshold,
              currentValue: metric.value,
              message: `Unusually high player count: ${metric.value}`,
              timestamp: new Date(),
              gameId: metric.gameId,
              impactedPlayers: metric.value,
              recommendedAction: 'Scale infrastructure and monitor system resources',
            }
          : null;

      default:
        return null;
    }
  }

  private calculateSeverity(value: number, threshold: number): Alert['severity'] {
    const ratio = value / threshold;
    if (ratio > 2) return 'CRITICAL';
    if (ratio > 1.5) return 'HIGH';
    if (ratio > 1.2) return 'MEDIUM';
    return 'LOW';
  }

  private async triggerAutomaticAction(alert: BingoAlert): Promise<void> {
    switch (alert.type) {
      case BingoAlertType.HIGH_LATENCY:
        if (alert.severity === 'CRITICAL') {
          await this.requestServerScaling(alert.gameId);
        }
        break;

      case BingoAlertType.LOW_ENTROPY:
        await this.pauseNumberGeneration(alert.gameId);
        break;

      case BingoAlertType.PLAYER_SURGE:
        await this.enableLoadBalancing(alert.gameId);
        break;
    }
  }

  private async requestServerScaling(gameId: string): Promise<void> {
    // Implementação real solicitaria scaling dos servidores
    console.log(`Requesting server scaling for game ${gameId}`);
  }

  private async pauseNumberGeneration(gameId: string): Promise<void> {
    // Implementação real pausaria geração de números
    console.log(`Pausing number generation for game ${gameId}`);
  }

  private async enableLoadBalancing(gameId: string): Promise<void> {
    // Implementação real ativaria load balancing
    console.log(`Enabling load balancing for game ${gameId}`);
  }
}

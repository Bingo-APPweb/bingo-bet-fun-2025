//src/core/recommendations/RecommendationEngine.ts
import { BingoMetric, BingoMetricType } from '../../types/monitoring';
import { Recommendation, RecommendationType } from '../../types/recommendations';
import { MetricsPersistence } from '../monitoring/MetricsPersistence';

export class RecommendationEngine {
  private metricsPersistence: MetricsPersistence;

  constructor() {
    this.metricsPersistence = new MetricsPersistence();
  }

  async generateRecommendations(metrics: BingoMetric[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Análise de Performance
    const latencyMetrics = metrics.filter((m) => m.type === BingoMetricType.GAME_LATENCY);
    if (this.hasHighLatency(latencyMetrics)) {
      recommendations.push(this.createPerformanceRecommendation(latencyMetrics));
    }

    // Análise de Integridade
    const entropyMetrics = metrics.filter(
      (m) => m.type === BingoMetricType.NUMBER_GENERATION_ENTROPY
    );
    if (this.hasLowEntropy(entropyMetrics)) {
      recommendations.push(this.createIntegrityRecommendation(entropyMetrics));
    }

    // Análise de Escala
    const playerMetrics = metrics.filter((m) => m.type === BingoMetricType.CONCURRENT_PLAYERS);
    if (this.needsScaling(playerMetrics)) {
      recommendations.push(this.createScalingRecommendation(playerMetrics));
    }

    return recommendations;
  }

  private hasHighLatency(metrics: BingoMetric[]): boolean {
    const average = this.calculateAverage(metrics);
    return average > 150; // ms
  }

  private hasLowEntropy(metrics: BingoMetric[]): boolean {
    const average = this.calculateAverage(metrics);
    return average < 85; // %
  }

  private needsScaling(metrics: BingoMetric[]): boolean {
    const trend = this.calculateTrend(metrics);
    return trend > 0.2; // 20% crescimento
  }

  private calculateAverage(metrics: BingoMetric[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private calculateTrend(metrics: BingoMetric[]): number {
    if (metrics.length < 2) return 0;
    const first = metrics[0].value;
    const last = metrics[metrics.length - 1].value;
    return (last - first) / first;
  }

  private createPerformanceRecommendation(metrics: BingoMetric[]): Recommendation {
    return {
      id: crypto.randomUUID(),
      type: RecommendationType.PERFORMANCE_OPTIMIZATION,
      priority: 1,
      title: 'Otimização de Latência do Jogo',
      description: 'Alta latência detectada nos jogos',
      impact: 'Melhoria na experiência do usuário e redução de desconexões',
      effort: 'MEDIUM',
      metrics: [
        {
          name: 'game_latency',
          current: this.calculateAverage(metrics),
          target: 100,
        },
      ],
      implementation: [
        'Otimizar queries do banco de dados',
        'Implementar caching de dados frequentes',
        'Avaliar configurações de rede',
      ],
    };
  }

  private createIntegrityRecommendation(metrics: BingoMetric[]): Recommendation {
    return {
      id: crypto.randomUUID(),
      type: RecommendationType.INTEGRITY_CHECK,
      priority: 1,
      title: 'Melhoria na Geração de Números',
      description: 'Baixa entropia na geração de números',
      impact: 'Garantia de aleatoriedade e fairplay',
      effort: 'HIGH',
      metrics: [
        {
          name: 'number_generation_entropy',
          current: this.calculateAverage(metrics),
          target: 95,
        },
      ],
      implementation: [
        'Atualizar fonte de entropia',
        'Implementar validações adicionais',
        'Adicionar logs de auditoria',
      ],
    };
  }

  private createScalingRecommendation(metrics: BingoMetric[]): Recommendation {
    return {
      id: crypto.randomUUID(),
      type: RecommendationType.RESOURCE_SCALING,
      priority: 2,
      title: 'Escalar Recursos do Sistema',
      description: 'Aumento significativo no número de jogadores',
      impact: 'Manter performance com crescimento de usuários',
      effort: 'MEDIUM',
      metrics: [
        {
          name: 'concurrent_players',
          current: metrics[metrics.length - 1].value,
          target: metrics[metrics.length - 1].value * 1.5,
        },
      ],
      implementation: [
        'Aumentar capacidade dos servidores',
        'Otimizar balanceamento de carga',
        'Avaliar limites do banco de dados',
      ],
    };
  }
}

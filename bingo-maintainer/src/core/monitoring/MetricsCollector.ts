
import { Metric } from '../../types/monitoring';
import { redis } from '../../utils/redis';

export class MetricsCollector {
  private static instance: MetricsCollector;

  async collect(metric: Metric): Promise<void> {
    const key = `metrics:${metric.name}:${Date.now()}`;
    await redis.setex(key, 86400, JSON.stringify(metric));
  }

  async getMetrics(name: string, timeRange: number): Promise<Metric[]> {
    const keys = await redis.keys(`metrics:${name}:*`);
    const metrics: Metric[] = [];

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        metrics.push(JSON.parse(data));
      }
    }

    return metrics;
  }
}

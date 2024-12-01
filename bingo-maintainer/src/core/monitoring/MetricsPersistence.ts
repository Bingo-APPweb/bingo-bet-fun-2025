
import { Pool } from 'pg';
import { BingoMetric } from '../../types/monitoring';

export class MetricsPersistence {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      /* config */
    });
  }

  async saveMetric(metric: BingoMetric): Promise<void> {
    const query = `
      INSERT INTO metrics (
        type, name, value, timestamp, labels, game_id, room_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await this.pool.query(query, [
      metric.type,
      metric.name,
      metric.value,
      metric.timestamp,
      JSON.stringify(metric.labels),
      metric.gameId,
      metric.roomId,
    ]);
  }

  async getMetricHistory(type: string, startTime: Date, endTime: Date): Promise<BingoMetric[]> {
    const query = `
      SELECT * FROM metrics
      WHERE type = $1 
      AND timestamp BETWEEN $2 AND $3
      ORDER BY timestamp DESC
    `;

    const result = await this.pool.query(query, [type, startTime, endTime]);
    return result.rows;
  }
}

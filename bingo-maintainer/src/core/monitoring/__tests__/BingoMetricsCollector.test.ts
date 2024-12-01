// packages/maintainer/src/core/monitoring/__tests__/BingoMetricsCollector.test.ts
import { BingoMetricsCollector } from '../BingoMetricsCollector';
import { BingoMetricType } from '../../../types/monitoring';

describe('BingoMetricsCollector', () => {
  let collector: BingoMetricsCollector;

  beforeEach(() => {
    collector = new BingoMetricsCollector();
  });

  test('should collect game metrics', async () => {
    const gameId = 'test-game';
    const metrics = await collector.collectGameMetrics(gameId);

    expect(metrics).toHaveLength(2);
    expect(metrics[0].type).toBe(BingoMetricType.GAME_LATENCY);
    expect(metrics[1].type).toBe(BingoMetricType.CONCURRENT_PLAYERS);
    expect(metrics[0].gameId).toBe(gameId);
  });

  test('should collect integrity metrics', async () => {
    const gameId = 'test-game';
    const metrics = await collector.collectIntegrityMetrics(gameId);

    expect(metrics).toHaveLength(2);
    expect(metrics[0].type).toBe(BingoMetricType.PATTERN_VALIDATION_TIME);
    expect(metrics[1].type).toBe(BingoMetricType.NUMBER_GENERATION_ENTROPY);
  });
});

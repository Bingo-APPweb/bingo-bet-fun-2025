//src/core/recommendations/__tests__/RecommendationEngine.test.ts
import { RecommendationEngine } from '../RecommendationEngine';
import { BingoMetric, BingoMetricType } from '../../../types/monitoring';
import { RecommendationType } from '../../../types/recommendations';

describe('RecommendationEngine', () => {
  let engine: RecommendationEngine;

  beforeEach(() => {
    engine = new RecommendationEngine();
  });

  describe('Performance Recommendations', () => {
    test('should generate latency optimization recommendation', async () => {
      const metrics: BingoMetric[] = [
        {
          type: BingoMetricType.GAME_LATENCY,
          name: 'game_latency',
          value: 200,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        },
        {
          type: BingoMetricType.GAME_LATENCY,
          name: 'game_latency',
          value: 180,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        }
      ];

      const recommendations = await engine.generateRecommendations(metrics);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].type).toBe(RecommendationType.PERFORMANCE_OPTIMIZATION);
      expect(recommendations[0].metrics[0].current).toBe(190);
    });
  });

  describe('Integrity Recommendations', () => {
    test('should generate entropy recommendation for low values', async () => {
      const metrics: BingoMetric[] = [
        {
          type: BingoMetricType.NUMBER_GENERATION_ENTROPY,
          name: 'entropy',
          value: 75,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        }
      ];

      const recommendations = await engine.generateRecommendations(metrics);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].type).toBe(RecommendationType.INTEGRITY_CHECK);
      expect(recommendations[0].priority).toBe(1);
    });
  });

  describe('Scaling Recommendations', () => {
    test('should detect need for scaling based on player growth', async () => {
      const metrics: BingoMetric[] = [
        {
          type: BingoMetricType.CONCURRENT_PLAYERS,
          name: 'players',
          value: 1000,
          timestamp: new Date(Date.now() - 3600000),
          labels: {},
          gameId: 'test-1'
        },
        {
          type: BingoMetricType.CONCURRENT_PLAYERS,
          name: 'players',
          value: 1500,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        }
      ];

      const recommendations = await engine.generateRecommendations(metrics);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].type).toBe(RecommendationType.RESOURCE_SCALING);
      expect(recommendations[0].metrics[0].target).toBe(2250);
    });
  });

  describe('Multiple Recommendations', () => {
    test('should generate multiple recommendations when needed', async () => {
      const metrics: BingoMetric[] = [
        {
          type: BingoMetricType.GAME_LATENCY,
          name: 'latency',
          value: 200,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        },
        {
          type: BingoMetricType.NUMBER_GENERATION_ENTROPY,
          name: 'entropy',
          value: 70,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        }
      ];

      const recommendations = await engine.generateRecommendations(metrics);
      
      expect(recommendations).toHaveLength(2);
      expect(recommendations.map(r => r.type)).toContain(RecommendationType.PERFORMANCE_OPTIMIZATION);
      expect(recommendations.map(r => r.type)).toContain(RecommendationType.INTEGRITY_CHECK);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty metrics array', async () => {
      const recommendations = await engine.generateRecommendations([]);
      expect(recommendations).toHaveLength(0);
    });

    test('should handle metrics with invalid values', async () => {
      const metrics: BingoMetric[] = [
        {
          type: BingoMetricType.GAME_LATENCY,
          name: 'latency',
          value: NaN,
          timestamp: new Date(),
          labels: {},
          gameId: 'test-1'
        }
      ];

      const recommendations = await engine.generateRecommendations(metrics);
      expect(recommendations).toHaveLength(0);
    });
  });
});
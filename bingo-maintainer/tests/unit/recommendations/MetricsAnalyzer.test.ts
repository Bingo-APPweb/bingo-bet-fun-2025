// packages/maintainer/tests/unit/recommendations/MetricsAnalyzer.test.ts
import { MetricsAnalyzer } from '../../../src/recommendations/MetricsAnalyzer';
import { MetricPattern, TrendType } from '../../../src/types/metrics';

describe('MetricsAnalyzer', () => {
  let analyzer: MetricsAnalyzer;

  beforeEach(() => {
    analyzer = new MetricsAnalyzer();
  });

  describe('Pattern Recognition', () => {
    test('identifies performance degradation patterns', () => {
      const metrics = [
        { type: 'response_time', value: 100, timestamp: new Date('2024-01-01T00:00:00') },
        { type: 'response_time', value: 150, timestamp: new Date('2024-01-01T00:01:00') },
        { type: 'response_time', value: 200, timestamp: new Date('2024-01-01T00:02:00') },
        { type: 'response_time', value: 300, timestamp: new Date('2024-01-01T00:03:00') },
      ];

      const patterns = analyzer.detectPatterns(metrics);
      expect(patterns).toContainEqual(
        expect.objectContaining({
          type: TrendType.DEGRADATION,
          confidence: expect.any(Number),
        })
      );
    });

    test('detects resource utilization trends', () => {
      const metrics = [
        { type: 'memory_usage', value: 60, timestamp: new Date('2024-01-01T00:00:00') },
        { type: 'memory_usage', value: 65, timestamp: new Date('2024-01-01T00:01:00') },
        { type: 'memory_usage', value: 75, timestamp: new Date('2024-01-01T00:02:00') },
        { type: 'memory_usage', value: 85, timestamp: new Date('2024-01-01T00:03:00') },
      ];

      const trend = analyzer.analyzeTrend(metrics);
      expect(trend).toMatchObject({
        direction: 'increasing',
        rate: expect.any(Number),
        predictedValue: expect.any(Number),
      });
    });

    test('correlates multiple metrics', () => {
      const responseTimeMetrics = [
        { type: 'response_time', value: 100, timestamp: new Date('2024-01-01T00:00:00') },
        { type: 'response_time', value: 200, timestamp: new Date('2024-01-01T00:01:00') },
      ];

      const cpuMetrics = [
        { type: 'cpu_usage', value: 50, timestamp: new Date('2024-01-01T00:00:00') },
        { type: 'cpu_usage', value: 90, timestamp: new Date('2024-01-01T00:01:00') },
      ];

      const correlation = analyzer.correlateMetrics(responseTimeMetrics, cpuMetrics);
      expect(correlation.coefficient).toBeGreaterThan(0.5);
    });
  });
});

// packages/maintainer/tests/unit/recommendations/SuggestionGenerator.test.ts
import { SuggestionGenerator } from '../../../src/recommendations/SuggestionGenerator';
import { RecommendationType, Suggestion } from '../../../src/types/recommendations';

describe('SuggestionGenerator', () => {
  let generator: SuggestionGenerator;

  beforeEach(() => {
    generator = new SuggestionGenerator();
  });

  describe('Suggestion Generation', () => {
    test('generates performance optimization suggestions', () => {
      const pattern: MetricPattern = {
        type: TrendType.DEGRADATION,
        metricType: 'response_time',
        confidence: 0.9,
        severity: 'high',
      };

      const suggestions = generator.generateFromPattern(pattern);
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          type: RecommendationType.PERFORMANCE_OPTIMIZATION,
          priority: expect.any(Number),
        })
      );
    });

    test('provides resource scaling recommendations', () => {
      const metrics = {
        cpu_usage: [
          { value: 85, timestamp: new Date() },
          { value: 90, timestamp: new Date() },
        ],
        memory_usage: [
          { value: 75, timestamp: new Date() },
          { value: 80, timestamp: new Date() },
        ],
      };

      const suggestions = generator.analyzeResourceUtilization(metrics);
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          type: RecommendationType.RESOURCE_SCALING,
          action: expect.any(String),
        })
      );
    });

    test('generates code optimization suggestions', () => {
      const codeMetrics = {
        complexity: 25,
        dependencies: 15,
        duplications: 5,
      };

      const suggestions = generator.analyzeCodeMetrics(codeMetrics);
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          type: RecommendationType.CODE_OPTIMIZATION,
          details: expect.any(Object),
        })
      );
    });
  });
});

// packages/maintainer/tests/unit/recommendations/PrioritizationSystem.test.ts
import { PrioritizationSystem } from '../../../src/recommendations/PrioritizationSystem';
import { Suggestion, PriorityLevel } from '../../../src/types/recommendations';

describe('PrioritizationSystem', () => {
  let prioritizer: PrioritizationSystem;

  beforeEach(() => {
    prioritizer = new PrioritizationSystem();
  });

  describe('Suggestion Prioritization', () => {
    test('prioritizes critical performance issues', () => {
      const suggestions: Suggestion[] = [
        {
          type: RecommendationType.PERFORMANCE_OPTIMIZATION,
          impact: 'high',
          effort: 'medium',
          metrics: { responseTime: 500 },
        },
        {
          type: RecommendationType.CODE_OPTIMIZATION,
          impact: 'medium',
          effort: 'high',
          metrics: { complexity: 20 },
        },
      ];

      const prioritized = prioritizer.prioritize(suggestions);
      expect(prioritized[0].type).toBe(RecommendationType.PERFORMANCE_OPTIMIZATION);
    });

    test('considers implementation effort', () => {
      const suggestions: Suggestion[] = [
        {
          type: RecommendationType.RESOURCE_SCALING,
          impact: 'medium',
          effort: 'low',
          metrics: { cpuUsage: 80 },
        },
        {
          type: RecommendationType.CODE_REFACTOR,
          impact: 'medium',
          effort: 'high',
          metrics: { duplications: 10 },
        },
      ];

      const prioritized = prioritizer.prioritize(suggestions);
      expect(prioritized[0].effort).toBe('low');
    });

    test('calculates ROI scores', () => {
      const suggestion: Suggestion = {
        type: RecommendationType.PERFORMANCE_OPTIMIZATION,
        impact: 'high',
        effort: 'medium',
        metrics: { responseTime: 400 },
      };

      const roi = prioritizer.calculateROI(suggestion);
      expect(roi).toBeGreaterThan(0);
      expect(roi).toBeLessThanOrEqual(1);
    });
  });

  describe('Dynamic Prioritization', () => {
    test('adjusts priorities based on system state', () => {
      const systemState = {
        performance: 'degraded',
        resources: 'strained',
        errorRate: 'high',
      };

      const suggestions: Suggestion[] = [
        {
          type: RecommendationType.PERFORMANCE_OPTIMIZATION,
          impact: 'medium',
          effort: 'medium',
        },
        {
          type: RecommendationType.ERROR_HANDLING,
          impact: 'medium',
          effort: 'medium',
        },
      ];

      const prioritized = prioritizer.prioritizeWithContext(suggestions, systemState);
      expect(prioritized[0].type).toBe(RecommendationType.ERROR_HANDLING);
    });

    test('considers historical success rates', () => {
      const history = {
        'performance-opt': { success: 0.8, implemented: 10 },
        'resource-scaling': { success: 0.6, implemented: 5 },
      };

      const suggestions: Suggestion[] = [
        {
          type: RecommendationType.PERFORMANCE_OPTIMIZATION,
          impact: 'medium',
          effort: 'medium',
        },
        {
          type: RecommendationType.RESOURCE_SCALING,
          impact: 'medium',
          effort: 'medium',
        },
      ];

      const prioritized = prioritizer.prioritizeWithHistory(suggestions, history);
      expect(prioritized[0].type).toBe(RecommendationType.PERFORMANCE_OPTIMIZATION);
    });
  });
});

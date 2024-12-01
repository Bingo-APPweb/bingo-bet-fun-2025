import { CodeComplexityAnalyzer } from '../../../../src/core/analyzers/CodeComplexityAnalyzer';
import { AnalyzerConfig } from '../../../../src/types/analyzers';

describe('CodeComplexityAnalyzer', () => {
  let analyzer: CodeComplexityAnalyzer;
  const config: AnalyzerConfig = {
    targetPath: './src/services/game/GameService.ts',
    severity: 'error',
    thresholds: {
      cyclomaticComplexity: 10,
      functionLength: 30,
      dependencyDepth: 3,
    },
  };

  beforeEach(() => {
    analyzer = new CodeComplexityAnalyzer(config);
  });

  describe('Cyclomatic Complexity', () => {
    test('detects high complexity functions', async () => {
      const results = await analyzer.analyzeCyclomaticComplexity();
      expect(
        results.some(
          (r) => r.message.includes('High cyclomatic complexity') && r.severity === 'error'
        )
      ).toBe(true);
    });

    test('identifies nested control structures', async () => {
      const results = await analyzer.analyzeCyclomaticComplexity();
      expect(results.some((r) => r.message.includes('Nested control structures'))).toBe(true);
    });
  });

  describe('Function Analysis', () => {
    test('flags long functions', async () => {
      const results = await analyzer.analyzeFunctionLength();
      expect(results.some((r) => r.message.includes('Function exceeds length threshold'))).toBe(
        true
      );
    });

    test('checks function parameter count', async () => {
      const results = await analyzer.analyzeFunctionLength();
      expect(results.some((r) => r.message.includes('High parameter count'))).toBe(true);
    });
  });

  describe('Dependency Analysis', () => {
    test('detects circular dependencies', async () => {
      const results = await analyzer.analyzeDependencies();
      expect(results.some((r) => r.message.includes('Circular dependency detected'))).toBe(true);
    });

    test('checks dependency depth', async () => {
      const results = await analyzer.analyzeDependencies();
      expect(results.some((r) => r.message.includes('Excessive dependency depth'))).toBe(true);
    });
  });

  describe('Maintainability Metrics', () => {
    test('calculates maintainability index', async () => {
      const results = await analyzer.analyzeMaintainability();
      expect(results.some((r) => r.message.includes('Low maintainability index'))).toBe(true);
    });

    test('identifies code duplication', async () => {
      const results = await analyzer.analyzeMaintainability();
      expect(results.some((r) => r.message.includes('Code duplication detected'))).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('runs full analysis successfully', async () => {
      const results = await analyzer.analyze();
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((r) => r.severity && r.message && r.timestamp)).toBe(true);
    });

    test('respects severity thresholds', async () => {
      analyzer = new CodeComplexityAnalyzer({
        ...config,
        thresholds: {
          ...config.thresholds,
          cyclomaticComplexity: 20,
        },
      });

      const results = await analyzer.analyze();
      expect(
        results.filter((r) => r.severity === 'error' && r.message.includes('cyclomatic complexity'))
          .length
      ).toBe(0);
    });
  });
});

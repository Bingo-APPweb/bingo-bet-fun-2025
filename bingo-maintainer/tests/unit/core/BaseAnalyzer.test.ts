// packages/maintainer/tests/unit/core/BaseAnalyzer.test.ts
import { BaseAnalyzer } from '../../../src/core/analyzers/BaseAnalyzer';
import { AnalyzerConfig } from '../../../src/types/analyzers';

describe('BaseAnalyzer', () => {
  let analyzer: BaseAnalyzer;
  const mockConfig: AnalyzerConfig = {
    targetPath: './src/services/game/GameService.ts',
    severity: 'error',
    thresholds: {
      cyclomaticComplexity: 10,
      functionLength: 30,
      dependencyDepth: 3,
    },
  };

  beforeEach(() => {
    analyzer = new BaseAnalyzer(mockConfig);
  });

  describe('Core Functionality', () => {
    test('initializes with valid configuration', () => {
      expect(analyzer.getConfig()).toEqual(mockConfig);
      expect(analyzer.isInitialized()).toBeTruthy();
    });

    test('validates configuration on initialization', () => {
      expect(() => new BaseAnalyzer({} as AnalyzerConfig)).toThrow();
      expect(
        () =>
          new BaseAnalyzer({
            ...mockConfig,
            severity: 'invalid',
          } as AnalyzerConfig)
      ).toThrow();
    });

    test('handles file paths correctly', async () => {
      const path = './test/file.ts';
      const absolutePath = await analyzer.resolveFilePath(path);
      expect(absolutePath).toBeTruthy();
      expect(typeof absolutePath).toBe('string');
    });
  });

  describe('Analysis Pipeline', () => {
    test('executes analysis steps in correct order', async () => {
      const steps: string[] = [];

      // Mock internal methods to track execution order
      jest.spyOn(analyzer as any, 'preAnalysis').mockImplementation(() => {
        steps.push('pre');
        return Promise.resolve();
      });

      jest.spyOn(analyzer as any, 'runAnalysis').mockImplementation(() => {
        steps.push('run');
        return Promise.resolve([]);
      });

      jest.spyOn(analyzer as any, 'postAnalysis').mockImplementation(() => {
        steps.push('post');
        return Promise.resolve();
      });

      await analyzer.analyze();
      expect(steps).toEqual(['pre', 'run', 'post']);
    });

    test('handles analysis errors gracefully', async () => {
      jest.spyOn(analyzer as any, 'runAnalysis').mockImplementation(() => {
        throw new Error('Analysis failed');
      });

      await expect(analyzer.analyze()).rejects.toThrow('Analysis failed');
    });
  });

  describe('Event Handling', () => {
    test('emits analysis events', (done) => {
      const events: string[] = [];

      analyzer.on('analysis-start', () => events.push('start'));
      analyzer.on('analysis-complete', () => {
        events.push('complete');
        expect(events).toEqual(['start', 'complete']);
        done();
      });

      analyzer.analyze().catch(done);
    });

    test('emits error events', (done) => {
      jest.spyOn(analyzer as any, 'runAnalysis').mockImplementation(() => {
        throw new Error('Test error');
      });

      analyzer.on('analysis-error', (error) => {
        expect(error.message).toBe('Test error');
        done();
      });

      analyzer.analyze().catch(() => {});
    });
  });

  describe('Resource Management', () => {
    test('cleans up resources after analysis', async () => {
      const cleanupSpy = jest.spyOn(analyzer as any, 'cleanup');

      try {
        await analyzer.analyze();
      } catch (e) {
        // Ignore errors
      }

      expect(cleanupSpy).toHaveBeenCalled();
    });

    test('handles cleanup errors gracefully', async () => {
      jest.spyOn(analyzer as any, 'cleanup').mockImplementation(() => {
        throw new Error('Cleanup failed');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await analyzer.analyze();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

// packages/maintainer/tests/unit/core/Runner.test.ts
import { Runner } from '../../../src/core/Runner';
import { BaseAnalyzer } from '../../../src/core/analyzers/BaseAnalyzer';

describe('Runner', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner({
      configPath: './config/maintainer.json',
      mode: 'check',
    });
  });

  describe('Initialization', () => {
    test('loads configuration correctly', () => {
      expect(runner.isConfigured()).toBeTruthy();
      expect(runner.getAnalyzers().length).toBeGreaterThan(0);
    });

    test('validates configuration', () => {
      expect(() => new Runner({} as any)).toThrow();
    });
  });

  describe('Analyzer Management', () => {
    test('registers analyzers correctly', () => {
      const mockAnalyzer = new BaseAnalyzer({
        targetPath: './test',
        severity: 'error',
        thresholds: {},
      });

      runner.registerAnalyzer(mockAnalyzer);
      expect(runner.getAnalyzers()).toContain(mockAnalyzer);
    });

    test('handles duplicate analyzer registration', () => {
      const mockAnalyzer = new BaseAnalyzer({
        targetPath: './test',
        severity: 'error',
        thresholds: {},
      });

      runner.registerAnalyzer(mockAnalyzer);
      expect(() => runner.registerAnalyzer(mockAnalyzer)).toThrow();
    });
  });

  describe('Analysis Execution', () => {
    test('executes all registered analyzers', async () => {
      const mockAnalyzer1 = {
        analyze: jest.fn().mockResolvedValue([]),
        on: jest.fn(),
      };

      const mockAnalyzer2 = {
        analyze: jest.fn().mockResolvedValue([]),
        on: jest.fn(),
      };

      runner.registerAnalyzer(mockAnalyzer1 as any);
      runner.registerAnalyzer(mockAnalyzer2 as any);

      await runner.run();

      expect(mockAnalyzer1.analyze).toHaveBeenCalled();
      expect(mockAnalyzer2.analyze).toHaveBeenCalled();
    });

    test('handles analyzer failures', async () => {
      const mockAnalyzer = {
        analyze: jest.fn().mockRejectedValue(new Error('Analysis failed')),
        on: jest.fn(),
      };

      runner.registerAnalyzer(mockAnalyzer as any);

      await expect(runner.run()).rejects.toThrow('Analysis failed');
    });
  });

  describe('Event Aggregation', () => {
    test('aggregates analyzer events', (done) => {
      const events: string[] = [];

      runner.on('analysis-start', () => events.push('start'));
      runner.on('analysis-complete', () => {
        events.push('complete');
        expect(events).toEqual(['start', 'complete']);
        done();
      });

      runner.run().catch(done);
    });
  });
});

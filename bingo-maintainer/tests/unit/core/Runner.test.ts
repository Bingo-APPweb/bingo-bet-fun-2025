import { Runner } from '../../../src/core/Runner';
import { BaseAnalyzer } from '../../../src/core/analyzers/BaseAnalyzer';
import { Reporter } from '../../../src/core/Reporter';
import { RunnerConfig, AnalysisResult } from '../../../src/types';

class MockAnalyzer extends BaseAnalyzer {
  async analyze(): Promise<AnalysisResult[]> {
    return [
      {
        analyzer: 'MockAnalyzer',
        severity: 'info',
        message: 'Mock analysis completed',
        timestamp: Date.now(),
      },
    ];
  }
}

class FailingAnalyzer extends BaseAnalyzer {
  async analyze(): Promise<AnalysisResult[]> {
    throw new Error('Mock analysis failure');
  }
}

describe('Runner', () => {
  let runner: Runner;
  let mockAnalyzer: MockAnalyzer;
  let config: RunnerConfig;

  beforeEach(() => {
    config = {
      reportConfig: { outputPath: './reports' },
    };
    runner = new Runner(config);
    mockAnalyzer = new MockAnalyzer({ targetPath: './mock' });
  });

  describe('Analyzer Registration', () => {
    test('registers analyzer successfully', () => {
      runner.registerAnalyzer(mockAnalyzer);
      expect(runner['analyzers']).toContain(mockAnalyzer);
    });
  });

  describe('Analysis Execution', () => {
    test('runs all analyzers successfully', async () => {
      runner.registerAnalyzer(mockAnalyzer);
      const results = await runner.run();

      expect(results).toHaveLength(1);
      expect(results[0].analyzer).toBe('MockAnalyzer');
      expect(results[0].severity).toBe('info');
    });

    test('handles analyzer failures', async () => {
      const failingAnalyzer = new FailingAnalyzer({ targetPath: './mock' });
      runner.registerAnalyzer(failingAnalyzer);

      const results = await runner.run();
      expect(results[0].severity).toBe('error');
      expect(results[0].message).toContain('Mock analysis failure');
    });

    test('runs single analyzer by name', async () => {
      runner.registerAnalyzer(mockAnalyzer);
      const results = await runner.runSingle('MockAnalyzer');

      expect(results).toHaveLength(1);
      expect(results[0].analyzer).toBe('MockAnalyzer');
    });

    test('throws error for non-existent analyzer', async () => {
      await expect(runner.runSingle('NonExistentAnalyzer')).rejects.toThrow(
        'Analyzer NonExistentAnalyzer not found'
      );
    });
  });

  describe('Report Generation', () => {
    test('generates report after analysis', async () => {
      const reportSpy = jest.spyOn(Reporter.prototype, 'generateReport');
      runner.registerAnalyzer(mockAnalyzer);

      await runner.run();
      expect(reportSpy).toHaveBeenCalled();
    });
  });
});

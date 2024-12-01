// src/core/Runner.ts
import { IntegratedAnalyzer } from './analyzers';
import { BaseAnalyzer } from './analyzers/BaseAnalyzer';
import { Reporter } from './Reporter';
import { RunnerConfig, AnalyzerResult } from '@/types';

export class Runner {
  private analyzers: BaseAnalyzer[];
  private reporter: Reporter;

  constructor(analyzers: BaseAnalyzer[]) {
    this.analyzers = analyzers;
  }
  
  constructor(config: RunnerConfig) {
    this.analyzers = [];
    this.reporter = new Reporter(config.reportConfig);
  }

  registerAnalyzer(analyzer: BaseAnalyzer): void {
    this.analyzers.push(analyzer);
  }

  async runAll(): Promise<AnalyzerResult[]> {
    const results: AnalysisResult[] = [];

      for (const analyzer of this.analyzers) {
      try {
        const result = await analyzer.analyze();
        results.push(result);
      } catch (error) {
        results.push({
          analyzer: analyzer.constructor.name,
          status: 'error',
          severity: 'error',
          message: `Analyzer failed: ${error.message}`,
          timestamp: Date.now(),
        });
      }
    }

    await this.reporter.generateReport(results);
    return results;
  }

  async runSingle(analyzerName: string): Promise<AnalysisResult[]> {
    const analyzer = this.analyzers.find((a) => a.constructor.name === analyzerName);

    if (!analyzer) {
      throw new Error(`Analyzer ${analyzerName} not found`);
    }

    const results = await analyzer.analyze();
    await this.reporter.generateReport(results);
    return results;
  }
}

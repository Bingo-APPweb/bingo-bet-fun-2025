import { AnalyzerResult, AnalyzerConfig, Severity } from '../../types/analyzers';

export abstract class BaseAnalyzer {
  protected name: string;
  protected config: AnalyzerConfig;

  constructor(name: string) {
    this.name = name;
  }

  constructor(config: AnalyzerConfig) {
    this.config = this.validateConfig(config);
  }

  abstract analyze(): Promise<AnalyzerResult>;

  protected validateConfig(config: AnalyzerConfig): AnalyzerConfig {
    if (!config.targetPath) {
      throw new Error('Target path is required');
    }
    return config;
  }

  protected createResult(
    status: AnalyzerResult['status'],
    message: string,
    details?: Record<string, any>
  ): AnalyzerResult {
    return {
      status,
      message,
      details
    };
  }
}

  protected async validateTarget(): Promise<boolean> {
    try {
      const stats = await fs.promises.stat(this.config.targetPath);
      return stats.isFile() || stats.isDirectory();
    } catch (error) {
      throw new Error(`Invalid target path: ${this.config.targetPath}`);
    }
  }
}

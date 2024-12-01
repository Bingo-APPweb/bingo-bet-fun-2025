// src/analyzers/BaseAnalyzer.ts
export abstract class BaseAnalyzer {
  protected PROJECT_ROOT: string;
  protected PATHS: Record<string, string>;

  constructor(projectRoot: string) {
    this.PROJECT_ROOT = projectRoot;
    this.PATHS = this.initializePaths();
  }

  protected abstract initializePaths(): Record<string, string>;
  protected abstract analyze(): Promise<any[]>;

  protected async findFiles(dir: string, extensions: string[]): Promise<string[]> {
    // Implementação do método findFiles
  }
}

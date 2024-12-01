// src/analyzers/HookAnalyzer.ts
export class HookAnalyzer extends BaseAnalyzer {
  protected initializePaths() {
    return {
      hooks: join(this.PROJECT_ROOT, 'src/hooks'),
    };
  }

  public async analyze(): Promise<HookAnalysis[]> {
    const hookFiles = await this.findFiles(this.PATHS.hooks, ['.ts', '.tsx']);
    return await Promise.all(hookFiles.map((file) => this.analyzeHook(file)));
  }

  private async analyzeHook(file: string): Promise<HookAnalysis> {
    const content = await fs.readFile(file, 'utf-8');
    const name = this.getFileName(file);
    const dependencies = this.extractImports(content);
    const returnType = this.extractReturnType(content);
    const useEffects = (content.match(/useEffect/g) || []).length;
    const useStates = (content.match(/useState/g) || []).length;
    const customHooks = this.extractCustomHooks(content);
    const issues = this.analyzeHookIssues(content);

    return {
      name,
      path: file,
      dependencies,
      returnType,
      useEffects,
      useStates,
      customHooks,
      issues,
    };
  }

  private analyzeHookIssues(content: string) {
    const issues = [];

    // Verifica número de useEffects
    const useEffectCount = (content.match(/useEffect/g) || []).length;
    if (useEffectCount > 3) {
      issues.push({
        severity: 'medium',
        message: `Hook usa ${useEffectCount} useEffects`,
        suggestion: 'Considere dividir em múltiplos hooks',
      });
    }

    // Verifica complexidade
    const complexity = (content.match(/if|else|switch|\?/g) || []).length;
    if (complexity > 5) {
      issues.push({
        severity: 'high',
        message: 'Hook com alta complexidade condicional',
        suggestion: 'Simplifique a lógica ou divida em hooks menores',
      });
    }

    return issues;
  }
}

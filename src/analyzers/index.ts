// src/analyzers/index.ts
import { ComponentAnalyzer } from './ComponentAnalyzer';
import { ServiceAnalyzer } from './ServiceAnalyzer';
import { HookAnalyzer } from './HookAnalyzer';
import { TypeAnalyzer } from './TypeAnalyzer';
import { ProjectConfig } from '../types';

export class ProjectAnalyzer {
  private readonly PROJECT_ROOT: string;
  private readonly componentAnalyzer: ComponentAnalyzer;
  private readonly serviceAnalyzer: ServiceAnalyzer;
  private readonly hookAnalyzer: HookAnalyzer;
  private readonly typeAnalyzer: TypeAnalyzer;

  constructor(projectRoot = 'BINGO-BET-FUN-2025') {
    this.PROJECT_ROOT = projectRoot;
    this.componentAnalyzer = new ComponentAnalyzer(projectRoot);
    this.serviceAnalyzer = new ServiceAnalyzer(projectRoot);
    this.hookAnalyzer = new HookAnalyzer(projectRoot);
    this.typeAnalyzer = new TypeAnalyzer(projectRoot);
  }

  public async analyzeProject(): Promise<void> {
    try {
      console.log('\n🔍 Iniciando análise do projeto...\n');

      const [components, services, hooks, types] = await Promise.all([
        this.componentAnalyzer.analyze(),
        this.serviceAnalyzer.analyze(),
        this.hookAnalyzer.analyze(),
        this.typeAnalyzer.analyze(),
      ]);

      const analysis = {
        components,
        services,
        hooks,
        types,
        overview: this.generateOverview(components, services, hooks, types),
        dependencies: await this.analyzeDependencies(),
        suggestions: this.generateSuggestions(components, services, hooks, types),
      };

      await this.generateReport(analysis);
      console.log('\n✨ Análise concluída com sucesso!\n');
    } catch (error) {
      console.error('\n❌ Erro durante a análise:', error);
      throw error;
    }
  }

  private generateOverview(components, services, hooks, types) {
    return {
      totalFiles: components.length + services.length + hooks.length + types.length,
      componentsCount: components.length,
      servicesCount: services.length,
      hooksCount: hooks.length,
      typesCount: types.length,
      issues: this.countIssues([...components, ...services, ...hooks, ...types]),
    };
  }

  private countIssues(items) {
    const issues = { high: 0, medium: 0, low: 0 };
    items.forEach((item) => {
      item.issues.forEach((issue) => {
        issues[issue.severity]++;
      });
    });
    return issues;
  }
}

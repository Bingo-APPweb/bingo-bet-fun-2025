// src/analyzers/ServiceAnalyzer.ts
import { BaseAnalyzer } from './BaseAnalyzer';
import { ServiceAnalysis, Method } from '../types';
import { promises as fs } from 'fs';
import { join } from 'path';

export class ServiceAnalyzer extends BaseAnalyzer {
  protected initializePaths() {
    return {
      services: join(this.PROJECT_ROOT, 'src/services'),
    };
  }

  public async analyze(): Promise<ServiceAnalysis[]> {
    const serviceFiles = await this.findFiles(this.PATHS.services, ['.ts']);
    return await Promise.all(serviceFiles.map((file) => this.analyzeService(file)));
  }

  private async analyzeService(file: string): Promise<ServiceAnalysis> {
    const content = await fs.readFile(file, 'utf-8');
    const name = this.getFileName(file);
    const methods = this.extractMethods(content);
    const dependencies = this.extractImports(content);
    const issues = this.analyzeServiceIssues(content, methods);

    return {
      name,
      path: file,
      methods,
      dependencies,
      issues,
    };
  }

  private extractMethods(content: string): Method[] {
    const methodRegex = /(?:public|private)?\s*async?\s+(\w+)\s*\((.*?)\)(?:\s*:\s*([^{]+))?/g;
    const methods: Method[] = [];
    let match;

    while ((match = methodRegex.exec(content)) !== null) {
      const [, name, params, returnType] = match;
      methods.push({
        name,
        params: params
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        returnType: returnType?.trim() || 'void',
        complexity: this.calculateMethodComplexity(content, name),
      });
    }

    return methods;
  }

  private calculateMethodComplexity(content: string, methodName: string): number {
    const methodContent = this.extractMethodContent(content, methodName);
    return (methodContent.match(/if|else|for|while|switch|catch|\?/g) || []).length + 1;
  }

  private analyzeServiceIssues(content: string, methods: Method[]) {
    const issues = [];

    // Verifica métodos muito complexos
    methods.forEach((method) => {
      if (method.complexity > 10) {
        issues.push({
          severity: 'high',
          message: `Método ${method.name} tem alta complexidade (${method.complexity})`,
          suggestion: 'Considere dividir em métodos menores',
        });
      }
    });

    // Verifica tamanho do serviço
    if (methods.length > 10) {
      issues.push({
        severity: 'medium',
        message: 'Serviço com muitos métodos',
        suggestion: 'Considere dividir em múltiplos serviços',
      });
    }

    return issues;
  }
}

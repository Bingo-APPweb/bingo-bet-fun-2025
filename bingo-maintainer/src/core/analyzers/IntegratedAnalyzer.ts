// src/core/analyzers/IntegratedAnalyzer.ts
import { CodeComplexityAnalyzer } from './CodeComplexityAnalyzer';
import { EventEmitter } from 'events';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

interface AnalyzerConfig {
  rules: {
    complexity: number;
    minDuplicateLength: number;
    maxFileSize: number;
    minTestCoverage: number;
    naming: {
      components: string;
      hooks: string;
      utils: string;
    };
  };
  autoFix: boolean;
  fixLevel: 'safe' | 'aggressive';
}

export class IntegratedAnalyzer extends EventEmitter {
  private config: AnalyzerConfig;
  private complexityAnalyzer: CodeComplexityAnalyzer;
  private fixes: Map<string, AutoFix[]> = new Map();

  constructor(config: AnalyzerConfig) {
    super();
    this.config = config;
    this.complexityAnalyzer = new CodeComplexityAnalyzer(config);
  }

  async analyzeAndFix(filePath: string, code: string) {
    try {
      // Fase 1: Análise Completa
      const analysis = await this.runAllAnalysis(filePath, code);

      // Fase 2: Determinar Correções
      const fixes = this.determineFixes(analysis);

      // Fase 3: Aplicar Correções (se autoFix estiver ativado)
      if (this.config.autoFix && fixes.length > 0) {
        const fixedCode = await this.applyFixes(code, fixes);

        // Fase 4: Re-análise após correções
        const reanalysis = await this.runAllAnalysis(filePath, fixedCode);

        return {
          original: analysis,
          fixes: fixes,
          fixed: fixedCode,
          reanalysis,
        };
      }

      return { original: analysis, fixes: [] };
    } catch (error) {
      this.emit('analysis-error', { filePath, error });
      throw error;
    }
  }

  private async runAllAnalysis(filePath: string, code: string) {
    const analysis = {
      complexity: await this.complexityAnalyzer.analyze(filePath, code),
      patterns: await this.analyzePatterns(code),
      performance: await this.analyzePerformance(code),
      security: await this.analyzeSecurity(code),
      style: await this.analyzeStyle(code),
    };

    return analysis;
  }

  private async analyzePatterns(code: string) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const patterns = {
      antiPatterns: [] as string[],
      recommendations: [] as string[],
    };

    traverse(ast, {
      // Detecta uso de setState com props
      CallExpression(path) {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.property, { name: 'setState' })
        ) {
          const argument = path.node.arguments[0];
          if (t.isObjectExpression(argument)) {
            // Verifica uso de props dentro do setState
            path.traverse({
              MemberExpression(innerPath) {
                if (
                  t.isIdentifier(innerPath.node.object, { name: 'props' }) &&
                  !path.scope.hasBinding('props')
                ) {
                  patterns.antiPatterns.push(
                    'Using props directly in setState can cause issues with updates'
                  );
                }
              },
            });
          }
        }
      },

      // Detecta componentes sem memo
      FunctionDeclaration(path) {
        if (path.node.id && /[A-Z]/.test(path.node.id.name[0])) {
          let hasMemo = false;
          path.parentPath.traverse({
            CallExpression(memoPath) {
              if (
                t.isIdentifier(memoPath.node.callee, { name: 'memo' }) &&
                t.isIdentifier(memoPath.node.arguments[0], { name: path.node.id!.name })
              ) {
                hasMemo = true;
              }
            },
          });

          if (!hasMemo) {
            patterns.recommendations.push(
              `Consider using React.memo for component ${path.node.id.name}`
            );
          }
        }
      },
    });

    return patterns;
  }

  private async analyzePerformance(code: string) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const performance = {
      issues: [] as string[],
      suggestions: [] as string[],
    };

    traverse(ast, {
      // Detecta criação de objetos em renders
      JSXElement(path) {
        path.traverse({
          ObjectExpression(objPath) {
            if (!objPath.scope.hasBinding('useCallback') && !objPath.scope.hasBinding('useMemo')) {
              performance.issues.push('Object created inside render - consider memoization');
            }
          },
        });
      },

      // Detecta arrays inline em deps
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'useEffect' }) ||
          t.isIdentifier(path.node.callee, { name: 'useMemo' }) ||
          t.isIdentifier(path.node.callee, { name: 'useCallback' })
        ) {
          const deps = path.node.arguments[1];
          if (t.isArrayExpression(deps)) {
            deps.elements.forEach((element) => {
              if (t.isArrayExpression(element) || t.isObjectExpression(element)) {
                performance.issues.push(
                  'Inline array/object in dependency array - will cause infinite updates'
                );
              }
            });
          }
        }
      },
    });

    return performance;
  }

  private async analyzeSecurity(code: string) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const security = {
      vulnerabilities: [] as string[],
      warnings: [] as string[],
    };

    traverse(ast, {
      // Detecta uso de dangerouslySetInnerHTML
      JSXAttribute(path) {
        if (t.isJSXIdentifier(path.node.name, { name: 'dangerouslySetInnerHTML' })) {
          security.vulnerabilities.push('Using dangerouslySetInnerHTML - XSS risk');
        }
      },

      // Detecta eval e similares
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'eval' }) ||
          t.isIdentifier(path.node.callee, { name: 'Function' })
        ) {
          security.vulnerabilities.push('Using eval or Function constructor - security risk');
        }
      },
    });

    return security;
  }

  private async analyzeStyle(code: string) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const style = {
      issues: [] as string[],
      suggestions: [] as string[],
    };

    traverse(ast, {
      // Verifica convenções de nomenclatura
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (name) {
          if (
            name[0].toUpperCase() === name[0] &&
            !name.match(this.config.rules.naming.components)
          ) {
            style.issues.push(`Component ${name} does not follow naming convention`);
          }
        }
      },

      // Verifica uso de CSS inline
      JSXAttribute(path) {
        if (t.isJSXIdentifier(path.node.name, { name: 'style' })) {
          style.suggestions.push('Consider using Tailwind classes instead of inline styles');
        }
      },
    });

    return style;
  }

  private determineFixes(analysis: any): AutoFix[] {
    const fixes: AutoFix[] = [];

    // Fixes para complexidade
    if (analysis.complexity.metrics.cyclomaticComplexity > this.config.rules.complexity) {
      analysis.complexity.details.complexFunctions.forEach((func: any) => {
        fixes.push({
          type: 'complexity',
          location: func.loc,
          fix: this.generateComplexityFix(func),
        });
      });
    }

    // Fixes para padrões
    analysis.patterns.antiPatterns.forEach((pattern: string) => {
      fixes.push({
        type: 'pattern',
        description: pattern,
        fix: this.generatePatternFix(pattern),
      });
    });

    // Fixes para performance
    analysis.performance.issues.forEach((issue: string) => {
      fixes.push({
        type: 'performance',
        description: issue,
        fix: this.generatePerformanceFix(issue),
      });
    });

    return fixes;
  }

  private async applyFixes(code: string, fixes: AutoFix[]): Promise<string> {
    let fixedCode = code;
    const ast = parser.parse(fixedCode, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    // Aplica as correções em ordem
    for (const fix of fixes) {
      switch (fix.type) {
        case 'complexity':
          fixedCode = await this.applyComplexityFix(fixedCode, fix);
          break;
        case 'pattern':
          fixedCode = await this.applyPatternFix(fixedCode, fix);
          break;
        case 'performance':
          fixedCode = await this.applyPerformanceFix(fixedCode, fix);
          break;
      }
    }

    return fixedCode;
  }

  private generateComplexityFix(func: any): string {
    // Implementação da geração de fix para complexidade
    return `
// Sugestão de refatoração para ${func.name}:
// 1. Dividir em subfunções menores
// 2. Usar early returns
// 3. Simplificar condicionais
`;
  }

  private generatePatternFix(pattern: string): string {
    // Implementação da geração de fix para padrões
    return `
// Sugestão de correção para ${pattern}:
// 1. Usar padrões recomendados
// 2. Seguir boas práticas React
`;
  }

  private generatePerformanceFix(issue: string): string {
    // Implementação da geração de fix para performance
    return `
// Sugestão de otimização para ${issue}:
// 1. Usar memoização
// 2. Otimizar renders
`;
  }

  private async applyComplexityFix(code: string, fix: AutoFix): Promise<string> {
    // Implementação da aplicação de fix para complexidade
    return code;
  }

  private async applyPatternFix(code: string, fix: AutoFix): Promise<string> {
    // Implementação da aplicação de fix para padrões
    return code;
  }

  private async applyPerformanceFix(code: string, fix: AutoFix): Promise<string> {
    // Implementação da aplicação de fix para performance
    return code;
  }
}

interface AutoFix {
  type: 'complexity' | 'pattern' | 'performance' | 'security' | 'style';
  location?: any;
  description?: string;
  fix: string;
}

// src/core/analyzers/CodeComplexityAnalyzer.ts
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { BaseAnalyzer } from './BaseAnalyzer';
import type { ComplexityReport, CodeBlock, DuplicationInfo } from '../types/analysis';

export class CodeComplexityAnalyzer extends BaseAnalyzer {
  private readonly COMPLEXITY_THRESHOLD: number;
  private readonly MIN_DUPLICATE_LENGTH: number;
  private readonly codeBlocks: Map<string, CodeBlock> = new Map();

  constructor(config: Record<string, any>) {
    super(config);
    this.COMPLEXITY_THRESHOLD = config.rules.complexity || 10;
    this.MIN_DUPLICATE_LENGTH = config.rules.minDuplicateLength || 5;
  }

  async analyze(filePath: string, code: string): Promise<ComplexityReport> {
    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const complexityMetrics = this.analyzeComplexity(ast);
      const duplications = await this.findDuplications(code);

      const report: ComplexityReport = {
        filePath,
        timestamp: Date.now(),
        metrics: {
          cyclomaticComplexity: complexityMetrics.complexity,
          duplicateBlocks: duplications.length,
          duplicateLines: this.calculateDuplicateLines(duplications),
          maintainabilityIndex: this.calculateMaintainabilityIndex(complexityMetrics),
        },
        issues: this.generateIssues(complexityMetrics, duplications),
        details: {
          complexFunctions: complexityMetrics.complexFunctions,
          duplications,
        },
      };

      this.emit('analysis-complete', report);
      return report;
    } catch (error) {
      this.emit('analysis-error', { filePath, error });
      throw error;
    }
  }

  private analyzeComplexity(ast: any) {
    const complexityMetrics = {
      complexity: 0,
      complexFunctions: [] as Array<{
        name: string;
        complexity: number;
        loc: { start: { line: number; column: number } };
      }>,
    };

    traverse(ast, {
      enter: (path) => {
        // Incrementa complexidade para estruturas de controle
        if (
          path.isIfStatement() ||
          path.isWhileStatement() ||
          path.isForStatement() ||
          path.isForOfStatement() ||
          path.isForInStatement() ||
          path.isSwitchCase() ||
          path.isConditionalExpression()
        ) {
          complexityMetrics.complexity++;
        }

        // Análise de funções
        if (
          path.isFunctionDeclaration() ||
          path.isFunctionExpression() ||
          path.isArrowFunctionExpression()
        ) {
          const functionName = path.node.id?.name || 'anonymous';
          const functionComplexity = this.calculateFunctionComplexity(path);

          if (functionComplexity > this.COMPLEXITY_THRESHOLD) {
            complexityMetrics.complexFunctions.push({
              name: functionName,
              complexity: functionComplexity,
              loc: path.node.loc?.start,
            });
          }
        }
      },
    });

    return complexityMetrics;
  }

  private calculateFunctionComplexity(path: any): number {
    let complexity = 1; // Base complexity

    path.traverse({
      enter: (childPath: any) => {
        if (
          childPath.isIfStatement() ||
          childPath.isWhileStatement() ||
          childPath.isForStatement() ||
          childPath.isForOfStatement() ||
          childPath.isForInStatement() ||
          childPath.isSwitchCase() ||
          childPath.isConditionalExpression() ||
          childPath.isLogicalExpression({ operator: '&&' }) ||
          childPath.isLogicalExpression({ operator: '||' })
        ) {
          complexity++;
        }
      },
    });

    return complexity;
  }

  private async findDuplications(code: string): Promise<DuplicationInfo[]> {
    const lines = code.split('\n');
    const duplications: DuplicationInfo[] = [];
    const hashMap = new Map<string, number[]>();

    // Sliding window para encontrar duplicações
    for (let i = 0; i <= lines.length - this.MIN_DUPLICATE_LENGTH; i++) {
      for (let windowSize = this.MIN_DUPLICATE_LENGTH; windowSize <= 20; windowSize++) {
        if (i + windowSize > lines.length) break;

        const block = lines.slice(i, i + windowSize).join('\n');
        const hash = this.hashCode(block);

        if (!hashMap.has(hash)) {
          hashMap.set(hash, [i]);
        } else {
          const positions = hashMap.get(hash)!;
          if (!positions.includes(i)) {
            positions.push(i);
            duplications.push({
              code: block,
              lines: windowSize,
              occurrences: positions.length,
              positions: positions.map((pos) => ({
                start: pos,
                end: pos + windowSize,
              })),
            });
          }
        }
      }
    }

    return duplications;
  }

  private calculateMaintainabilityIndex(metrics: any): number {
    // Fórmula do índice de manutenibilidade
    // MI = 171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)
    const HV = metrics.complexity * Math.log(metrics.complexity); // Volume Halstead
    const CC = metrics.complexity; // Complexidade Ciclomática
    const LOC = metrics.complexFunctions.length; // Linhas de Código

    return Math.max(0, Math.min(100, 171 - 5.2 * Math.log(HV) - 0.23 * CC - 16.2 * Math.log(LOC)));
  }

  private generateIssues(complexityMetrics: any, duplications: DuplicationInfo[]) {
    const issues = [];

    // Problemas de complexidade
    for (const func of complexityMetrics.complexFunctions) {
      if (func.complexity > this.COMPLEXITY_THRESHOLD) {
        issues.push({
          type: 'complexity',
          severity: func.complexity > this.COMPLEXITY_THRESHOLD * 1.5 ? 'high' : 'medium',
          message: `Function ${func.name} has high cyclomatic complexity (${func.complexity})`,
          location: func.loc,
          suggestedFix: 'Consider breaking down the function into smaller, more manageable pieces',
        });
      }
    }

    // Problemas de duplicação
    for (const dup of duplications) {
      if (dup.lines >= this.MIN_DUPLICATE_LENGTH) {
        issues.push({
          type: 'duplication',
          severity: dup.lines > this.MIN_DUPLICATE_LENGTH * 2 ? 'high' : 'medium',
          message: `Found ${dup.occurrences} occurrences of duplicated code (${dup.lines} lines)`,
          location: dup.positions[0],
          suggestedFix: 'Consider extracting duplicated code into a shared function or component',
        });
      }
    }

    return issues;
  }

  private hashCode(str: string): string {
    return require('crypto').createHash('md5').update(str).digest('hex');
  }

  private calculateDuplicateLines(duplications: DuplicationInfo[]): number {
    return duplications.reduce((total, dup) => total + dup.lines * (dup.occurrences - 1), 0);
  }
}

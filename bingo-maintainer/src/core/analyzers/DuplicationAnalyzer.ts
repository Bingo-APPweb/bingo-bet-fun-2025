// src/core/analyzers/DuplicationAnalyzer.ts
import { BaseAnalyzer } from './BaseAnalyzer';
import { DuplicationAnalysis, CodeBlock } from '../../types/analyzers';
import { createHash } from 'crypto';

export class DuplicationAnalyzer extends BaseAnalyzer {
  private readonly minDuplicationLength: number;
  private readonly similarityThreshold: number;
  private codeBlockMap: Map<string, CodeBlock[]>;

  constructor(config: any) {
    super(config);
    this.minDuplicationLength = config.duplication?.minLength || 5;
    this.similarityThreshold = config.duplication?.similarityThreshold || 0.9;
    this.codeBlockMap = new Map();
  }

  async analyze(code: string, filePath: string): Promise<DuplicationAnalysis> {
    const lines = code.split('\n');
    const duplications: CodeBlock[] = [];
    const processedHashes = new Set<string>();

    // Analyze code blocks for duplications
    for (let i = 0; i < lines.length - this.minDuplicationLength + 1; i++) {
      for (let j = this.minDuplicationLength; j <= Math.min(30, lines.length - i); j++) {
        const block = lines.slice(i, i + j).join('\n');
        const hash = this.hashCode(block);

        if (processedHashes.has(hash)) continue;
        processedHashes.add(hash);

        const similarBlocks = this.findSimilarBlocks(block, filePath);
        if (similarBlocks.length > 1) {
          duplications.push({
            code: block,
            locations: similarBlocks.map((b) => b.location),
            lineCount: j,
            similarity: similarBlocks[0].similarity,
          });
        }
      }
    }

    return {
      filePath,
      timestamp: Date.now(),
      duplications,
      metrics: {
        totalDuplications: duplications.length,
        duplicatedLines: this.calculateDuplicatedLines(duplications),
        largestDuplication: this.findLargestDuplication(duplications),
      },
      suggestions: this.generateSuggestions(duplications),
    };
  }

  private hashCode(text: string): string {
    return createHash('md5').update(text).digest('hex');
  }

  private findSimilarBlocks(
    block: string,
    currentFile: string
  ): Array<{
    location: string;
    similarity: number;
  }> {
    const similarBlocks: Array<{ location: string; similarity: number }> = [];
    const blockTokens = this.tokenize(block);

    this.codeBlockMap.forEach((blocks, file) => {
      if (file !== currentFile) {
        blocks.forEach((existingBlock) => {
          const similarity = this.calculateSimilarity(
            blockTokens,
            this.tokenize(existingBlock.code)
          );

          if (similarity >= this.similarityThreshold) {
            similarBlocks.push({
              location: `${file}:${existingBlock.location}`,
              similarity,
            });
          }
        });
      }
    });

    return similarBlocks;
  }

  private tokenize(code: string): string[] {
    // Simple tokenization - could be enhanced with a proper parser
    return code.split(/[\s,{}()[\];]/).filter((token) => token.length > 0);
  }

  private calculateSimilarity(tokens1: string[], tokens2: string[]): number {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));

    return (2.0 * intersection.size) / (set1.size + set2.size);
  }

  private calculateDuplicatedLines(duplications: CodeBlock[]): number {
    return duplications.reduce((total, dup) => total + dup.lineCount, 0);
  }

  private findLargestDuplication(duplications: CodeBlock[]): number {
    return duplications.reduce((max, dup) => Math.max(max, dup.lineCount), 0);
  }

  private generateSuggestions(duplications: CodeBlock[]): string[] {
    const suggestions: string[] = [];

    if (duplications.length > 0) {
      suggestions.push('Consider extracting duplicated code into reusable functions or components');

      if (this.hasLargeDuplications(duplications)) {
        suggestions.push('Large code duplications detected. Consider implementing a shared module');
      }

      if (this.hasCrossDuplications(duplications)) {
        suggestions.push(
          'Cross-file duplications found. Review architecture for potential abstraction opportunities'
        );
      }
    }

    return suggestions;
  }

  private hasLargeDuplications(duplications: CodeBlock[]): boolean {
    return duplications.some((dup) => dup.lineCount > 20);
  }

  private hasCrossDuplications(duplications: CodeBlock[]): boolean {
    return duplications.some(
      (dup) =>
        dup.locations.length > 1 && new Set(dup.locations.map((loc) => loc.split(':')[0])).size > 1
    );
  }
}

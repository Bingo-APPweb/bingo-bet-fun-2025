// src/tools/analyzer/index.ts
export { ProjectAnalyzer } from './ProjectAnalyzer.js';
export { runAnalysis } from './cli.js';
export * from './ProjectAnalyzer';
export * from './DependencyAnalyzer';

// Tipos exportados
export type { FileNode, AnalysisResult } from './ProjectAnalyzer.js';

// Função auxiliar para iniciar análise
export async function initializeAnalyzer(projectPath: string) {
  const analyzer = new ProjectAnalyzer(projectPath);
  return analyzer;
}

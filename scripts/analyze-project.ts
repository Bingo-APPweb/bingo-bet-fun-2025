#!/usr/bin/env node
import { ProjectAnalyzer } from '../src/analyzers';
import { initializeAnalyzer } from '../src/tools/analyzer/index.js';
import { join } from 'path';
import chalk from 'chalk';

class AnalyzerCLI {
  private analyzer: ProjectAnalyzer;

  constructor() {
    const projectRoot = process.env.PROJECT_ROOT || 'BINGO-BET-FUN-2025';
    this.analyzer = new ProjectAnalyzer(projectRoot);
  }

  async run() {
    try {
      console.log(chalk.blue('\n🔍 Iniciando análise do projeto...\n'));

      const startTime = Date.now();
      await this.analyzer.analyzeProject();
      const endTime = Date.now();

      console.log(chalk.green(`\n✨ Análise concluída em ${(endTime - startTime) / 1000}s!\n`));
    } catch (error) {
      console.error(chalk.red('\n❌ Erro durante a análise:'), error);
      process.exit(1);
    }
  }
}

async function analyzeProject() {
  try {
    const projectRoot = join(process.cwd());
    const analyzer = await initializeAnalyzer(projectRoot);
    const results = await analyzer.analyze();

    // Log dos resultados
    console.log('Análise do Projeto Completa:');
    console.table({
      'Arquivos Deslocados': results.misplacedFiles.length,
      'Nomenclatura Inconsistente': results.inconsistentNaming.length,
      'Dependências Circulares': results.circularDependencies.length,
      'Dependências Ausentes': results.missingDependencies.size,
    });

    // Salvar resultados se necessário
    await saveResults(results);
  } catch (error) {
    console.error('Erro durante análise:', error);
    process.exit(1);
  }
}

async function saveResults(results: any) {
  // Implementar salvamento dos resultados se necessário
}

// Executa o CLI
const cli = new AnalyzerCLI();
cli.run().catch(console.error);

// Executar análise
analyzeProject();

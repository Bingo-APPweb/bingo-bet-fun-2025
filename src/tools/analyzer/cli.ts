// src/tools/analyzer/cli.ts
import { ProjectAnalyzer } from './ProjectAnalyzer.js';
import chalk from 'chalk';

async function runAnalysis(projectPath: string) {
  console.log(chalk.blue('🔍 Iniciando análise do projeto...'));

  const analyzer = new ProjectAnalyzer(projectPath);
  const results = await analyzer.analyze();

  console.log('\n📊 Resultados da Análise:\n');

  if (results.misplacedFiles.length > 0) {
    console.log(chalk.yellow('⚠️  Arquivos em Diretórios Incorretos:'));
    results.misplacedFiles.forEach((file) => {
      console.log(`  - ${file}`);
      console.log(`    ${chalk.green('Sugestão:')} ${results.suggestions.get(file)}`);
    });
  }

  if (results.inconsistentNaming.length > 0) {
    console.log(chalk.yellow('\n⚠️  Nomenclatura Inconsistente:'));
    results.inconsistentNaming.forEach((file) => {
      console.log(`  - ${file}`);
    });
  }

  if (results.missingDependencies.size > 0) {
    console.log(chalk.red('\n❌ Dependências Ausentes:'));
    results.missingDependencies.forEach((missing, file) => {
      console.log(`  ${file}:`);
      missing.forEach((dep) => console.log(`    - ${dep}`));
    });
  }

  if (results.circularDependencies.length > 0) {
    console.log(chalk.red('\n🔄 Dependências Circulares:'));
    results.circularDependencies.forEach((cycle) => {
      console.log(`  ${cycle.join(' -> ')} -> ${cycle[0]}`);
    });
  }

  console.log('\n✨ Sugestões de Melhorias:');
  results.suggestions.forEach((suggestion, path) => {
    console.log(`  ${path}:`);
    console.log(`    ${chalk.green(suggestion)}`);
  });
}

// Use IIFE para executar código assíncrono no top-level
(async () => {
  try {
    const projectPath = process.argv[2] || '.';
    await runAnalysis(projectPath);
  } catch (error) {
    console.error(chalk.red('Erro durante a análise:'), error);
    process.exit(1);
  }
})();

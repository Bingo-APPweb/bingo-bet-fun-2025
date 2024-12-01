import { ProjectAnalyzer } from './ProjectAnalyzer';

async function main() {
  try {
    const analyzer = new ProjectAnalyzer(process.cwd());
    await analyzer.initialize();
    const results = await analyzer.analyze();

    console.log('\nResultados da Análise:');
    console.log('---------------------');

    // Dependências
    console.log('\nDependências:');
    console.log(`- Total de arquivos analisados: ${results.dependencies?.size || 0}`);
    console.log(
      `- Dependências circulares encontradas: ${results.circularDependencies?.length || 0}`
    );
    console.log(`- Arquivos com dependências faltando: ${results.missingDependencies?.size || 0}`);

    // Problemas estruturais
    console.log('\nProblemas Estruturais:');
    console.log(`- Arquivos órfãos: ${results.orphanedFiles?.length || 0}`);
    console.log(`- Problemas estruturais: ${results.structuralIssues?.length || 0}`);
    console.log(`- Problemas de nomenclatura: ${results.namingIssues?.length || 0}`);
    console.log(`- Arquivos mal posicionados: ${results.misplacedFiles?.length || 0}`);

    // Sugestões
    if (results.suggestions && results.suggestions.length > 0) {
      console.log('\nSugestões de Melhorias:');
      results.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }

    // Debug - Mostrar estrutura completa dos resultados
    console.log('\nEstrutura completa dos resultados:');
    console.log(
      JSON.stringify(
        results,
        (_key, value) => {
          if (value instanceof Map) {
            return Object.fromEntries(value);
          }
          if (value instanceof Set) {
            return Array.from(value);
          }
          return value;
        },
        2
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro durante a análise:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Erro desconhecido durante a análise:', error);
    }
  }
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error('Erro fatal:', error.message);
    console.error('Stack trace:', error.stack);
  } else {
    console.error('Erro fatal desconhecido:', error);
  }
});

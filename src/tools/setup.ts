// src/tools/setup.ts
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

async function setupAnalyzerStructure() {
  const toolsDir = join(process.cwd(), 'src', 'tools', 'analyzer');

  try {
    // Criar diretórios
    await mkdir(toolsDir, { recursive: true });

    // Criar arquivo ProjectAnalyzer.ts se não existir
    const analyzerPath = join(toolsDir, 'ProjectAnalyzer.ts');
    const analyzerContent = `
export class ProjectAnalyzer {
  constructor(private projectPath: string) {}

  async analyze() {
    return {
      misplacedFiles: [],
      suggestions: new Map()
    };
  }
}`;

    await writeFile(analyzerPath, analyzerContent, 'utf-8');

    console.log('✅ Estrutura do analisador configurada com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar estrutura:', error);
  }
}

setupAnalyzerStructure();

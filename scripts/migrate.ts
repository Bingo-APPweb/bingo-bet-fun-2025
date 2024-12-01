// scripts/migrate.ts
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function migrateLegacyFiles() {
  const legacyFiles = ['maintain.ts', 'BingoBetMaintainer.ts', 'BingoBetMaintainer.temp.ts'];

  try {
    // 1. Criar diretório legacy
    await mkdir('legacy', { recursive: true });

    // 2. Mover arquivos antigos para legacy com timestamp
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');

    for (const file of legacyFiles) {
      const content = await readFile(file, 'utf-8');

      // Backup com timestamp
      await writeFile(join('legacy', `${file.replace('.ts', '')}.${timestamp}.old`), content);

      console.log(`✓ Backup criado: ${file} -> legacy/${file}.${timestamp}.old`);
    }

    // 3. Criar arquivo de mapeamento para referência
    const mappingContent = {
      timestamp,
      files: legacyFiles,
      migrationDate: new Date().toISOString(),
      newStructure: {
        cli: 'bin/bingo-maintain.ts',
        core: 'src/core/*',
        types: 'src/types/*',
      },
    };

    await writeFile(join('legacy', 'migration-map.json'), JSON.stringify(mappingContent, null, 2));

    console.log('✓ Mapa de migração criado: legacy/migration-map.json');

    // 4. Criar arquivo de compatibilidade temporário
    const compatibilityLayer = `
    // @deprecated Use a nova estrutura em src/core
    import { BingoBetMaintainer as NewMaintainer } from './src/core';
    export const BingoBetMaintainer = NewMaintainer;
    `;

    await writeFile('compatibility.ts', compatibilityLayer);
    console.log('✓ Camada de compatibilidade criada: compatibility.ts');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  }
}

// Executar migração
migrateLegacyFiles().catch(console.error);

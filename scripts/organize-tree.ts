//organize-tree.ts com ES Modules

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { promises as fs } from 'node:fs';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração dos caminhos do projeto
const PROJECT_ROOT = 'BINGO-BET-FUN-2025';
const PATHS = {
  src: join(PROJECT_ROOT, 'src'),
  services: join(PROJECT_ROOT, 'src/services'),
  components: join(PROJECT_ROOT, 'src/components'),
  hooks: join(PROJECT_ROOT, 'src/hooks'),
  types: join(PROJECT_ROOT, 'src/types'),
  utils: join(PROJECT_ROOT, 'src/utils'),
  scripts: join(PROJECT_ROOT, 'scripts')
} as const;

// Mapeamento de estruturas e padrões
const STRUCTURE_MAP = {
  services: {
    pattern: /class\s+(\w+Service)\s+/,
    path: (name: string) => join(PATHS.services, name.toLowerCase(), `${name}.ts`)
  },
  hooks: {
    pattern: /^use\w+\.tsx?$/,
    path: (name: string, service: string) => join(PATHS.hooks, service, `${name}.ts`)
  },
  components: {
    pattern: /^(\w+)\.(tsx|jsx)$/,
    path: (name: string, service: string) => join(PATHS.components, service, `${name}.tsx`)
  },
  types: {
    pattern: /^types\.ts$/,
    path: (service: string) => join(PATHS.types, service, 'index.ts')
  }
} as const;

interface FileMap {
  source: string;
  destination: string;
  service: string;
  type: 'service' | 'component' | 'hook' | 'type';
}

// Função auxiliar para verificar existência de arquivo
async function exists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function organizeTree() {
  console.log(chalk.blue(`\n🌳 Iniciando organização da árvore do BINGO-BET-FUN-2025\n`));

  try {
    // 1. Verifica existência dos diretórios necessários
    await createDirectoryStructure();

    // 2. Encontra e mapeia arquivos
    const files = await findRelevantFiles(PATHS.src);
    const fileMap = await analyzeFiles(files);

    // 3. Reorganiza arquivos
    await reorganizeFiles(fileMap);

    // 4. Atualiza imports
    await updateProjectImports(fileMap);

    console.log(chalk.green('\n✨ Árvore organizada com sucesso!\n'));

    // 5. Gera relatório
    printReport(fileMap);
  } catch (error) {
    console.error(chalk.red('\n❌ Erro durante organização:'), error);
    process.exit(1);
  }
}

async function createDirectoryStructure() {
  console.log(chalk.blue('📁 Criando estrutura de diretórios...\n'));

  for (const dir of Object.values(PATHS)) {
    await fs.mkdir(dir, { recursive: true });
    console.log(chalk.gray(`  ✓ Criado/verificado: ${dir}`));
  }
}

async function findRelevantFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findRelevantFiles(fullPath)));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function analyzeFiles(files: string[]): Promise<FileMap[]> {
  const fileMap: FileMap[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const service = detectService(content);
    const type = detectFileType(file, content);

    if (type && service) {
      const destination = computeDestination(file, type, service);
      fileMap.push({ source: file, destination, service, type });
    }
  }

  return fileMap;
}

function detectService(content: string): string {
  // Detecta serviço baseado em imports e padrões
  const servicePatterns = [
    /import.*?from ['"]@\/services\/(\w+)/,
    /class\s+(\w+)Service/,
    /\/\/ *@service:? *(\w+)/,
  ];

  for (const pattern of servicePatterns) {
    const match = content.match(pattern);
    if (match) return match[1].toLowerCase();
  }

  return 'shared';
}

function detectFileType(
  file: string,
  content: string
): 'service' | 'component' | 'hook' | 'type' | null {
  const fileName = path.basename(file);

  if (content.includes('class') && content.includes('Service')) return 'service';
  if (fileName.startsWith('use')) return 'hook';
  if (fileName.includes('.tsx') || fileName.includes('.jsx')) return 'component';
  if (fileName.includes('types.ts')) return 'type';

  return null;
}

function computeDestination(file: string, type: string, service: string): string {
  const fileName = path.basename(file);
  const mapEntry = STRUCTURE_MAP[type as keyof typeof STRUCTURE_MAP];

  if (!mapEntry) return file;

  return mapEntry.path(fileName.replace(/\.[^/.]+$/, ''), service);
}

async function reorganizeFiles(fileMap: FileMap[]) {
  console.log(chalk.blue('\n🚀 Reorganizando arquivos...\n'));

  for (const { source, destination } of fileMap) {
    if (source === destination) continue;

    const destDir = path.dirname(destination);
    await fs.mkdir(destDir, { recursive: true });

    // Verifica se o arquivo já existe no destino
    if (await exists(destination)) {
      console.log(chalk.yellow(`  ⚠️ Arquivo já existe: ${destination}`));
      continue;
    }

    await fs.rename(source, destination);
    console.log(
      chalk.green('  ✓ Movido:'),
      chalk.gray(source),
      chalk.blue('→'),
      chalk.gray(destination)
    );
  }
}

async function updateProjectImports(fileMap: FileMap[]) {
  console.log(chalk.blue('\n📦 Atualizando imports no projeto...\n'));

  for (const { destination } of fileMap) {
    if (await exists(destination)) {
      let content = await fs.readFile(destination, 'utf-8');
      content = updateImportPaths(content, fileMap);
      await fs.writeFile(destination, content);
      console.log(chalk.gray(`  ✓ Imports atualizados: ${destination}`));
    }
  }
}

function updateImportPaths(content: string, fileMap: FileMap[]): string {
  return content.replace(/from\s+['"](@\/[^'"]+)['"]/g, (match, importPath) => {
    const newPath = resolveNewImportPath(importPath, fileMap);
    return `from '${newPath}'`;
  });
}

function resolveNewImportPath(importPath: string, fileMap: FileMap[]): string {
  // Converte importPath para caminho relativo baseado no novo mapeamento
  const mapping = fileMap.find((f) => importPath.includes(f.source));
  if (!mapping) return importPath;

  return `@/${path.relative(PATHS.src, mapping.destination).replace(/\\/g, '/')}`;
}

function printReport(fileMap: FileMap[]) {
  console.log(chalk.blue('\n📊 Relatório de Organização:\n'));

  const stats = {
    total: fileMap.length,
    services: fileMap.filter((f) => f.type === 'service').length,
    components: fileMap.filter((f) => f.type === 'component').length,
    hooks: fileMap.filter((f) => f.type === 'hook').length,
    types: fileMap.filter((f) => f.type === 'type').length,
  };

  console.log(chalk.white('  Arquivos processados:'));
  console.log(chalk.gray(`    • Total: ${stats.total}`));
  console.log(chalk.gray(`    • Serviços: ${stats.services}`));
  console.log(chalk.gray(`    • Componentes: ${stats.components}`));
  console.log(chalk.gray(`    • Hooks: ${stats.hooks}`));
  console.log(chalk.gray(`    • Types: ${stats.types}`));
}

// Auto-executa se rodado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    organizeTree().catch(error => {
      console.error(error);
      process.exit(1);
    });
  }
  
  export { organizeTree };
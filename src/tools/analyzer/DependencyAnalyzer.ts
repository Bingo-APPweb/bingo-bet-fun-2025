import { readFile } from 'fs/promises';
import { resolve } from 'path';

interface DependencyInfo {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

interface DependencyAnalysis {
  circular: string[][];
  outdated: { name: string; current: string; latest: string }[];
  missing: string[];
  unused: string[];
}

export class DependencyAnalyzer {
  private projectPath: string;
  private packageJson: DependencyInfo | null = null;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async initialize(): Promise<void> {
    try {
      const packageJsonPath = resolve(this.projectPath, 'package.json');
      const content = await readFile(packageJsonPath, 'utf-8');
      this.packageJson = JSON.parse(content);
    } catch (error) {
      throw new Error(`Erro ao ler package.json: ${error.message}`);
    }
  }

  async analyze(): Promise<DependencyAnalysis> {
    if (!this.packageJson) {
      throw new Error('Analisador não inicializado. Execute initialize() primeiro.');
    }

    return {
      circular: await this.findCircularDependencies(),
      outdated: await this.checkOutdatedDependencies(),
      missing: await this.findMissingDependencies(),
      unused: await this.findUnusedDependencies(),
    };
  }

  private async findCircularDependencies(): Promise<string[][]> {
    const circles: string[][] = [];
    const visited = new Set<string>();
    const path: string[] = [];

    const detectCircle = async (pkg: string) => {
      if (path.includes(pkg)) {
        const circle = path.slice(path.indexOf(pkg));
        circles.push([...circle, pkg]);
        return;
      }

      if (visited.has(pkg)) return;

      visited.add(pkg);
      path.push(pkg);

      const deps = this.packageJson?.dependencies[pkg] || {};
      for (const dep of Object.keys(deps)) {
        await detectCircle(dep);
      }

      path.pop();
    };

    const allDeps = {
      ...this.packageJson?.dependencies,
      ...this.packageJson?.devDependencies,
    };

    for (const pkg of Object.keys(allDeps)) {
      await detectCircle(pkg);
    }

    return circles;
  }

  private async checkOutdatedDependencies(): Promise<
    { name: string; current: string; latest: string }[]
  > {
    const outdated: { name: string; current: string; latest: string }[] = [];
    const allDeps = {
      ...this.packageJson?.dependencies,
      ...this.packageJson?.devDependencies,
    };

    // Aqui você pode implementar a lógica para verificar versões mais recentes
    // Por exemplo, usando a API do npm registry
    // Esta é uma implementação básica que precisa ser expandida
    for (const [name, version] of Object.entries(allDeps)) {
      try {
        const response = await fetch(`https://registry.npmjs.org/${name}`);
        const data = await response.json();
        const latest = data['dist-tags']?.latest;

        if (latest && latest !== version) {
          outdated.push({ name, current: version, latest });
        }
      } catch (error) {
        console.warn(`Erro ao verificar versão de ${name}: ${error.message}`);
      }
    }

    return outdated;
  }

  private async findMissingDependencies(): Promise<string[]> {
    const missing: string[] = [];
    // Implementar lógica para encontrar imports no código que não estão no package.json
    // Isso requer análise estática do código
    return missing;
  }

  private async findUnusedDependencies(): Promise<string[]> {
    const unused: string[] = [];
    // Implementar lógica para encontrar dependências listadas mas não utilizadas
    // Isso requer análise estática do código
    return unused;
  }
}

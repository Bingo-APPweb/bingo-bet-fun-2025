// src/analyzers/TypeAnalyzer.ts
export class TypeAnalyzer extends BaseAnalyzer {
  protected initializePaths() {
    return {
      types: join(this.PROJECT_ROOT, 'src/types'),
    };
  }

  public async analyze(): Promise<TypeAnalysis[]> {
    const typeFiles = await this.findFiles(this.PATHS.types, ['.ts']);
    return await Promise.all(typeFiles.map((file) => this.analyzeType(file)));
  }

  private async analyzeType(file: string): Promise<TypeAnalysis> {
    const content = await fs.readFile(file, 'utf-8');
    const name = this.getFileName(file);
    const exports = this.extractTypeExports(content);
    const dependencies = this.extractImports(content);
    const issues = this.analyzeTypeIssues(content);

    return {
      name,
      path: file,
      exports,
      dependencies,
      issues,
    };
  }

  private extractTypeExports(content: string) {
    const exports = [];
    const typeRegex = /(?:interface|type|enum)\s+(\w+)/g;
    let match;

    while ((match = typeRegex.exec(content)) !== null) {
      const [, name] = match;
      const kind = match[0].startsWith('interface')
        ? 'interface'
        : match[0].startsWith('type')
          ? 'type'
          : 'enum';
      const properties = this.countProperties(content, name);
      exports.push({ name, kind, properties });
    }

    return exports;
  }

  private analyzeTypeIssues(content: string) {
    const issues = [];

    // Verifica interfaces muito grandes
    const interfaceMatches = content.match(/interface\s+\w+\s*{[^}]+}/g) || [];
    interfaceMatches.forEach((interfaceContent) => {
      const propertyCount = (interfaceContent.match(/\w+\s*:/g) || []).length;
      if (propertyCount > 10) {
        issues.push({
          severity: 'medium',
          message: 'Interface muito grande',
          suggestion: 'Considere dividir em interfaces menores',
        });
      }
    });

    return issues;
  }
}

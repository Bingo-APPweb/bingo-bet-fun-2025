// ... resto do código existente ...

private async calculateCoverage(filePath: string): Promise<number> {
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(
            filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );

        let totalStatements = 0;
        let coveredStatements = 0;

        // Procura por declarações de teste (it, test, describe)
        const visit = (node: ts.Node) => {
            if (ts.isCallExpression(node)) {
                if (ts.isIdentifier(node.expression)) {
                    const functionName = node.expression.text;
                    if (['it', 'test', 'describe'].includes(functionName)) {
                        coveredStatements++;
                    }
                }
            }
            if (ts.isStatement(node)) {
                totalStatements++;
            }
            ts.forEachChild(node, visit);
        };

        visit(sourceFile);
        
        return totalStatements === 0 ? 0 : (coveredStatements / totalStatements) * 100;
    } catch (error) {
        console.error(`Erro ao calcular cobertura para ${filePath}:`, error);
        return 0;
    }
}

private async findDuplications(content: string): Promise<number> {
    // Divide o conteúdo em linhas
    const lines = content.split('\n');
    const duplications = new Map<string, number>();
    let duplicationCount = 0;

    // Analisa blocos de código (usando uma janela deslizante de 6 linhas)
    const BLOCK_SIZE = 6;
    
    for (let i = 0; i <= lines.length - BLOCK_SIZE; i++) {
        const block = lines.slice(i, i + BLOCK_SIZE).join('\n').trim();
        if (block.length > 0) {
            const count = duplications.get(block) || 0;
            if (count === 1) { // Primeira duplicação encontrada
                duplicationCount++;
            }
            duplications.set(block, count + 1);
        }
    }

    return duplicationCount;
}
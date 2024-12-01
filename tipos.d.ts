// tipos.d.ts
declare module 'analyze-project' {
  export class ProjectAnalyzer {
    constructor(projectRoot: string);
    analyzeProject(): Promise<void>;
  }
}

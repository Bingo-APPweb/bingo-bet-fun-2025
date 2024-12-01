// src/core/analyzers/SecurityAnalyzer.ts
import { BaseAnalyzer } from './BaseAnalyzer';
import { SecurityAnalysis, SecurityVulnerability, FirebaseRules } from '../../types/analyzers';
import { parseRules } from '../../utils/firebase-rules-parser';

export class SecurityAnalyzer extends BaseAnalyzer {
  private readonly HIGH_RISK_PATTERNS = [
    /.write:\s*true/,
    /.read:\s*true/,
    /auth\s*==\s*null/,
    /\$uid\s*!==\s*auth\.uid/,
  ];

  private readonly CRITICAL_FUNCTIONS = [
    'updateUserBalance',
    'processGameResults',
    'updateRewards',
    'validateWinner',
  ];

  constructor(config: any) {
    super(config);
  }

  async analyze(
    code: string,
    context: {
      filePath: string;
      fileType: string;
      environment: string;
    }
  ): Promise<SecurityAnalysis> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const timestamps = {
      startTime: Date.now(),
      endTime: 0,
    };

    try {
      switch (context.fileType) {
        case 'firebase-rules':
          vulnerabilities.push(...(await this.analyzeFirebaseRules(code)));
          break;
        case 'typescript':
        case 'javascript':
          vulnerabilities.push(...(await this.analyzeSourceCode(code, context)));
          break;
        case 'config':
          vulnerabilities.push(...(await this.analyzeConfig(code)));
          break;
      }

      timestamps.endTime = Date.now();

      const analysis: SecurityAnalysis = {
        filePath: context.filePath,
        timestamp: timestamps.startTime,
        vulnerabilities,
        metrics: {
          highRiskIssues: vulnerabilities.filter((v) => v.severity === 'high').length,
          mediumRiskIssues: vulnerabilities.filter((v) => v.severity === 'medium').length,
          lowRiskIssues: vulnerabilities.filter((v) => v.severity === 'low').length,
          analysisTime: timestamps.endTime - timestamps.startTime,
        },
        suggestions: this.generateSuggestions(vulnerabilities),
        context: {
          environment: context.environment,
          fileType: context.fileType,
        },
      };

      // Emitir evento para logging e monitoramento
      this.emit('security-analysis-complete', analysis);

      return analysis;
    } catch (error) {
      this.emit('security-analysis-error', { error, context });
      throw error;
    }
  }

  private async analyzeFirebaseRules(rulesContent: string): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const rules = parseRules(rulesContent);

    // Verificar permissões muito abertas
    this.HIGH_RISK_PATTERNS.forEach((pattern) => {
      if (pattern.test(rulesContent)) {
        vulnerabilities.push({
          type: 'firebase-rules',
          severity: 'high',
          message: 'Potentially dangerous security rule detected',
          line: this.findLineNumber(rulesContent, pattern),
          code: pattern.source,
          suggestedFix: 'Implement proper authentication checks',
        });
      }
    });

    // Verificar estrutura das regras
    this.validateRuleStructure(rules, vulnerabilities);

    return vulnerabilities;
  }

  private async analyzeSourceCode(
    code: string,
    context: { filePath: string }
  ): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Verificar funções críticas
    this.CRITICAL_FUNCTIONS.forEach((funcName) => {
      if (code.includes(funcName)) {
        const authCheck = this.checkAuthenticationValidation(code, funcName);
        if (!authCheck.valid) {
          vulnerabilities.push({
            type: 'authentication',
            severity: 'high',
            message: `Critical function "${funcName}" may lack proper authentication`,
            line: authCheck.line,
            code: funcName,
            suggestedFix: 'Add authentication validation before executing critical operations',
          });
        }
      }
    });

    // Verificar manipulação segura de dados
    const dataValidation = this.checkDataValidation(code);
    if (!dataValidation.valid) {
      vulnerabilities.push({
        type: 'data-validation',
        severity: 'medium',
        message: 'Potential data validation issues detected',
        line: dataValidation.line,
        code: dataValidation.code,
        suggestedFix: 'Implement proper data validation and sanitization',
      });
    }

    // Verificar exposição de informações sensíveis
    const sensitiveData = this.checkSensitiveDataExposure(code);
    if (sensitiveData.length > 0) {
      vulnerabilities.push(
        ...sensitiveData.map((data) => ({
          type: 'sensitive-data',
          severity: 'high',
          message: 'Possible exposure of sensitive data',
          line: data.line,
          code: data.code,
          suggestedFix: 'Remove or encrypt sensitive information',
        }))
      );
    }

    return vulnerabilities;
  }

  private async analyzeConfig(configContent: string): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const config = JSON.parse(configContent);

    // Verificar exposição de credenciais
    if (this.hasExposedCredentials(config)) {
      vulnerabilities.push({
        type: 'credentials',
        severity: 'critical',
        message: 'Exposed credentials in configuration',
        line: 0,
        code: 'config',
        suggestedFix: 'Move sensitive data to environment variables',
      });
    }

    // Verificar configurações de segurança
    const securitySettings = this.validateSecuritySettings(config);
    vulnerabilities.push(...securitySettings);

    return vulnerabilities;
  }

  private validateRuleStructure(
    rules: FirebaseRules,
    vulnerabilities: SecurityVulnerability[]
  ): void {
    // Validação da estrutura de regras do Firebase
    const criticalPaths = ['games', 'users', 'transactions'];

    criticalPaths.forEach((path) => {
      if (!rules[path] || !rules[path].read || !rules[path].write) {
        vulnerabilities.push({
          type: 'firebase-rules',
          severity: 'high',
          message: `Missing security rules for critical path: ${path}`,
          line: 0,
          code: path,
          suggestedFix: `Add explicit read/write rules for ${path}`,
        });
      }
    });
  }

  private checkAuthenticationValidation(
    code: string,
    funcName: string
  ): {
    valid: boolean;
    line: number;
  } {
    // Implementar verificação de validação de autenticação
    const functionBody = this.extractFunctionBody(code, funcName);
    const hasAuthCheck = /auth\.currentUser|isAuthenticated|requireAuth/.test(functionBody);

    return {
      valid: hasAuthCheck,
      line: this.findLineNumber(code, new RegExp(funcName)),
    };
  }

  private checkDataValidation(code: string): {
    valid: boolean;
    line: number;
    code: string;
  } {
    // Implementar verificação de validação de dados
    return {
      valid: true,
      line: 0,
      code: '',
    };
  }

  private checkSensitiveDataExposure(code: string): Array<{
    line: number;
    code: string;
  }> {
    // Implementar verificação de exposição de dados sensíveis
    return [];
  }

  private hasExposedCredentials(config: any): boolean {
    // Implementar verificação de credenciais expostas
    return false;
  }

  private validateSecuritySettings(config: any): SecurityVulnerability[] {
    // Implementar validação de configurações de segurança
    return [];
  }

  private generateSuggestions(vulnerabilities: SecurityVulnerability[]): string[] {
    // Gerar sugestões baseadas nas vulnerabilidades encontradas
    const suggestions = new Set<string>();

    vulnerabilities.forEach((vulnerability) => {
      switch (vulnerability.type) {
        case 'firebase-rules':
          suggestions.add('Review and strengthen Firebase security rules');
          break;
        case 'authentication':
          suggestions.add('Implement comprehensive authentication checks');
          break;
        case 'data-validation':
          suggestions.add('Add thorough data validation and sanitization');
          break;
        // Adicionar mais casos conforme necessário
      }
    });

    return Array.from(suggestions);
  }

  private findLineNumber(content: string, pattern: RegExp): number {
    const lines = content.split('\n');
    return lines.findIndex((line) => pattern.test(line)) + 1;
  }

  private extractFunctionBody(code: string, funcName: string): string {
    // Implementar extração do corpo da função
    return '';
  }
}

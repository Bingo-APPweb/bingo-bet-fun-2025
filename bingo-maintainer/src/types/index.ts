// bingo-maintainer/src/types/index.ts
export interface AnalyzerResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

export interface SecurityConfig {
  scanInterval: string;
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuthConfig {
  jwtSecret: string;
  tokenExpiration: string;
}

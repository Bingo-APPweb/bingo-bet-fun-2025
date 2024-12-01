// src/types/security/index.ts

// Tipos base de segurança
export enum SecuritySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum SecurityCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_VALIDATION = 'data-validation',
  FIREBASE_RULES = 'firebase-rules',
  INPUT_VALIDATION = 'input-validation',
  SENSITIVE_DATA = 'sensitive-data',
  CONFIGURATION = 'configuration',
  API_SECURITY = 'api-security',
  REALTIME_PROTECTION = 'realtime-protection',
  GAME_INTEGRITY = 'game-integrity',
}

// Interface principal de vulnerabilidade
export interface SecurityVulnerability {
  id: string;
  category: SecurityCategory;
  severity: SecuritySeverity;
  title: string;
  description: string;
  location: {
    file: string;
    line?: number;
    column?: number;
    code?: string;
  };
  detectedAt: number;
  status: 'open' | 'investigating' | 'fixing' | 'resolved' | 'false-positive';
  impact: {
    technical: string;
    business: string;
    users: string;
  };
  remediation: {
    suggestion: string;
    autoFixable: boolean;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    effort: 'minimal' | 'moderate' | 'significant';
  };
  metadata?: Record<string, any>;
}

// Interface para regras do Firebase
export interface FirebaseSecurityRule {
  path: string;
  type: 'read' | 'write' | 'validate';
  condition: string;
  level: SecuritySeverity;
  dependencies?: string[];
  requiredAuth: boolean;
  customValidations?: string[];
}

// Interface para análise de segurança
export interface SecurityAnalysis {
  timestamp: number;
  duration: number;
  target: {
    type: 'file' | 'directory' | 'project';
    path: string;
  };
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    autoFixableCount: number;
  };
  vulnerabilities: SecurityVulnerability[];
  metrics: SecurityMetrics;
  recommendations: SecurityRecommendation[];
  context: SecurityContext;
}

// Métricas de segurança
export interface SecurityMetrics {
  overallScore: number; // 0-100
  categoryScores: Record<SecurityCategory, number>;
  trends: {
    daily: SecurityTrend;
    weekly: SecurityTrend;
    monthly: SecurityTrend;
  };
  performance: {
    responseTime: number;
    resourceUsage: number;
    errorRate: number;
  };
}

// Tendências de segurança
export interface SecurityTrend {
  period: {
    start: number;
    end: number;
  };
  metrics: {
    newIssues: number;
    resolvedIssues: number;
    reopenedIssues: number;
    meanTimeToResolve: number;
  };
  comparisonWithPrevious: {
    improvement: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
}

// Recomendações de segurança
export interface SecurityRecommendation {
  id: string;
  type: 'immediate' | 'short-term' | 'long-term';
  title: string;
  description: string;
  impact: SecuritySeverity;
  implementation: {
    steps: string[];
    estimatedEffort: string;
    dependencies: string[];
    potentialRisks: string[];
  };
  benefits: {
    security: string[];
    performance: string[];
    maintenance: string[];
  };
}

// Contexto de segurança
export interface SecurityContext {
  environment: 'development' | 'staging' | 'production';
  gameState: {
    activeGames: number;
    connectedPlayers: number;
    transactionsPerMinute: number;
  };
  systemLoad: {
    cpu: number;
    memory: number;
    network: number;
  };
  recentIncidents?: SecurityIncident[];
}

// Incidentes de segurança
export interface SecurityIncident {
  id: string;
  timestamp: number;
  type: SecurityCategory;
  severity: SecuritySeverity;
  description: string;
  impact: {
    usersAffected: number;
    gamesAffected: number;
    financialImpact?: number;
  };
  resolution?: {
    status: 'ongoing' | 'resolved';
    timeToResolve?: number;
    actionsTaken: string[];
    preventiveMeasures: string[];
  };
}

// Configurações de proteção em tempo real
export interface RealtimeProtection {
  rules: {
    rateLimit: {
      requests: number;
      timeWindow: number;
      action: 'warn' | 'block' | 'challenge';
    };
    patterns: {
      suspicious: RegExp[];
      blocked: RegExp[];
      whitelist: RegExp[];
    };
    thresholds: {
      concurrent: number;
      sequential: number;
      timeBasedPatterns: number;
    };
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    metrics: string[];
    alerts: {
      channels: string[];
      thresholds: Record<SecuritySeverity, number>;
    };
  };
}

// Validações de jogo
export interface GameSecurityValidations {
  input: {
    patterns: RegExp[];
    sanitizers: ((input: any) => any)[];
    validators: ((input: any) => boolean)[];
  };
  state: {
    invariants: ((state: any) => boolean)[];
    transitions: ((from: any, to: any) => boolean)[];
  };
  transactions: {
    validators: ((tx: any) => boolean)[];
    limits: {
      amount: number;
      frequency: number;
      total: number;
    };
  };
}

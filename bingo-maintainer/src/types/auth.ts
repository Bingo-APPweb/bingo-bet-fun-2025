// packages/maintainer/src/types/auth.ts

/**
 * Enumeração dos níveis de severidade para eventos de segurança
 */
export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Enumeração dos tipos de eventos de segurança
 */
export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
}

/**
 * Interface base para eventos de segurança
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: Date;
  source: string;
  details: string;
  metadata?: Record<string, unknown>;
}

/**
 * Interface para configurações de rate limiting
 */
export interface RateLimitConfig {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Número máximo de requisições na janela
  blockDuration: number; // Duração do bloqueio em milissegundos
}

/**
 * Interface para regras de validação de segurança
 */
export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: SecuritySeverity;
  action: SecurityAction;
  conditions: SecurityCondition[];
}

/**
 * Interface para condições de segurança
 */
export interface SecurityCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'regex';
  value: unknown;
}

/**
 * Interface para ações de segurança
 */
export interface SecurityAction {
  type: 'BLOCK' | 'ALERT' | 'LOG' | 'REQUIRE_2FA';
  params?: Record<string, unknown>;
}

/**
 * Interface para contexto de segurança
 */
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  resource: string;
  action: string;
}

/**
 * Interface para relatório de segurança
 */
export interface SecurityReport {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  events: SecurityEvent[];
  summary: {
    totalEvents: number;
    bySeverity: Record<SecuritySeverity, number>;
    byType: Record<SecurityEventType, number>;
  };
  recommendations: string[];
}

// packages/maintainer/src/types/auth.ts
export enum PermissionLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
}

export interface AuthenticationRequest {
  username: string;
  password: string;
  metadata?: Record<string, unknown>;
}

export interface AuthenticationResponse {
  success: boolean;
  token?: string;
  expiresAt?: Date;
  permissions?: PermissionLevel;
  error?: string;
}

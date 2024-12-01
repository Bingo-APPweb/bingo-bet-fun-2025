// src/types/analysis.ts

// Constants
export const ANALYSIS_CONSTANTS = {
  SEVERITY_LEVELS: ['critical', 'high', 'medium', 'low', 'info'] as const,
  COMPLEXITY_THRESHOLDS: {
    LOW: 5,
    MEDIUM: 10,
    HIGH: 15,
    CRITICAL: 20,
  },
  MAX_METHOD_LENGTH: 50,
  MAX_FILE_SIZE: 1000, // lines
} as const;

// Base Types
export interface AnalysisEntity {
  id: string;
  timestamp: Date;
  version: string;
}

// Issue Tracking
export interface Issue extends AnalysisEntity {
  severity: SeverityLevel;
  type: IssueType;
  message: string;
  suggestion: string;
  location: CodeLocation;
  impact: IssueImpact;
  metadata?: Record<string, unknown>;
}

export type SeverityLevel = (typeof ANALYSIS_CONSTANTS.SEVERITY_LEVELS)[number];

export type IssueType =
  | 'security'
  | 'performance'
  | 'maintainability'
  | 'accessibility'
  | 'bestPractice'
  | 'complexity'
  | 'duplicate'
  | 'deprecated';

export interface CodeLocation {
  file: string;
  line: number;
  column: number;
  context?: string;
}

export interface IssueImpact {
  description: string;
  scope: 'local' | 'module' | 'application';
  affectedComponents: string[];
  risk: 'low' | 'medium' | 'high';
}

// Code Analysis
export interface Method extends AnalysisEntity {
  name: string;
  complexity: number;
  parameters: ParameterInfo[];
  returnType: string;
  metrics: MethodMetrics;
  issues: Issue[];
}

export interface ParameterInfo {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
}

export interface MethodMetrics {
  lineCount: number;
  cyclomaticComplexity: number;
  parameterCount: number;
  returnCount: number;
  dependencies: string[];
  coverage: number;
  readonly complexityScore: number;
}

// File Analysis
export interface FileAnalysis extends AnalysisEntity {
  name: string;
  path: string;
  size: number;
  type: FileType;
  dependencies: DependencyInfo[];
  issues: Issue[];
  metrics: FileMetrics;
  coverage: CodeCoverage;
}

export type FileType = 'component' | 'service' | 'hook' | 'util' | 'type' | 'test' | 'style';

export interface DependencyInfo {
  name: string;
  type: 'internal' | 'external' | 'devDependency';
  version?: string;
  usageCount: number;
  isOptional: boolean;
}

export interface FileMetrics {
  lineCount: {
    total: number;
    code: number;
    comments: number;
    blank: number;
  };
  complexity: {
    cyclomatic: number;
    cognitive: number;
    halstead: HalsteadMetrics;
  };
  maintainability: number;
  duplications: number;
}

export interface HalsteadMetrics {
  uniqueOperators: number;
  uniqueOperands: number;
  totalOperators: number;
  totalOperands: number;
  vocabulary: number;
  difficulty: number;
  volume: number;
  effort: number;
}

// Component Analysis
export interface ServiceAnalysis extends FileAnalysis {
  methods: Method[];
  apiEndpoints: ApiEndpoint[];
  performance: ServicePerformance;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters: ParameterInfo[];
  responseType: string;
  authentication: boolean;
  rateLimit?: number;
}

export interface ServicePerformance {
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  concurrentRequests: number;
}

// Hook Analysis
export interface HookAnalysis extends FileAnalysis {
  params: ParameterInfo[];
  returnType: string;
  effects: EffectInfo[];
  states: StateInfo[];
  customHooks: string[];
  performance: HookPerformance;
}

export interface EffectInfo {
  dependencies: string[];
  cleanup: boolean;
  frequency: 'mount' | 'update' | 'unmount';
}

export interface StateInfo {
  name: string;
  type: string;
  initialValue: string;
  updates: number;
}

export interface HookPerformance {
  rerendersCount: number;
  effectTriggers: number;
  memoryUsage: number;
}

// Type Analysis
export interface TypeAnalysis extends FileAnalysis {
  exports: TypeExport[];
  imports: TypeImport[];
  complexity: TypeComplexity;
}

export interface TypeExport {
  name: string;
  type: 'interface' | 'type' | 'enum' | 'class';
  properties: number;
  references: number;
}

export interface TypeImport {
  name: string;
  source: string;
  usageCount: number;
}

export interface TypeComplexity {
  depth: number;
  breadth: number;
  unions: number;
  intersections: number;
  generics: number;
}

// Coverage
export interface CodeCoverage {
  statements: CoverageMetric;
  branches: CoverageMetric;
  functions: CoverageMetric;
  lines: CoverageMetric;
}

export interface CoverageMetric {
  total: number;
  covered: number;
  skipped: number;
  percentage: number;
}

// Project Analysis
export interface ProjectAnalysis extends AnalysisEntity {
  overview: ProjectOverview;
  components: FileAnalysis[];
  services: ServiceAnalysis[];
  hooks: HookAnalysis[];
  types: TypeAnalysis[];
  issues: Issue[];
  metrics: ProjectMetrics;
  suggestions: Suggestion[];
}

export interface ProjectOverview {
  fileCount: number;
  totalSize: number;
  dependencies: DependencyInfo[];
  coverage: CodeCoverage;
}

export interface ProjectMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  duplications: number;
  dependencies: number;
  issues: Record<SeverityLevel, number>;
}

export interface Suggestion {
  type: 'refactor' | 'optimize' | 'security' | 'test';
  description: string;
  impact: string;
  effort: string;
  priority: number;
}

// Analysis Utilities
export interface AnalysisConfig {
  thresholds: Record<string, number>;
  rules: AnalysisRule[];
  ignore: string[];
  customMetrics?: Record<string, MetricDefinition>;
}

export interface AnalysisRule {
  id: string;
  severity: SeverityLevel;
  condition: string;
  message: string;
}

export interface MetricDefinition {
  name: string;
  calculate: (data: any) => number;
  thresholds: {
    warning: number;
    error: number;
  };
}

// Type Guards
export const isFileAnalysis = (analysis: unknown): analysis is FileAnalysis => {
  // Implementação da validação
  return true;
};

export const isValidIssue = (issue: unknown): issue is Issue => {
  // Implementação da validação
  return true;
};

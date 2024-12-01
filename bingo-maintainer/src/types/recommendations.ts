// packages/maintainer/src/types/recommendations.ts
export enum RecommendationType {
  PERFORMANCE_OPTIMIZATION = 'performance_optimization',
  SECURITY_ENHANCEMENT = 'security_enhancement',
  RESOURCE_SCALING = 'resource_scaling',
  INTEGRITY_CHECK = 'integrity_check',
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: number;
  title: string;
  description: string;
  impact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  metrics: {
    name: string;
    current: number;
    target: number;
  }[];
  implementation: string[];
}

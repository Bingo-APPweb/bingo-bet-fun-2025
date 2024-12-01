// packages/maintainer/src/types/monitoring.ts
export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  labels: Record<string, string>;
}

export interface Alert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metric: string;
  threshold: number;
  currentValue: number;
  message: string;
  timestamp: Date;
}

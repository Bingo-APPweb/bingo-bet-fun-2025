// src/services/integration/types.ts
export interface IntegrationConfig {
  apiKey: string;
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface StreamData {
  id: string;
  platform: 'youtube' | 'twitch' | 'facebook';
  title: string;
  viewerCount: number;
  startTime: Date;
  status: 'live' | 'ended' | 'scheduled';
}

export interface StreamError extends Error {
  code: string;
  platform: string;
  timestamp: Date;
}

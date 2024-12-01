// src/types/stream.ts

// Constants
export const STREAM_CONSTANTS = {
  PLATFORMS: ['youtube', 'twitch', 'facebook'] as const,
  MAX_RETRY_ATTEMPTS: 3,
  RECONNECT_INTERVAL: 5000,
  METRICS_UPDATE_INTERVAL: 10000,
  MAX_QUALITY_OPTIONS: 5,
} as const;

// Platform Types
export type StreamPlatform = (typeof STREAM_CONSTANTS.PLATFORMS)[number];

// Base Configuration
export interface StreamConfig {
  platform: StreamPlatform;
  channelId: string;
  streamKey?: string;
  settings: StreamSettings;
  quality: StreamQualityConfig;
  chat: StreamChatConfig;
  backup?: StreamBackupConfig;
}

export interface StreamSettings {
  title: string;
  description?: string;
  isPrivate: boolean;
  startTime?: Date;
  scheduledTime?: Date;
  tags: string[];
  category?: string;
  language: string;
  ageRestriction?: boolean;
  monetization: MonetizationSettings;
}

export interface StreamQualityConfig {
  resolution: StreamResolution;
  fps: number;
  bitrate: number;
  codec: 'h264' | 'h265' | 'vp9';
  audioQuality: AudioQuality;
  dynamicBitrate: boolean;
  qualityPresets: QualityPreset[];
}

export interface StreamChatConfig {
  enabled: boolean;
  moderation: boolean;
  delay: number;
  subscriberOnly: boolean;
  emoteOnly: boolean;
  language?: string;
  blockedWords: Set<string>;
}

export interface StreamBackupConfig {
  enabled: boolean;
  recordLocally: boolean;
  backupPlatform?: StreamPlatform;
  backupStreamKey?: string;
}

// Quality Settings
export interface StreamResolution {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface AudioQuality {
  bitrate: number;
  channels: 'mono' | 'stereo';
  sampleRate: 44100 | 48000;
}

export interface QualityPreset {
  name: string;
  resolution: StreamResolution;
  bitrate: number;
  fps: number;
}

// Monetization
export interface MonetizationSettings {
  enabled: boolean;
  features: MonetizationFeature[];
  subscriptions: boolean;
  donations: boolean;
  ads: AdSettings;
}

export type MonetizationFeature = 'superChat' | 'channelPoints' | 'bits' | 'sponsorships';

export interface AdSettings {
  enabled: boolean;
  preroll: boolean;
  midroll: boolean;
  frequency: number; // minutes
  minimumInterval: number;
}

// Metrics & Analytics
export interface StreamMetrics {
  viewers: {
    current: number;
    peak: number;
    average: number;
    total: number;
  };
  engagement: {
    likes: number;
    shares: number;
    chatMessages: number;
    chatUsers: Set<string>;
  };
  performance: {
    fps: number;
    bitrate: number;
    droppedFrames: number;
    health: StreamHealth;
  };
  monetization: {
    donations: number;
    subscriptions: number;
    bits: number;
    superChats: number;
  };
  readonly retentionRate: number;
  startTime: Date;
  duration: number;
}

export type StreamHealth = 'excellent' | 'good' | 'fair' | 'poor';

// Events
export interface StreamEvent {
  type: StreamEventType;
  timestamp: Date;
  data?: any;
  metadata?: StreamEventMetadata;
}

export type StreamEventType =
  | 'start'
  | 'end'
  | 'pause'
  | 'resume'
  | 'quality_changed'
  | 'error'
  | 'viewer_join'
  | 'viewer_leave'
  | 'chat_enabled'
  | 'chat_disabled'
  | 'monetization_event';

export interface StreamEventMetadata {
  platform: StreamPlatform;
  channelId: string;
  viewerCount: number;
  quality: StreamQualityConfig;
  error?: StreamError;
}

// Status & Error Handling
export type StreamStatus = 'idle' | 'connecting' | 'live' | 'reconnecting' | 'error' | 'ended';

export class StreamError extends Error {
  constructor(
    message: string,
    public code: StreamErrorCode,
    public retryable: boolean = false,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'StreamError';
  }
}

export type StreamErrorCode =
  | 'connection_failed'
  | 'invalid_stream_key'
  | 'insufficient_bandwidth'
  | 'encoder_error'
  | 'platform_error';

// Utility Types & Validators
export interface StreamValidator {
  validateConfig(config: StreamConfig): boolean;
  validateQuality(quality: StreamQualityConfig): boolean;
  validateMetrics(metrics: StreamMetrics): boolean;
}

export interface StreamAdapter {
  platform: StreamPlatform;
  connect(config: StreamConfig): Promise<void>;
  disconnect(): Promise<void>;
  updateMetrics(): Promise<StreamMetrics>;
  handleError(error: StreamError): Promise<void>;
}

// Type Guards
export const isStreamConfig = (config: unknown): config is StreamConfig => {
  // Implementação da validação
  return true;
};

export const isValidStreamEvent = (event: unknown): event is StreamEvent => {
  // Implementação da validação
  return true;
};

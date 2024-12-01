// src/types/firebase.d.ts

import { Timestamp, FieldValue, DocumentReference, CollectionReference } from 'firebase/firestore';

// Utility Types
export type FirebaseDate = Timestamp | Date;
export type FirebaseId = string;
export type FirebaseRef<T> = DocumentReference<T>;

// Base Types
export interface FirebaseEntity {
  id: FirebaseId;
  createdAt: FirebaseDate;
  updatedAt: FirebaseDate;
  deletedAt?: FirebaseDate;
}

// User Related
export interface UserProfile extends FirebaseEntity {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerId: string;
  lastLogin: FirebaseDate;
  settings: UserSettings;
  metadata: UserMetadata;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  preferences: UserPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  gameInvites: boolean;
  chatMessages: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  onlineStatus: boolean;
  showActivity: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface UserMetadata {
  creationTime: FirebaseDate;
  lastSignInTime: FirebaseDate;
  lastActivityTime: FirebaseDate;
}

// Session Related
export interface GameSession extends FirebaseEntity {
  gameId: string;
  hostId: string;
  status: GameSessionStatus;
  players: Record<string, PlayerSession>;
  settings: GameSessionSettings;
  metrics: GameSessionMetrics;
  timestamps: SessionTimestamps;
}

export interface PlayerSession extends FirebaseEntity {
  userId: string;
  gameSessionId: string;
  joinedAt: FirebaseDate;
  leftAt?: FirebaseDate;
  status: PlayerSessionStatus;
  deviceInfo: DeviceInfo;
  connectionHistory: ConnectionEvent[];
}

export type GameSessionStatus =
  | 'created'
  | 'lobby'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type PlayerSessionStatus = 'connected' | 'disconnected' | 'idle' | 'spectating';

export interface GameSessionSettings {
  maxPlayers: number;
  isPrivate: boolean;
  allowSpectators: boolean;
  gameRules: Record<string, any>;
}

export interface GameSessionMetrics {
  playerCount: number;
  spectatorCount: number;
  startTime?: FirebaseDate;
  endTime?: FirebaseDate;
  duration?: number;
}

export interface SessionTimestamps {
  created: FirebaseDate;
  started?: FirebaseDate;
  paused?: FirebaseDate[];
  resumed?: FirebaseDate[];
  ended?: FirebaseDate;
}

export interface DeviceInfo {
  platform: string;
  browser: string;
  version: string;
  ip?: string;
  userAgent: string;
}

export interface ConnectionEvent {
  type: 'connected' | 'disconnected';
  timestamp: FirebaseDate;
  reason?: string;
}

// Storage Related
export interface StorageMetadata {
  bucket: string;
  path: string;
  name: string;
  contentType: string;
  size: number;
  createdAt: FirebaseDate;
  updatedAt: FirebaseDate;
  downloadURL?: string;
}

// Firestore Helpers
export interface QueryOptions {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  startAfter?: any;
  where?: WhereClause[];
}

export interface WhereClause {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}

// Error Handling
export class FirebaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'FirebaseError';
  }
}

// Type Guards
export const isFirebaseDate = (value: any): value is FirebaseDate => {
  return value instanceof Date || value instanceof Timestamp;
};

export const isFirebaseRef = <T>(value: any): value is FirebaseRef<T> => {
  return value?.type === 'document' && typeof value.id === 'string';
};

// Collection Types
export interface Collections {
  users: CollectionReference<UserProfile>;
  gameSessions: CollectionReference<GameSession>;
  playerSessions: CollectionReference<PlayerSession>;
}

// Converters
export const timestampConverter = {
  toFirestore: (date: Date) => Timestamp.fromDate(date),
  fromFirestore: (timestamp: Timestamp) => timestamp.toDate(),
};

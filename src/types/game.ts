// src/types/game.ts

// Constants
export const GAME_CONSTANTS = {
  MAX_PLAYERS: 100,
  MIN_PLAYERS: 2,
  CARD_SIZE: 5,
  MAX_NUMBERS: 75,
  DEFAULT_NUMBER_PICK_INTERVAL: 3000,
} as const;

// Validation Types
export type CardValidationType = 'full' | 'horizontal' | 'vertical' | 'diagonal';

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Player Related Types
export interface Player extends BaseEntity {
  username: string;
  avatar?: string;
  currentCard: BingoCard;
  stats: PlayerStats;
  status: PlayerStatus;
  lastActivity: Date;
}

export interface BingoCard extends BaseEntity {
  numbers: number[][];
  markedNumbers: Set<number>;
  pattern: BingoPattern;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalPrizesClaimed: number;
  winningPatterns: BingoPattern[];
  averageGameDuration: number;
  readonly winRate: number; // Computed property
}

export type PlayerStatus = {
  type: 'online' | 'playing' | 'spectating' | 'away' | 'offline';
  lastStatusChange: Date;
};

// Game Related Types
export interface BingoPattern extends BaseEntity {
  name: string;
  description: string;
  requiredPositions: number[];
  prizeMultiplier: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Game extends BaseEntity {
  status: GameStatus;
  players: Map<string, Player>;
  currentNumbers: number[];
  winningPatterns: BingoPattern[];
  streamMetrics: StreamMetrics;
  settings: GameSettings;
  timestamps: GameTimestamps;
  
  // Métodos de validação
  readonly isActive: boolean;
  readonly canStart: boolean;
  readonly playerCount: number;
}

export type GameStatus = {
  state: 'waiting' | 'starting' | 'inProgress' | 'paused' | 'finished';
  lastStateChange: Date;
  message?: string;
};

// Settings & Configuration
export interface GameSettings {
  maxPlayers: number;
  numbersPerCard: number;
  winningPatternsRequired: number;
  autoPickNumbers: boolean;
  numberPickInterval: number;
  prizePool: PrizePool;
  readonly totalPrize: number; // Computed property
}

export interface PrizePool {
  totalAmount: number;
  currency: string;
  distribution: PrizeDistribution[];
  readonly minimumPrize: number; // Computed property
}

export interface PrizeDistribution {
  position: number;
  percentage: number;
  minimumAmount: number;
}

export interface GameTimestamps {
  created: Date;
  started?: Date;
  paused?: Date[];
  resumed?: Date[];
  finished?: Date;
  readonly duration?: number; // Computed property
}

// Event System
export type GameEventType =
  | 'numberCalled'
  | 'numberMarked'
  | 'patternCompleted'
  | 'bingoCall'
  | 'playerJoined'
  | 'playerLeft'
  | 'gameStateChanged'
  | 'prizeAwarded'
  | 'streamMetricsUpdated';

export interface GameEvent<T = unknown> {
  type: GameEventType;
  gameId: string;
  playerId?: string;
  data: T;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Action System with Type Safety
export type GameAction =
  | StartGameAction
  | PauseGameAction
  | ResumeGameAction
  | CallNumberAction
  | MarkNumberAction
  | CallBingoAction
  | JoinGameAction
  | LeaveGameAction;

interface BaseGameAction {
  type: string;
  gameId: string;
  timestamp: Date;
}

interface StartGameAction extends BaseGameAction {
  type: 'START_GAME';
}

interface PauseGameAction extends BaseGameAction {
  type: 'PAUSE_GAME';
  reason?: string;
}

interface ResumeGameAction extends BaseGameAction {
  type: 'RESUME_GAME';
}

interface CallNumberAction extends BaseGameAction {
  type: 'CALL_NUMBER';
  number: number;
}

interface MarkNumberAction extends BaseGameAction {
  type: 'MARK_NUMBER';
  playerId: string;
  number: number;
}

interface CallBingoAction extends BaseGameAction {
  type: 'CALL_BINGO';
  playerId: string;
  pattern: BingoPattern;
}

interface JoinGameAction extends BaseGameAction {
  type: 'JOIN_GAME';
  player: Player;
}

interface LeaveGameAction extends BaseGameAction {
  type: 'LEAVE_GAME';
  playerId: string;
  reason?: string;
}

// Type Guards
export const isValidGameAction = (action: unknown): action is GameAction => {
  // Implementação da validação
  return true;
};
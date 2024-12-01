// packages/maintainer/src/types/alerts.ts
export enum BingoAlertType {
  HIGH_LATENCY = 'high_latency',
  LOW_ENTROPY = 'low_entropy',
  PATTERN_VALIDATION_DELAY = 'pattern_validation_delay',
  PLAYER_SURGE = 'player_surge',
  SUSPICIOUS_WIN_RATE = 'suspicious_win_rate',
  TRANSACTION_DELAY = 'transaction_delay',
  SYSTEM_OVERLOAD = 'system_overload',
}

export interface BingoAlert extends Alert {
  type: BingoAlertType;
  gameId?: string;
  roomId?: string;
  impactedPlayers?: number;
  recommendedAction?: string;
}

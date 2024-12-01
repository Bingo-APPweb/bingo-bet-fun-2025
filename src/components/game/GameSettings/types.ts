// GameSettings/types.ts
export interface GameSettingsProps {
  maxPlayers: number;
  timeLimit: number;
  prizePool: number;
  onSettingsChange: (settings: GameSettings) => void;
}

export interface GameSettings {
  maxPlayers: number;
  timeLimit: number;
  prizePool: number;
}

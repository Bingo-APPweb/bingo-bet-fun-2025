// src/features/ai/types/claude.types.ts
export interface GameState {
  status: 'idle' | 'active' | 'paused' | 'completed';
  currentNumbers: number[];
  players: Player[];
  pattern: string;
}

export interface Player {
  id: string;
  name: string;
  card: number[][];
  markedNumbers: number[];
}

export interface ClaudeResponse {
  type: 'tip' | 'pattern' | 'help';
  content: string;
  action?: {
    type: 'suggest_number' | 'validate_pattern' | 'explain_rule';
    data: any;
  };
}

// Update existing ClaudeResponse type
export interface ClaudeResponse {
  type: 'tip' | 'pattern' | 'help' | 'analytics' | 'tutorial';
  content: string;
  action?: {
    type: 'suggest_number' | 'validate_pattern' | 'explain_rule' | 'engagement_suggestion';
    data: any;
  };
  config?: ClaudeFeatureConfig;
}

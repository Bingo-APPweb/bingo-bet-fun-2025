// 📝 Type Definitions
// src/types/game.d.ts
export interface GameSession {
    id: string;
    hostId: string;
    players: Player[];
    aiResponses: AIResponse[];
    metrics: GameMetrics;
  }
  
  // 🔒 Firebase Security Rules
  {
    "rules": {
      "games": {
        "$gameId": {
          ".read": "auth != null",
          ".write": "auth != null && (data.child('hostId').val() === auth.uid || !data.exists())",
          "aiResponses": {
            ".write": "auth != null"
          }
        }
      }
    }
  }
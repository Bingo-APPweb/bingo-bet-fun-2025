// src/lib/firebase/services/game.service.ts
import { Timestamp } from 'firebase/firestore';
export class BingoGameService {
  private claudeService: ClaudeGameService;

  constructor(claudeApiKey: string) {
    this.claudeService = new ClaudeGameService(claudeApiKey);
    this.metricsService = new MetricsService();
  }

  async initializeGame(hostId: string): Promise<string> {
    const gameRef = doc(collection(db, 'games'));

    await setDoc(gameRef, {
      hostId,
      status: 'waiting',
      created: new Date(),
      players: [],
      currentNumbers: [],
      aiResponses: [],
    });

    return gameRef.id;
  }
}

// Firebase Schema
interface FirebaseSchema {
  games: {
    [gameId: string]: {
      hostId: string;
      status: GameStatus;
      created: Date;
      players: PlayerData[];
      currentNumbers: number[];
      aiResponses: AIResponse[];
      lastUpdate: Date;
    };
    players: {
      [playerId: string]: {
        profile: {
          interactionCount: number;
          favoriteNumbers: number[];
          playStyle: string;
          lastInteraction: Date;
        };
        gameStats: {
          gamesPlayed: number;
          wins: number;
        };
      };
    };
    metrics: {
      [gameId: string]: {
        viewerCount: number;
        engagement: number;
        aiResponseRate: number;
      };
    };
  };
}

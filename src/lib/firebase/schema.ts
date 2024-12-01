// 3. Estrutura Inicial do Banco
// src/lib/firebase/schema.ts
import { Timestamp } from 'firebase/firestore';
interface DatabaseSchema {
  games: {
    [gameId: string]: {
      status: 'waiting' | 'active' | 'completed';
      hostId: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
      settings: {
        centerFree: boolean;
        autoMarkNumbers: boolean;
        winPatterns: string[];
      };
      players: {
        [playerId: string]: {
          name: string;
          card: number[][];
          marks: boolean[][];
          joinedAt: Timestamp;
        };
      };
      currentNumber: number | null;
      drawnNumbers: number[];
    };
  };

  users: {
    [userId: string]: {
      name: string;
      email: string;
      createdAt: Timestamp;
      lastLogin: Timestamp;
      stats: {
        gamesPlayed: number;
        gamesWon: number;
        totalScore: number;
      };
    };
  };
}

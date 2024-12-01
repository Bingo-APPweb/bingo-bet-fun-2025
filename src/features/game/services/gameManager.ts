import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { WinningPattern } from '@/types/enums/game.enum';

interface GameSettings {
  maxPlayers: number;
  winningPatterns: WinningPattern[];
  streamId: string;
}

interface GameState {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  currentNumbers: number[];
  players: Record<
    string,
    {
      id: string;
      card: number[][];
      markedNumbers: number[];
    }
  >;
  winners: Array<{
    playerId: string;
    pattern: WinningPattern;
    timestamp: number;
  }>;
  startTime: number;
  endTime?: number;
}

class GameManager {
  private db = getDatabase();

  async createGame(hostId: string, settings: GameSettings): Promise<string> {
    const gameRef = push(ref(this.db, 'games'));
    const gameId = gameRef.key!;

    const initialState: GameState = {
      id: gameId,
      status: 'waiting',
      currentNumbers: [],
      players: {},
      winners: [],
      startTime: Date.now(),
      settings,
    };

    await set(gameRef, initialState);
    return gameId;
  }

  subscribeToGame(gameId: string, callback: (state: GameState) => void) {
    const gameRef = ref(this.db, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      callback(snapshot.val() as GameState);
    });
  }

  async joinGame(gameId: string, playerId: string, card: number[][]) {
    const playerRef = ref(this.db, `games/${gameId}/players/${playerId}`);
    await set(playerRef, {
      id: playerId,
      card,
      markedNumbers: [],
    });
  }

  async markNumber(gameId: string, playerId: string, number: number) {
    const playerRef = ref(this.db, `games/${gameId}/players/${playerId}`);
    const playerSnapshot = await get(playerRef);
    const playerData = playerSnapshot.val();

    if (playerData) {
      const markedNumbers = [...playerData.markedNumbers, number];
      await set(playerRef, {
        ...playerData,
        markedNumbers,
      });
    }
  }

  async claimWin(gameId: string, playerId: string, pattern: WinningPattern) {
    const gameRef = ref(this.db, `games/${gameId}`);
    const gameSnapshot = await get(gameRef);
    const gameData = gameSnapshot.val() as GameState;

    if (this.verifyWin(gameData, playerId, pattern)) {
      const winnerRef = ref(this.db, `games/${gameId}/winners`);
      await push(winnerRef, {
        playerId,
        pattern,
        timestamp: Date.now(),
      });

      await set(ref(this.db, `games/${gameId}/status`), 'finished');
    }
  }

  private verifyWin(game: GameState, playerId: string, pattern: WinningPattern): boolean {
    const player = game.players[playerId];
    if (!player) return false;

    const { card, markedNumbers } = player;

    switch (pattern) {
      case WinningPattern.FULL_HOUSE:
        return this.verifyFullHouse(card, markedNumbers);
      case WinningPattern.SINGLE_LINE:
        return this.verifySingleLine(card, markedNumbers);
      case WinningPattern.FOUR_CORNERS:
        return this.verifyFourCorners(card, markedNumbers);
      default:
        return false;
    }
  }

  private verifyFullHouse(card: number[][], markedNumbers: number[]): boolean {
    return card.flat().every((num) => markedNumbers.includes(num));
  }

  private verifySingleLine(card: number[][], markedNumbers: number[]): boolean {
    // Check rows
    for (const row of card) {
      if (row.every((num) => markedNumbers.includes(num))) return true;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (card.every((row) => markedNumbers.includes(row[col]))) return true;
    }

    return false;
  }

  private verifyFourCorners(card: number[][], markedNumbers: number[]): boolean {
    const corners = [card[0][0], card[0][4], card[4][0], card[4][4]];
    return corners.every((num) => markedNumbers.includes(num));
  }
}

export const gameManager = new GameManager();

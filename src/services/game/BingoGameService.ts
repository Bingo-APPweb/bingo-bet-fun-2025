// src/services/game/BingoGameService.ts

import { database } from '@/config/firebase';
import { ref, set, get, push } from 'firebase/database';
import { BingoCardValidator } from '@/utils/bingo-validator';

interface CreateGameOptions {
  hostId: string;
  roomCode?: string;
  maxPlayers?: number;
  settings?: GameSettings;
}

interface GameSettings {
  drawInterval: number;
  autoDrawEnabled: boolean;
  minPlayersToStart: number;
  winPatterns: WinPattern[];
}

interface JoinGameOptions {
  gameId: string;
  playerId: string;
  playerName: string;
  avatarUrl?: string;
}

type WinPattern = 'line' | 'diagonal' | 'corners' | 'fullHouse';

interface GameState {
  id: string;
  hostId: string;
  roomCode: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  maxPlayers: number;
  settings: GameSettings;
  players: Record<string, PlayerState>;
  currentNumber: number | null;
  drawnNumbers: number[];
  lastDrawTime: number | null;
  createdAt: number;
  updatedAt: number;
}

interface PlayerState {
  id: string;
  name: string;
  avatarUrl?: string;
  card: number[][];
  markedNumbers: number[];
  isWinner: boolean;
  joinedAt: number;
  lastActivity: number;
}

interface WinResult {
  pattern: WinPattern;
  numbers: number[];
}

export class BingoGameService {
  /**
   * Cria um novo jogo
   */
  async createGame(options: CreateGameOptions): Promise<GameState> {
    const gameRef = push(ref(database, 'games'));
    const gameId = gameRef.key!;

    const defaultSettings: GameSettings = {
      drawInterval: 30000, // 30 segundos
      autoDrawEnabled: true,
      minPlayersToStart: 2,
      winPatterns: ['line', 'diagonal', 'corners', 'fullHouse'],
    };

    const game: GameState = {
      id: gameId,
      hostId: options.hostId,
      roomCode: options.roomCode || this.generateRoomCode(),
      status: 'waiting',
      maxPlayers: options.maxPlayers || 50,
      settings: {
        ...defaultSettings,
        ...options.settings,
      },
      players: {},
      currentNumber: null,
      drawnNumbers: [],
      lastDrawTime: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(gameRef, game);
    return game;
  }

  /**
   * Jogador entra no jogo
   */
  async joinGame(options: JoinGameOptions): Promise<PlayerState> {
    // Verifica se o jogo existe e está aceitando jogadores
    const gameRef = ref(database, `games/${options.gameId}`);
    const gameSnap = await get(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Jogo não encontrado');
    }

    const game = gameSnap.val() as GameState;

    if (game.status !== 'waiting') {
      throw new Error('Este jogo não está aceitando novos jogadores');
    }

    if (Object.keys(game.players).length >= game.maxPlayers) {
      throw new Error('Jogo está cheio');
    }

    // Gera uma cartela válida para o jogador
    const card = BingoCardValidator.generateValidCard();

    // Valida a cartela antes de salvar (redundância de segurança)
    const validation = BingoCardValidator.validateCard(card);
    if (!validation.isValid) {
      throw new Error('Erro ao gerar cartela: ' + validation.errors?.join(', '));
    }

    // Salva a cartela e dados do jogador
    const playerData: PlayerState = {
      id: options.playerId,
      name: options.playerName,
      avatarUrl: options.avatarUrl,
      card,
      markedNumbers: [],
      isWinner: false,
      joinedAt: Date.now(),
      lastActivity: Date.now(),
    };

    // Salva em duas referências para facilitar queries
    await Promise.all([
      // Salva na estrutura do jogo
      set(ref(database, `games/${options.gameId}/players/${options.playerId}`), playerData),

      // Salva na coleção de cartelas
      set(ref(database, `bingo_cards/${options.gameId}_${options.playerId}`), {
        ...playerData,
        gameId: options.gameId,
      }),
    ]);

    return playerData;
  }

  /**
   * Marca um número na cartela do jogador
   */
  async markNumber(gameId: string, playerId: string, number: number) {
    // Busca os dados necessários
    const [gameSnap, playerSnap] = await Promise.all([
      get(ref(database, `games/${gameId}`)),
      get(ref(database, `games/${gameId}/players/${playerId}`)),
    ]);

    if (!gameSnap.exists() || !playerSnap.exists()) {
      throw new Error('Jogo ou jogador não encontrado');
    }

    const game = gameSnap.val() as GameState;
    const player = playerSnap.val() as PlayerState;

    // Verifica se o número foi realmente sorteado
    if (!game.drawnNumbers.includes(number)) {
      throw new Error('Este número ainda não foi sorteado');
    }

    // Verifica se o número está na cartela do jogador
    const playerHasNumber = this.checkNumberInCard(player.card, number);

    if (!playerHasNumber) {
      throw new Error('Este número não está na sua cartela');
    }

    // Adiciona o número aos marcados
    const markedNumbers = [...player.markedNumbers, number];

    // Verifica se o jogador ganhou
    let winResult: WinResult | null = null;
    if (game.settings.winPatterns.length > 0) {
      for (const pattern of game.settings.winPatterns) {
        const result = this.checkWinCondition(player.card, markedNumbers, pattern);
        if (result) {
          winResult = result;
          break;
        }
      }
    }

    // Atualiza o estado do jogador
    const updates = {
      markedNumbers,
      lastActivity: Date.now(),
    };

    if (winResult) {
      updates['isWinner'] = true;
    }

    await set(ref(database, `games/${gameId}/players/${playerId}`), {
      ...player,
      ...updates,
    });

    return {
      markedNumbers,
      winResult,
    };
  }

  /**
   * Sorteia um novo número
   */
  async drawNumber(gameId: string, hostId: string): Promise<number | null> {
    const gameRef = ref(database, `games/${gameId}`);
    const gameSnap = await get(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Jogo não encontrado');
    }

    const game = gameSnap.val() as GameState;

    // Verifica se quem está sorteando é o host
    if (game.hostId !== hostId) {
      throw new Error('Apenas o host pode sortear números');
    }

    // Verifica se o jogo está ativo
    if (game.status !== 'active') {
      throw new Error('O jogo precisa estar ativo para sortear números');
    }

    // Verifica intervalo mínimo entre sorteios
    if (game.lastDrawTime && Date.now() - game.lastDrawTime < game.settings.drawInterval) {
      throw new Error('Aguarde o intervalo entre sorteios');
    }

    // Gera lista de números disponíveis
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !game.drawnNumbers.includes(n)
    );

    if (availableNumbers.length === 0) {
      return null;
    }

    // Sorteia novo número
    const number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    // Atualiza o estado do jogo
    await set(gameRef, {
      ...game,
      currentNumber: number,
      drawnNumbers: [...game.drawnNumbers, number],
      lastDrawTime: Date.now(),
      updatedAt: Date.now(),
    });

    return number;
  }

  /**
   * Auxiliar para verificar se um número está na cartela
   */
  private checkNumberInCard(card: number[][], number: number): boolean {
    return card.some((row: number[]) => row.some((num: number) => num === number));
  }

  /**
   * Verifica condição de vitória
   */
  private checkWinCondition(
    card: number[][],
    markedNumbers: number[],
    pattern: WinPattern
  ): WinResult | null {
    const markedSet = new Set(markedNumbers);

    switch (pattern) {
      case 'line': {
        // Verifica linhas
        for (let row = 0; row < card.length; row++) {
          if (card[row].every((num) => markedSet.has(num))) {
            return { pattern: 'line', numbers: [...card[row]] };
          }
        }
        // Verifica colunas
        for (let col = 0; col < card[0].length; col++) {
          const column = card.map((row) => row[col]);
          if (column.every((num) => markedSet.has(num))) {
            return { pattern: 'line', numbers: column };
          }
        }
        break;
      }
      case 'diagonal': {
        const diagonal1 = card.map((row, i) => row[i]);
        const diagonal2 = card.map((row, i) => row[4 - i]);

        if (diagonal1.every((num) => markedSet.has(num))) {
          return { pattern: 'diagonal', numbers: diagonal1 };
        }
        if (diagonal2.every((num) => markedSet.has(num))) {
          return { pattern: 'diagonal', numbers: diagonal2 };
        }
        break;
      }
      case 'corners': {
        const corners = [card[0][0], card[0][4], card[4][0], card[4][4]];
        if (corners.every((num) => markedSet.has(num))) {
          return { pattern: 'corners', numbers: corners };
        }
        break;
      }
      case 'fullHouse': {
        if (card.flat().every((num) => markedSet.has(num))) {
          return { pattern: 'fullHouse', numbers: card.flat() };
        }
        break;
      }
    }

    return null;
  }

  /**
   * Gera código único para sala
   */
  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const bingoGameService = new BingoGameService();

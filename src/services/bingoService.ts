// src/services/bingoService.ts
import { GameState, Player, GameSettings, CardValidationType } from '../types/game';
import { Logger } from '../utils/logger';

/**
 * Service responsible for managing bingo game logic
 */
export class BingoService {
  private static readonly CARD_SIZE = 5;
  private static readonly MAX_NUMBER = 75;
  private static readonly MIN_NUMBER = 1;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Creates a new bingo game instance
   */
  createNewGame(hostId: string, settings: GameSettings): GameState {
    if (!hostId) throw new Error('Host ID is required');
    if (!settings) throw new Error('Game settings are required');

    this.logger.info(`Creating new game with host: ${hostId}`);

    return {
      id: this.generateGameId(),
      status: 'waiting',
      currentNumber: null,
      numbers: this.generateNumbers(),
      players: {},
      hostId,
      winners: [],
      isGameActive: false,
      settings,
      calledNumbers: new Set<number>(),
      currentIndex: 0,
    };
  }

  /**
   * Generates unique game identifier
   */
  private generateGameId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomStr}`;
  }

  /**
   * Generates array of numbers for the game
   */
  generateNumbers(): number[] {
    const numbers = [];
    for (let i = BingoService.MIN_NUMBER; i <= BingoService.MAX_NUMBER; i++) {
      numbers.push(i);
    }
    return this.shuffle(numbers);
  }

  /**
   * Creates a new bingo card
   */
  createBingoCard(): number[][] {
    const card: number[][] = [];
    const usedNumbers = new Set<number>();

    for (let row = 0; row < BingoService.CARD_SIZE; row++) {
      const cardRow: number[] = [];

      for (let col = 0; col < BingoService.CARD_SIZE; col++) {
        const minNumber = 1 + col * 15;
        const maxNumber = minNumber + 14;
        let num: number;

        do {
          num = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        } while (usedNumbers.has(num));

        usedNumbers.add(num);
        cardRow.push(num);
      }

      card.push(cardRow);
    }

    this.logger.debug('New bingo card created');
    return card;
  }

  /**
   * Draws the next number in the game
   */
  drawNextNumber(gameState: GameState): number | null {
    if (gameState.currentIndex >= BingoService.MAX_NUMBER) {
      this.logger.info('All numbers have been drawn');
      return null;
    }

    const nextNumber = gameState.numbers[gameState.currentIndex];
    gameState.calledNumbers.add(nextNumber);
    gameState.currentNumber = nextNumber;
    gameState.currentIndex++;

    this.logger.info(`Number drawn: ${nextNumber}`);
    return nextNumber;
  }

  /**
   * Validates if a card has won based on the specified validation type
   */
  validateWinningCard(
    card: number[][],
    calledNumbers: Set<number>,
    validationType: CardValidationType = 'full'
  ): boolean {
    // Validate full card
    if (validationType === 'full') {
      return card.every((row) => row.every((num) => calledNumbers.has(num)));
    }

    // Validate horizontal lines
    if (validationType === 'horizontal') {
      return card.some((row) => row.every((num) => calledNumbers.has(num)));
    }

    // Validate vertical lines
    if (validationType === 'vertical') {
      for (let col = 0; col < BingoService.CARD_SIZE; col++) {
        let isColumnComplete = true;
        for (let row = 0; row < BingoService.CARD_SIZE; row++) {
          if (!calledNumbers.has(card[row][col])) {
            isColumnComplete = false;
            break;
          }
        }
        if (isColumnComplete) return true;
      }
    }

    // Validate diagonals
    if (validationType === 'diagonal') {
      // Main diagonal
      let isMainDiagonalComplete = true;
      for (let i = 0; i < BingoService.CARD_SIZE; i++) {
        if (!calledNumbers.has(card[i][i])) {
          isMainDiagonalComplete = false;
          break;
        }
      }
      if (isMainDiagonalComplete) return true;

      // Secondary diagonal
      let isSecondaryDiagonalComplete = true;
      for (let i = 0; i < BingoService.CARD_SIZE; i++) {
        if (!calledNumbers.has(card[i][BingoService.CARD_SIZE - 1 - i])) {
          isSecondaryDiagonalComplete = false;
          break;
        }
      }
      return isSecondaryDiagonalComplete;
    }

    return false;
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  private shuffle(array: number[]): number[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Adds a player to the game
   */
  addPlayer(gameState: GameState, playerId: string, playerName: string): void {
    if (gameState.isGameActive) {
      throw new Error('Cannot add player to an active game');
    }

    if (gameState.players[playerId]) {
      throw new Error('Player already exists in this game');
    }

    this.logger.info(`Adding player ${playerName} to game ${gameState.id}`);

    gameState.players[playerId] = {
      id: playerId,
      name: playerName,
      card: this.createBingoCard(),
      hasWon: false,
    };
  }

  /**
   * Starts the game if conditions are met
   */
  startGame(gameState: GameState): void {
    if (Object.keys(gameState.players).length === 0) {
      throw new Error('Cannot start game with no players');
    }

    if (gameState.isGameActive) {
      throw new Error('Game is already active');
    }

    gameState.isGameActive = true;
    gameState.status = 'active';
    this.logger.info(`Game ${gameState.id} started`);
  }
}

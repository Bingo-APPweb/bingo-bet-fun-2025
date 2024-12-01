
// src/stores/gameStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Enhanced Types
type GameStatus = 'waiting' | 'active' | 'completed' | 'paused';
type WinPattern = 'line' | 'diagonal' | 'corners' | 'fullHouse';
type CardPosition = [number, number]; // [row, col]

interface PlayerState {
  id: string;
  name: string;
  card: number[][];
  markedNumbers: Set<number>; // Using Set for better performance
  isWinner: boolean;
  joinedAt: Date;
  lastActivity: Date;
}

interface GameSettings {
  centerFree: boolean;
  autoMarkNumbers: boolean;
  winPatterns: WinPattern[];
  numberCallInterval?: number; // Time in ms between number calls
  maxPlayers?: number;
  minPlayersToStart?: number;
}

interface GameState {
  id: string;
  status: GameStatus;
  currentNumber: number | null;
  numbers: Set<number>; // Using Set for better performance
  players: Record<string, PlayerState>;
  hostId: string;
  settings: GameSettings;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date;
  stats: GameStats;
}

interface GameStats {
  startTime: Date | null;
  endTime: Date | null;
  totalNumbers: number;
  winnersCount: number;
  roundDuration: number;
}

interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  markNumber: (number: number) => void;
  drawNumber: () => void;
  endGame: () => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
  addPlayer: (player: Omit<PlayerState, 'markedNumbers' | 'isWinner' | 'joinedAt' | 'lastActivity'>) => void;
  removePlayer: (playerId: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  checkWinCondition: (playerId: string) => boolean;
}

interface GameStore {
  game: GameState;
  isHost: boolean;
  actions: GameActions;
}

const initialGameStats: GameStats = {
  startTime: null,
  endTime: null,
  totalNumbers: 0,
  winnersCount: 0,
  roundDuration: 0,
};

const initialGameState: GameState = {
  id: '',
  status: 'waiting',
  currentNumber: null,
  numbers: new Set(),
  players: {},
  hostId: '',
  settings: {
    centerFree: false,
    autoMarkNumbers: true,
    winPatterns: ['fullHouse'],
    numberCallInterval: 3000,
    maxPlayers: 50,
    minPlayersToStart: 2,
  },
  isLoading: false,
  error: null,
  lastUpdate: new Date(),
  stats: initialGameStats,
};

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        game: initialGameState,
        isHost: false,
        actions: {
          startGame: () => {
            const state = get();
            if (!state.isHost) {
              set((state) => ({
                game: { ...state.game, error: 'Only host can start the game' }
              }));
              return;
            }

            const playerCount = Object.keys(state.game.players).length;
            if (playerCount < (state.game.settings.minPlayersToStart || 2)) {
              set((state) => ({
                game: { ...state.game, error: 'Not enough players to start' }
              }));
              return;
            }

            set((state) => ({
              game: {
                ...state.game,
                status: 'active',
                numbers: new Set(),
                currentNumber: null,
                error: null,
                stats: {
                  ...state.game.stats,
                  startTime: new Date(),
                  totalNumbers: 0,
                  winnersCount: 0,
                },
                lastUpdate: new Date(),
              },
            }));
          },

          pauseGame: () => {
            const state = get();
            if (!state.isHost) return;

            set((state) => ({
              game: {
                ...state.game,
                status: 'paused',
                lastUpdate: new Date(),
              },
            }));
          },

          resumeGame: () => {
            const state = get();
            if (!state.isHost) return;

            set((state) => ({
              game: {
                ...state.game,
                status: 'active',
                lastUpdate: new Date(),
              },
            }));
          },

          markNumber: (number: number) => {
            const state = get();
            const { game } = state;

            if (game.status !== 'active') {
              set((state) => ({
                game: { ...state.game, error: 'Game is not active' }
              }));
              return;
            }

            if (!game.numbers.has(number)) {
              set((state) => ({
                game: { ...state.game, error: 'Number has not been drawn yet' }
              }));
              return;
            }

            const player = game.players[game.hostId];
            if (!player) {
              set((state) => ({
                game: { ...state.game, error: 'Player not found' }
              }));
              return;
            }

            // Update player's marked numbers
            const updatedMarkedNumbers = new Set(player.markedNumbers);
            updatedMarkedNumbers.add(number);

            set((state) => ({
              game: {
                ...state.game,
                players: {
                  ...state.game.players,
                  [game.hostId]: {
                    ...player,
                    markedNumbers: updatedMarkedNumbers,
                    lastActivity: new Date(),
                  },
                },
                error: null,
                lastUpdate: new Date(),
              },
            }));

            // Check win condition after marking
            get().actions.checkWinCondition(game.hostId);
          },

          drawNumber: () => {
            const state = get();
            if (!state.isHost || state.game.status !== 'active') return;

            const availableNumbers = Array.from(
              { length: 75 },
              (_, i) => i + 1
            ).filter(n => !state.game.numbers.has(n));

            if (availableNumbers.length === 0) {
              set((state) => ({
                game: { ...state.game, error: 'No more numbers available' }
              }));
              return;
            }

            const newNumber = availableNumbers[
              Math.floor(Math.random() * availableNumbers.length)
            ];

            const updatedNumbers = new Set(state.game.numbers);
            updatedNumbers.add(newNumber);

            set((state) => ({
              game: {
                ...state.game,
                currentNumber: newNumber,
                numbers: updatedNumbers,
                stats: {
                  ...state.game.stats,
                  totalNumbers: state.game.stats.totalNumbers + 1,
                },
                error: null,
                lastUpdate: new Date(),
              },
            }));

            // Auto-mark numbers if enabled
            if (state.game.settings.autoMarkNumbers) {
              Object.keys(state.game.players).forEach((playerId) => {
                const playerCard = state.game.players[playerId].card;
                if (playerCard.some(row => row.includes(newNumber))) {
                  get().actions.markNumber(newNumber);
                }
              });
            }
          },

          checkWinCondition: (playerId: string) => {
            const state = get();
            const player = state.game.players[playerId];
            if (!player) return false;

            const hasWon = state.game.settings.winPatterns.some(pattern => {
              switch (pattern) {
                case 'fullHouse':
                  return player.card.every(row =>
                    row.every(num => player.markedNumbers.has(num))
                  );
                // Add other pattern checks as needed
                default:
                  return false;
              }
            });

            if (hasWon) {
              set((state) => ({
                game: {
                  ...state.game,
                  players: {
                    ...state.game.players,
                    [playerId]: {
                      ...player,
                      isWinner: true,
                    },
                  },
                  stats: {
                    ...state.game.stats,
                    winnersCount: state.game.stats.winnersCount + 1,
                  },
                },
              }));
            }

            return hasWon;
          },

          // Add remaining action implementations...
        },
      }),
      {
        name: 'bingo-game-storage',
        partialize: (state) => ({
          game: {
            ...state.game,
            isLoading: false,
            error: null,
          },
        }),
      }
    )
  )
);
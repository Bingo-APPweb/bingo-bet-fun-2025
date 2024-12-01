import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { BingoService } from './services/bingoService';
import { StreamService } from './services/streamService';
import { EventEmitter } from './utils/events';

interface GameState {
  id: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  currentNumber: number | null;
  drawnNumbers: number[];
  players: Record<string, PlayerState>;
  stream: {
    id: string;
    platform: 'youtube' | 'twitch';
    metrics: StreamMetrics;
  };
  settings: GameSettings;
  lastUpdate: number;
}

interface PlayerState {
  id: string;
  name: string;
  card: number[][];
  markedNumbers: number[];
  isWinner: boolean;
  connected: boolean;
}

interface StreamMetrics {
  viewers: number;
  likes: number;
  chatMessages: number;
  lastUpdate: number;
}

interface GameSettings {
  autoMarkNumbers: boolean;
  centerFree: boolean;
  winPatterns: ('line' | 'diagonal' | 'corners' | 'fullHouse')[];
  drawInterval: number;
  minPlayers: number;
}

export class BingoGameCore extends EventEmitter {
  private readonly bingoService: BingoService;
  private readonly streamService: StreamService;
  private readonly db: ReturnType<typeof getFirestore>;
  private readonly rtdb: ReturnType<typeof getDatabase>;
  private gameState: GameState | null = null;
  private streamUpdateInterval: NodeJS.Timeout | null = null;
  private numberGenerationInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly gameId: string,
    private readonly hostId: string,
    private readonly firebaseConfig: any,
    private readonly streamConfig: {
      platform: 'youtube' | 'twitch';
      apiKey: string;
      channelId: string;
    }
  ) {
    super();

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.rtdb = getDatabase(app);

    // Initialize services
    this.bingoService = new BingoService();
    this.streamService = new StreamService(streamConfig);

    // Bind methods
    this.startGame = this.startGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.drawNumber = this.drawNumber.bind(this);
    this.markNumber = this.markNumber.bind(this);
  }

  async initialize(): Promise<void> {
    try {
      // Setup realtime listeners
      this.setupGameStateListener();
      this.setupPlayersListener();

      // Initialize stream integration
      await this.streamService.connect();
      this.startStreamMetricsUpdates();

      // Initialize game state
      const initialState: GameState = {
        id: this.gameId,
        status: 'waiting',
        currentNumber: null,
        drawnNumbers: [],
        players: {},
        stream: {
          id: this.streamConfig.channelId,
          platform: this.streamConfig.platform,
          metrics: {
            viewers: 0,
            likes: 0,
            chatMessages: 0,
            lastUpdate: Date.now(),
          },
        },
        settings: {
          autoMarkNumbers: true,
          centerFree: true,
          winPatterns: ['line', 'fullHouse'],
          drawInterval: 30000,
          minPlayers: 2,
        },
        lastUpdate: Date.now(),
      };

      await setDoc(doc(this.db, 'games', this.gameId), initialState);
      this.gameState = initialState;

      this.emit('initialized', this.gameState);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private setupGameStateListener(): void {
    const gameRef = doc(this.db, 'games', this.gameId);
    onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const newState = snapshot.data() as GameState;
        this.gameState = newState;
        this.emit('stateChanged', newState);
      }
    });
  }

  private setupPlayersListener(): void {
    const playersRef = ref(this.rtdb, `game_players/${this.gameId}`);
    onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const players = snapshot.val();
        this.updatePlayers(players);
      }
    });
  }

  private startStreamMetricsUpdates(): void {
    if (this.streamUpdateInterval) {
      clearInterval(this.streamUpdateInterval);
    }

    this.streamUpdateInterval = setInterval(async () => {
      try {
        const metrics = await this.streamService.getMetrics();
        await this.updateStreamMetrics(metrics);
      } catch (error) {
        this.emit('error', error);
      }
    }, 30000); // Update every 30 seconds
  }

  private async updateStreamMetrics(metrics: StreamMetrics): Promise<void> {
    if (!this.gameState) return;

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      'stream.metrics': {
        ...metrics,
        lastUpdate: Date.now(),
      },
    });
  }

  private async updatePlayers(players: Record<string, PlayerState>): Promise<void> {
    if (!this.gameState) return;

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, { players });
  }

  async startGame(): Promise<void> {
    if (!this.gameState || this.gameState.status !== 'waiting') return;
    if (Object.keys(this.gameState.players).length < this.gameState.settings.minPlayers) {
      throw new Error('Not enough players to start the game');
    }

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      status: 'active',
      lastUpdate: Date.now(),
    });

    this.startNumberGeneration();
  }

  private startNumberGeneration(): void {
    if (this.numberGenerationInterval) {
      clearInterval(this.numberGenerationInterval);
    }

    this.numberGenerationInterval = setInterval(async () => {
      if (this.gameState?.status === 'active') {
        await this.drawNumber();
      }
    }, this.gameState?.settings.drawInterval || 30000);
  }

  async pauseGame(): Promise<void> {
    if (!this.gameState || this.gameState.status !== 'active') return;

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      status: 'paused',
      lastUpdate: Date.now(),
    });

    if (this.numberGenerationInterval) {
      clearInterval(this.numberGenerationInterval);
    }
  }

  async endGame(): Promise<void> {
    if (!this.gameState || this.gameState.status === 'completed') return;

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      status: 'completed',
      lastUpdate: Date.now(),
    });

    if (this.numberGenerationInterval) {
      clearInterval(this.numberGenerationInterval);
    }

    if (this.streamUpdateInterval) {
      clearInterval(this.streamUpdateInterval);
    }
  }

  async drawNumber(): Promise<number | null> {
    if (!this.gameState || this.gameState.status !== 'active') return null;

    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !this.gameState!.drawnNumbers.includes(n)
    );

    if (availableNumbers.length === 0) {
      await this.endGame();
      return null;
    }

    const newNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      currentNumber: newNumber,
      drawnNumbers: [...this.gameState.drawnNumbers, newNumber],
      lastUpdate: Date.now(),
    });

    this.emit('numberDrawn', newNumber);
    return newNumber;
  }

  async markNumber(playerId: string, number: number): Promise<void> {
    if (!this.gameState || !this.gameState.players[playerId]) return;

    const player = this.gameState.players[playerId];
    if (!this.gameState.drawnNumbers.includes(number)) {
      throw new Error('Number has not been drawn yet');
    }

    if (player.markedNumbers.includes(number)) return;

    // Update player's marked numbers
    const updatedMarkedNumbers = [...player.markedNumbers, number];
    const playerRef = ref(this.rtdb, `game_players/${this.gameId}/${playerId}`);
    await set(playerRef, {
      ...player,
      markedNumbers: updatedMarkedNumbers,
    });

    // Check for win
    if (this.checkWin(player.card, updatedMarkedNumbers)) {
      await this.handleWin(playerId);
    }
  }

  private checkWin(card: number[][], markedNumbers: number[]): boolean {
    return this.bingoService.validateWinningCard(
      card,
      new Set(markedNumbers),
      this.gameState!.settings.winPatterns[0]
    );
  }

  private async handleWin(playerId: string): Promise<void> {
    const gameRef = doc(this.db, 'games', this.gameId);
    await updateDoc(gameRef, {
      [`players.${playerId}.isWinner`]: true,
      status: 'completed',
      lastUpdate: Date.now(),
    });

    this.emit('winner', playerId);
    await this.endGame();
  }

  async cleanup(): Promise<void> {
    if (this.numberGenerationInterval) {
      clearInterval(this.numberGenerationInterval);
    }
    if (this.streamUpdateInterval) {
      clearInterval(this.streamUpdateInterval);
    }
    await this.streamService.disconnect();
    this.removeAllListeners();
  }

  getState(): GameState | null {
    return this.gameState;
  }
}

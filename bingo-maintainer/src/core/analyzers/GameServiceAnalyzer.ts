import { EventEmitter } from 'events';

interface GameState {
  status: 'waiting' | 'active' | 'completed';
  currentNumber: number | null;
  drawnNumbers: number[];
  players: Record<string, Player>;
  lastUpdate: number;
}

interface Player {
  id: string;
  name: string;
  active: boolean;
  isHost: boolean;
  card: number[][];
  markedNumbers: number[];
}

export class GameService {
  private state: GameState;
  private events: EventEmitter;
  private subscribers: Set<(state: GameState) => void>;

  constructor() {
    this.state = {
      status: 'waiting',
      currentNumber: null,
      drawnNumbers: [],
      players: {},
      lastUpdate: Date.now(),
    };
    this.events = new EventEmitter();
    this.subscribers = new Set();
  }

  getState(): GameState {
    return { ...this.state };
  }

  addPlayer(id: string, name: string, isHost: boolean = false): void {
    if (!id || !name) {
      throw new Error('Invalid player data');
    }

    this.state.players[id] = {
      id,
      name,
      active: true,
      isHost,
      card: this.generateCard(),
      markedNumbers: [],
    };

    this.updateState();
  }

  removePlayer(id: string): void {
    delete this.state.players[id];
    this.updateState();
  }

  startGame(): void {
    this.state.status = 'active';
    this.updateState();
  }

  drawNumber(): number | undefined {
    if (this.state.status !== 'active') return;

    const available = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !this.state.drawnNumbers.includes(n)
    );

    if (available.length === 0) {
      this.state.status = 'completed';
      this.updateState();
      return;
    }

    const index = Math.floor(Math.random() * available.length);
    const number = available[index];

    this.state.currentNumber = number;
    this.state.drawnNumbers.push(number);
    this.updateState();

    return number;
  }

  markNumber(playerId: string, number: number): void {
    const player = this.state.players[playerId];
    if (!player) return;

    if (!player.markedNumbers.includes(number)) {
      player.markedNumbers.push(number);
      this.updateState();
    }
  }

  checkWin(playerId: string): boolean {
    const player = this.state.players[playerId];
    if (!player) return false;

    // Check rows
    for (let row = 0; row < 5; row++) {
      if (player.card[row].every((num) => player.markedNumbers.includes(num))) {
        return true;
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (player.card.every((row) => player.markedNumbers.includes(row[col]))) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = [0, 1, 2, 3, 4].every((i) =>
      player.markedNumbers.includes(player.card[i][i])
    );
    const diagonal2 = [0, 1, 2, 3, 4].every((i) =>
      player.markedNumbers.includes(player.card[i][4 - i])
    );

    return diagonal1 || diagonal2;
  }

  subscribe(callback: (state: GameState) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getState());

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private generateCard(): number[][] {
    const card = Array(5)
      .fill(null)
      .map(() => Array(5).fill(0));
    const used = new Set<number>();

    for (let col = 0; col < 5; col++) {
      const min = col * 15 + 1;
      const max = min + 14;

      for (let row = 0; row < 5; row++) {
        let num;
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (used.has(num));
        used.add(num);
        card[row][col] = num;
      }
    }

    return card;
  }

  private updateState(): void {
    this.state.lastUpdate = Date.now();
    this.subscribers.forEach((callback) => callback(this.getState()));
  }
}

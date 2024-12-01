// src/__tests__/stores/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/stores/gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.setState({
      game: {
        id: '',
        status: 'waiting',
        currentNumber: null,
        numbers: [],
        players: {},
        hostId: '',
        settings: {
          centerFree: false,
          autoMarkNumbers: true,
          winPatterns: ['fullHouse'],
        },
      },
      isHost: false,
    });
  });

  describe('startGame', () => {
    it('should not start game if not host', () => {
      const store = useGameStore.getState();
      store.startGame();
      expect(store.game.status).toBe('waiting');
    });

    it('should start game if host', () => {
      useGameStore.setState({ isHost: true });
      const store = useGameStore.getState();
      store.startGame();
      expect(store.game.status).toBe('active');
    });
  });

  describe('drawNumber', () => {
    it('should not draw number if not host', () => {
      const store = useGameStore.getState();
      store.drawNumber();
      expect(store.game.numbers).toHaveLength(0);
    });

    it('should draw number if host and game is active', () => {
      useGameStore.setState({
        isHost: true,
        game: {
          ...useGameStore.getState().game,
          status: 'active',
        },
      });

      const store = useGameStore.getState();
      store.drawNumber();

      expect(store.game.numbers).toHaveLength(1);
      expect(store.game.currentNumber).toBeDefined();
      expect(store.game.numbers).toContain(store.game.currentNumber);
    });

    it('should not draw number if game is not active', () => {
      useGameStore.setState({ isHost: true });
      const store = useGameStore.getState();
      store.drawNumber();
      expect(store.game.numbers).toHaveLength(0);
    });
  });

  describe('markNumber', () => {
    beforeEach(() => {
      useGameStore.setState({
        game: {
          ...useGameStore.getState().game,
          status: 'active',
          numbers: [1, 2, 3],
          hostId: 'host1',
          players: {
            host1: {
              id: 'host1',
              name: 'Host',
              card: [],
              markedNumbers: [],
              isWinner: false,
            },
          },
        },
      });
    });

    it('should mark number if it has been drawn', () => {
      const store = useGameStore.getState();
      store.markNumber(1);
      expect(store.game.players.host1.markedNumbers).toContain(1);
    });

    it('should not mark number if it has not been drawn', () => {
      const store = useGameStore.getState();
      store.markNumber(10);
      expect(store.game.players.host1.markedNumbers).toHaveLength(0);
    });
  });

  describe('endGame', () => {
    it('should not end game if not host', () => {
      const store = useGameStore.getState();
      store.game.status = 'active';
      store.endGame();
      expect(store.game.status).toBe('active');
    });

    it('should end game if host', () => {
      useGameStore.setState({ isHost: true });
      const store = useGameStore.getState();
      store.game.status = 'active';
      store.endGame();
      expect(store.game.status).toBe('completed');
    });
  });
});

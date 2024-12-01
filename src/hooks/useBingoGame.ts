// src/hooks/useBingoGame.ts
import { useState, useEffect } from 'react';
import { BingoService } from '../services/bingoService';
import { GameState, GameSettings } from '../types/game';

export const useBingoGame = (hostId: string, initialSettings: GameSettings) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const bingoService = new BingoService();

  useEffect(() => {
    const newGame = bingoService.createNewGame(hostId, initialSettings);
    setGameState(newGame);
  }, [hostId, initialSettings]);

  const startGame = () => {
    if (gameState) {
      setGameState({
        ...gameState,
        status: 'active',
        isGameActive: true,
      });
    }
  };

  return { gameState, startGame };
};

// src/features/game/GameProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeServices } from '@/lib/services/ServiceIntegrationManager';
import { Card } from '@/types/game.types';

interface GameContextType {
  metrics: any;
  bingoNumbers: number[];
  currentCard: Card | null;
  gameState: any;
  isValidated: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [bingoNumbers, setBingoNumbers] = useState<number[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const services = initializeServices();

    // Monitorar métricas
    services.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
      const numbers = services.processMetricsForBingo(newMetrics);
      setBingoNumbers((prev) => [...new Set([...prev, ...numbers])]);

      // Atualiza estado do jogo
      const newGameState = {
        metrics: newMetrics,
        currentNumbers: numbers,
        timestamp: Date.now(),
      };
      setGameState(newGameState);

      // Valida o estado
      services
        .validateGameState(newGameState)
        .then(() => setIsValidated(true))
        .catch(console.error);
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        metrics,
        bingoNumbers,
        currentCard,
        gameState,
        isValidated,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

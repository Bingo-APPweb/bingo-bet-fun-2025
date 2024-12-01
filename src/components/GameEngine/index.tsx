import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameState {
  status: 'idle' | 'active' | 'completed';
  currentNumbers: number[];
  bingoCard: number[][];
  markedPositions: boolean[][];
  lastDrawnNumber: number | null;
}

interface StreamMetrics {
  viewCount: number;
  engagementRate: string;
}

const GameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    currentNumbers: [],
    bingoCard: generateInitialCard(),
    markedPositions: Array(5)
      .fill(null)
      .map(() => Array(5).fill(false)),
    lastDrawnNumber: null,
  });

  const [metrics, setMetrics] = useState<StreamMetrics>({
    viewCount: 0,
    engagementRate: '0',
  });

  function generateInitialCard(): number[][] {
    const card = [];
    const used = new Set<number>();

    for (let col = 0; col < 5; col++) {
      const column = [];
      const min = col * 15 + 1;
      const max = min + 14;

      for (let row = 0; row < 5; row++) {
        let num;
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (used.has(num));
        used.add(num);
        column.push(num);
      }
      card.push(column);
    }

    return card;
  }

  const handleNumberClick = (row: number, col: number) => {
    if (gameState.status !== 'active') return;

    const number = gameState.bingoCard[row][col];
    if (gameState.currentNumbers.includes(number)) {
      const newPositions = [...gameState.markedPositions];
      newPositions[row][col] = !newPositions[row][col];
      setGameState((prev) => ({
        ...prev,
        markedPositions: newPositions,
      }));
    }
  };

  const verifyWin = (): boolean => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (gameState.markedPositions[i].every((marked) => marked)) return true;
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (gameState.markedPositions.every((row) => row[i])) return true;
    }

    // Check diagonals
    const diagonal1 = Array(5)
      .fill(null)
      .every((_, i) => gameState.markedPositions[i][i]);
    const diagonal2 = Array(5)
      .fill(null)
      .every((_, i) => gameState.markedPositions[i][4 - i]);

    return diagonal1 || diagonal2;
  };

  // Simulate metrics updates
  useEffect(() => {
    if (gameState.status !== 'active') return;

    const interval = setInterval(() => {
      setMetrics({
        viewCount: Math.floor(Math.random() * 1000) + 500,
        engagementRate: (Math.random() * 100).toFixed(1),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState.status]);

  // Process metrics to generate numbers
  useEffect(() => {
    if (gameState.status === 'active' && metrics.viewCount > 0) {
      const newNumber = Math.floor((metrics.viewCount % 75) + 1);
      if (!gameState.currentNumbers.includes(newNumber)) {
        setGameState((prev) => ({
          ...prev,
          currentNumbers: [...prev.currentNumbers, newNumber],
          lastDrawnNumber: newNumber,
        }));
      }
    }
  }, [metrics, gameState.status]);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Bingo Card</span>
            {gameState.lastDrawnNumber && (
              <span className='text-lg bg-blue-100 px-3 py-1 rounded-full'>
                Number: {gameState.lastDrawnNumber}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-5 gap-2'>
            {gameState.bingoCard.map((row, rowIndex) =>
              row.map((number, colIndex) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant={gameState.markedPositions[rowIndex][colIndex] ? 'secondary' : 'outline'}
                  className='aspect-square text-lg font-bold'
                  onClick={() => handleNumberClick(rowIndex, colIndex)}
                  disabled={gameState.status !== 'active'}
                >
                  {number}
                </Button>
              ))
            )}
          </div>

          <div className='flex justify-between mt-4'>
            <Button
              onClick={() =>
                setGameState((prev) => ({
                  ...prev,
                  status: prev.status === 'active' ? 'idle' : 'active',
                }))
              }
            >
              {gameState.status === 'active' ? 'Stop Game' : 'Start Game'}
            </Button>

            <Button
              variant='secondary'
              onClick={() => {
                if (verifyWin()) {
                  setGameState((prev) => ({
                    ...prev,
                    status: 'completed',
                  }));
                }
              }}
              disabled={gameState.status !== 'active'}
            >
              Verify Win
            </Button>
          </div>

          {/* Metrics Display */}
          {gameState.status === 'active' && (
            <div className='mt-4 text-sm text-muted-foreground'>
              <div>Viewers: {metrics.viewCount}</div>
              <div>Engagement: {metrics.engagementRate}%</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameEngine;

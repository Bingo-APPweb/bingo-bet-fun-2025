// src/components/game/GameControls/index.tsx
import React from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCw } from 'lucide-react';

export function GameControls() {
  const { game, startGame, drawNumber, endGame } = useGameStore();

  return (
    <div className='flex gap-4'>
      {game.status === 'waiting' && (
        <Button onClick={startGame} className='flex-1'>
          <Play className='h-4 w-4 mr-2' />
          Start Game
        </Button>
      )}

      {game.status === 'active' && (
        <>
          <Button onClick={drawNumber} className='flex-1'>
            <RotateCw className='h-4 w-4 mr-2' />
            Draw Number
          </Button>

          <Button onClick={endGame} className='flex-1'>
            <Pause className='h-4 w-4 mr-2' />
            End Game
          </Button>
        </>
      )}
    </div>
  );
}

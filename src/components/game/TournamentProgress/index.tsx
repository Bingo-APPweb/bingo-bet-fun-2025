// Posição na árvore:
// src/components/game/TournamentProgress/index.tsx

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Timer, Star } from 'lucide-react';

interface TournamentProgressProps {
  currentRound: number;
  totalRounds: number;
  activePlayers: number;
  totalPlayers: number;
  timeRemaining: number;
  totalPrizePool?: number; // Tornar opcional
}

const TournamentProgress = ({
  currentRound,
  totalRounds,
  activePlayers,
  totalPlayers,
  timeRemaining,
  totalPrizePool = 0, // Valor padrão
}: TournamentProgressProps) => {
  const roundProgress = (currentRound / totalRounds) * 100;
  const playerProgress = (activePlayers / totalPlayers) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPrizePool = (value: number) => {
    try {
      return `$${value.toLocaleString()}`;
    } catch (error) {
      return '$0';
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Trophy className='w-5 h-5 text-yellow-500' />
          Tournament Progress
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Rounds Progress */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4' />
              Round Progress
            </div>
            <span>{Math.round(roundProgress)}%</span>
          </div>
          <Progress value={roundProgress} className='h-2' />
          <div className='text-sm text-gray-500'>
            Round {currentRound} of {totalRounds}
          </div>
        </div>

        {/* Players Progress */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              Active Players
            </div>
            <span>{Math.round(playerProgress)}%</span>
          </div>
          <Progress value={playerProgress} className='h-2' />
          <div className='text-sm text-gray-500'>
            {activePlayers} of {totalPlayers} players remaining
          </div>
        </div>

        {/* Time and Prize Info */}
        <div className='grid grid-cols-2 gap-4 pt-2'>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center gap-2 text-sm font-medium mb-1'>
              <Timer className='w-4 h-4' />
              Time Remaining
            </div>
            <div className='text-lg font-bold'>{formatTime(timeRemaining)}</div>
          </div>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center gap-2 text-sm font-medium mb-1'>
              <Trophy className='w-4 h-4' />
              Prize Pool
            </div>
            <div className='text-lg font-bold'>{formatPrizePool(totalPrizePool)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentProgress;

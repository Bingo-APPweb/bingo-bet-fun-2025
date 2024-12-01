import { useGameStore } from '@/stores/gameStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function GameComponent() {
  const { game, isHost, startGame, markNumber, drawNumber } = useGameStore();

  // Error handling
  if (game.error) {
    return (
      <Card className='bg-red-50 border-red-200'>
        <CardContent className='p-4'>
          <div className='text-red-600'>{game.error}</div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (game.isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-2'>Loading game...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bingo Game - {game.status.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Host Controls */}
        {isHost && (
          <div className='space-x-4'>
            <Button onClick={startGame} disabled={game.status === 'active'}>
              Start Game
            </Button>
            <Button onClick={() => drawNumber()} disabled={game.status !== 'active'}>
              Draw Number
            </Button>
          </div>
        )}

        {/* Current Number Display */}
        {game.currentNumber && (
          <div className='text-center py-4'>
            <div className='text-sm text-gray-500'>Current Number</div>
            <div className='text-4xl font-bold'>{game.currentNumber}</div>
          </div>
        )}

        {/* Numbers List */}
        <div className='grid grid-cols-5 gap-2'>
          {game.numbers.map((number) => (
            <div
              key={number}
              onClick={() => markNumber(number)}
              className={`
                p-4 text-center rounded-lg cursor-pointer
                ${
                  game.players[game.hostId]?.markedNumbers.includes(number)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }
              `}
            >
              {number}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

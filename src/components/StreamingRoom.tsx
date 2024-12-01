import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Users, Trophy, MessageSquare, Heart, Globe } from 'lucide-react';
import { SectionManager } from './layout/SectionManager';

interface StreamStats {
  viewers: number;
  likes: number;
  participants: number;
  bingoNumbers: number[];
}

interface GameState {
  isPlaying: boolean;
  currentNumber: number | null;
  winningPattern: string;
  winners: string[];
}

const StreamingRoom: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('stream');
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: 0,
    likes: 0,
    participants: 0,
    bingoNumbers: [],
  });

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentNumber: null,
    winningPattern: 'fullhouse',
    winners: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats((prev) => ({
        ...prev,
        viewers: Math.floor(Math.random() * 1000) + 500,
        likes: prev.likes + Math.floor(Math.random() * 10),
        participants: Math.floor(Math.random() * 200) + 100,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col h-screen bg-background'>
      <div className='border-b p-4 flex justify-between items-center bg-white'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold text-primary'>BingoBetFun</h1>
          <div className='flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
            <Globe className='h-4 w-4' />
            <span>Live</span>
          </div>
        </div>
        <div className='flex gap-6'>
          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 text-blue-500' />
            <span className='font-semibold'>{streamStats.viewers.toLocaleString()}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Heart className='h-4 w-4 text-rose-500' />
            <span className='font-semibold'>{streamStats.likes.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className='flex-1 p-4'>
        <SectionManager />
      </div>

      {gameState.winners.length > 0 && (
        <Alert className='fixed bottom-4 right-4 w-auto bg-green-50 border-green-500'>
          <AlertDescription className='flex items-center gap-2'>
            <Trophy className='h-4 w-4 text-green-500' />
            Congratulations to our winners!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StreamingRoom;

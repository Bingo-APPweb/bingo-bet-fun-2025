// src/features/game/GameCore.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGame } from './GameProvider';
import { Play, Pause, RefreshCw, Trophy } from 'lucide-react';

interface GameCoreProps {
  streamId?: string;
}

const GameCore: React.FC<GameCoreProps> = ({ streamId = import.meta.env.VITE_DEFAULT_CHANNEL }) => {
  const { metrics, bingoNumbers, isValidated } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCard, setCurrentCard] = useState<number[][]>([]);
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'won'>('waiting');

  // Inicializar cartela
  useEffect(() => {
    if (!currentCard.length) {
      generateNewCard();
    }
  }, []);

  // Monitorar números sorteados
  useEffect(() => {
    if (isPlaying && bingoNumbers.length > 0) {
      const lastNumber = bingoNumbers[bingoNumbers.length - 1];
      checkNumber(lastNumber);
    }
  }, [bingoNumbers, isPlaying]);

  const generateNewCard = () => {
    const numbers: number[][] = [];
    const used = new Set<number>();

    for (let col = 0; col < 5; col++) {
      const column: number[] = [];
      const min = col * 15 + 1;
      const max = min + 14;

      while (column.length < 5) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!used.has(num)) {
          used.add(num);
          column.push(num);
        }
      }
      numbers.push(column);
    }

    setCurrentCard(numbers);
    setMarkedNumbers(new Set());
  };

  const checkNumber = (number: number) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (currentCard[i][j] === number) {
          const newMarked = new Set(markedNumbers);
          newMarked.add(number);
          setMarkedNumbers(newMarked);
          checkWin(newMarked);
        }
      }
    }
  };

  const checkWin = (marked: Set<number>) => {
    // Verificar linhas
    for (let i = 0; i < 5; i++) {
      if (currentCard[i].every((num) => marked.has(num))) {
        setGameStatus('won');
        return;
      }
    }

    // Verificar colunas
    for (let j = 0; j < 5; j++) {
      if (currentCard.every((row) => marked.has(row[j]))) {
        setGameStatus('won');
        return;
      }
    }

    // Verificar diagonais
    const diagonal1 = Array(5)
      .fill(0)
      .every((_, i) => marked.has(currentCard[i][i]));
    const diagonal2 = Array(5)
      .fill(0)
      .every((_, i) => marked.has(currentCard[i][4 - i]));

    if (diagonal1 || diagonal2) {
      setGameStatus('won');
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Bingo em Tempo Real</span>
            <div className='flex items-center gap-2'>
              <Button
                variant={isPlaying ? 'destructive' : 'default'}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className='h-4 w-4 mr-2' /> : <Play className='h-4 w-4 mr-2' />}
                {isPlaying ? 'Pausar' : 'Iniciar'}
              </Button>
              <Button variant='outline' onClick={generateNewCard} disabled={isPlaying}>
                <RefreshCw className='h-4 w-4 mr-2' />
                Nova Cartela
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cartela */}
          <div className='grid grid-cols-5 gap-2 mb-6'>
            {currentCard.map((col, i) =>
              col.map((number, j) => (
                <div
                  key={`${i}-${j}`}
                  onClick={() => checkNumber(number)}
                  className={`
                    aspect-square flex items-center justify-center
                    text-lg font-bold rounded-lg cursor-pointer
                    transition-colors duration-200
                    ${
                      markedNumbers.has(number)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  {number}
                </div>
              ))
            )}
          </div>

          {/* Números Sorteados */}
          <div className='mb-6'>
            <h3 className='text-sm font-medium mb-2'>Últimos Números:</h3>
            <div className='flex flex-wrap gap-2'>
              {bingoNumbers.slice(-10).map((num, i) => (
                <span
                  key={i}
                  className='inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded'
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Status do Jogo */}
          {gameStatus === 'won' && (
            <Alert className='bg-green-50 border-green-500'>
              <Trophy className='h-4 w-4 text-green-500' />
              <AlertDescription className='text-green-700'>BINGO! Você venceu!</AlertDescription>
            </Alert>
          )}

          {/* Métricas */}
          {metrics && (
            <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
              <h3 className='text-sm font-medium mb-2'>Métricas da Stream:</h3>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <span className='text-sm text-gray-500'>Visualizações</span>
                  <p className='text-lg font-bold'>{metrics.viewCount}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Likes</span>
                  <p className='text-lg font-bold'>{metrics.likeCount}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Comentários</span>
                  <p className='text-lg font-bold'>{metrics.commentCount}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameCore;

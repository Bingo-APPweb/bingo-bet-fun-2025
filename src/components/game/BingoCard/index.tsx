import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Star } from 'lucide-react';

interface BingoCardProps {
  numbers?: number[][];
  markedNumbers?: number[];
  currentNumber?: number | null;
  onNumberClick?: (number: number) => void;
  disabled?: boolean;
  won?: boolean;
}

// Default 5x5 bingo card with sequential numbers
const DEFAULT_NUMBERS = Array(5)
  .fill(null)
  .map((_, i) =>
    Array(5)
      .fill(null)
      .map((_, j) => i * 5 + j + 1)
  );

export default function BingoCard({
  numbers = DEFAULT_NUMBERS,
  markedNumbers = [],
  currentNumber = null,
  onNumberClick,
  disabled = false,
  won = false,
}: BingoCardProps) {
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    console.error('Invalid numbers array provided to BingoCard');
    return (
      <Card className='w-full max-w-xl mx-auto'>
        <CardContent className='p-6'>
          <div className='text-center text-red-500'>Error: Invalid bingo card data</div>
        </CardContent>
      </Card>
    );
  }

  const handleNumberClick = (number: number) => {
    if (!disabled && onNumberClick) {
      onNumberClick(number);
    }
  };

  return (
    <Card className='w-full max-w-xl mx-auto'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className='text-2xl font-bold'>Bingo Card</CardTitle>
        {won && (
          <div className='flex items-center gap-2 text-yellow-500'>
            <Trophy className='h-5 w-5' />
            <span>Winner!</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-5 gap-2'>
          {numbers.map((row, rowIndex) =>
            row.map((number, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleNumberClick(number)}
                disabled={disabled}
                className={`
                  aspect-square p-4 text-lg font-bold rounded-lg
                  transition-all duration-300
                  ${
                    markedNumbers.includes(number)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }
                  ${currentNumber === number ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
                  ${disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
                  ${rowIndex === 2 && colIndex === 2 ? 'bg-blue-100' : ''}
                `}
              >
                {rowIndex === 2 && colIndex === 2 ? (
                  <Star className='h-6 w-6 mx-auto text-blue-500' />
                ) : (
                  number
                )}
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

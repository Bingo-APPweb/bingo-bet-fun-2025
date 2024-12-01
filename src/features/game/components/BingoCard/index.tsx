import React from 'react';
import { Card } from '@/components/ui/card';

function BingoCard({ onNumberClick }) {
  // Create a default 5x5 bingo card layout
  const generateBingoNumbers = () => {
    const card = [];
    const usedNumbers = new Set();

    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        // Calculate number range for each column
        const min = j * 15 + 1;
        const max = min + 14;
        let number;

        // Generate unique number for each cell
        do {
          number = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(number));

        usedNumbers.add(number);
        row.push(number);
      }
      card.push(row);
    }

    return card;
  };

  const [numbers] = React.useState(generateBingoNumbers);
  const [markedNumbers, setMarkedNumbers] = React.useState(new Set());

  const handleNumberClick = (number) => {
    setMarkedNumbers((prev) => {
      const newMarked = new Set(prev);
      if (newMarked.has(number)) {
        newMarked.delete(number);
      } else {
        newMarked.add(number);
      }
      return newMarked;
    });

    if (onNumberClick) {
      onNumberClick(number);
    }
  };

  return (
    <Card className='bingo-card'>
      <div className='bingo-grid'>
        {numbers.map((row, rowIndex) => (
          <div key={rowIndex} className='bingo-row'>
            {row.map((number, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`bingo-number ${markedNumbers.has(number) ? 'marked' : ''} ${
                  rowIndex === 2 && colIndex === 2 ? 'free-space' : ''
                }`}
                onClick={() => handleNumberClick(number)}
              >
                {rowIndex === 2 && colIndex === 2 ? 'FREE' : number}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default BingoCard;

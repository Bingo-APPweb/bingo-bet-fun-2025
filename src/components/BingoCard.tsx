// src/components/BingoCard.tsx
import React, { useState } from 'react';
import { Player } from '../types/game';

interface BingoCardProps {
  player: Player;
  onMarkNumber: (row: number, col: number) => void;
  autoMark: boolean;
}

export const BingoCard: React.FC<BingoCardProps> = ({ player, onMarkNumber, autoMark }) => {
  return (
    <div className='bingo-card'>
      {player.card.map((row, rowIndex) => (
        <div key={rowIndex} className='row'>
          {row.map((number, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={player.marks[rowIndex][colIndex] ? 'marked' : ''}
              onClick={() => onMarkNumber(rowIndex, colIndex)}
              disabled={autoMark}
            >
              {number}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

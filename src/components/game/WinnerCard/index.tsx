/ WinnerCard/deinx.tsx;
import React from 'react';
import { WinnerCardProps } from './types';
import './styles.css';

const WinnerCard: React.FC<WinnerCardProps> = ({ winner, prize, onClose }) => {
  return (
    <div className='winner-card'>
      <div className='winner-content'>
        <h1>🎉 Vencedor! 🎉</h1>
        <div className='winner-info'>
          <h2>{winner.name}</h2>
          <p>Pontuação: {winner.score}</p>
          <p>Tempo de Jogo: {winner.gameTime} minutos</p>
          <p className='prize'>Prêmio: R$ {prize.toFixed(2)}</p>
        </div>
        <button className='close-button' onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default WinnerCard;

// GameStats/index.tsx
import React from 'react';
import { GameStatsProps } from './types';
import './styles.css';

const GameStats: React.FC<GameStatsProps> = ({
  currentPlayers,
  totalGames,
  averageGameTime,
  totalPrizePool,
}) => {
  return (
    <div className='game-stats'>
      <h2>Estatísticas do Jogo</h2>
      <div className='stats-grid'>
        <div className='stat-item'>
          <label>Jogadores Ativos:</label>
          <span>{currentPlayers}</span>
        </div>
        <div className='stat-item'>
          <label>Total de Jogos:</label>
          <span>{totalGames}</span>
        </div>
        <div className='stat-item'>
          <label>Tempo Médio de Jogo:</label>
          <span>{averageGameTime} min</span>
        </div>
        <div className='stat-item'>
          <label>Prêmios Distribuídos:</label>
          <span>R$ {totalPrizePool.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;

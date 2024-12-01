// src/features/game/BingoGame.tsx
import React from 'react';
import { useGame } from './GameProvider';
import { StreamIntegrationManager } from '@/components/StreamIntegrationManager';
import LiveStreamPlayer from '@/components/LiveStreamPlayer';
import GameCore from './GameCore';

const BingoGame = () => {
  const { metrics, bingoNumbers, gameState, isValidated } = useGame();

  return (
    <div className='container mx-auto p-4'>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream ao vivo */}
        <LiveStreamPlayer />
        
        {/* Jogo */}
        <GameCore />

        {/* Componente de integração com stream */}
        <StreamIntegrationManager
          metrics={metrics}
          bingoNumbers={bingoNumbers}
          validated={isValidated}
        />

        {/* Resto dos componentes do jogo */}
      </div>
    </div>
  );
};

export default BingoGame;
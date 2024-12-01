// GameSettings/index.tsx
import React, { useState } from 'react';
import { GameSettingsProps, GameSettings } from './types';
import './styles.css';

const GameSettings: React.FC<GameSettingsProps> = ({
  maxPlayers,
  timeLimit,
  prizePool,
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<GameSettings>({
    maxPlayers,
    timeLimit,
    prizePool,
  });

  const handleChange = (key: keyof GameSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className='game-settings'>
      <h2>Configurações do Jogo</h2>
      <div className='settings-form'>
        <div className='setting-item'>
          <label>Número Máximo de Jogadores:</label>
          <input
            type='number'
            value={settings.maxPlayers}
            onChange={(e) => handleChange('maxPlayers', parseInt(e.target.value))}
          />
        </div>
        <div className='setting-item'>
          <label>Tempo Limite (minutos):</label>
          <input
            type='number'
            value={settings.timeLimit}
            onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
          />
        </div>
        <div className='setting-item'>
          <label>Prêmio Total:</label>
          <input
            type='number'
            value={settings.prizePool}
            onChange={(e) => handleChange('prizePool', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default GameSettings;

// src/components/ui/streaming-room/StreamingRoom.tsx
import { useState } from 'react';
import { ClaudeAssistant } from '@/features/ai/components/ClaudeAssistant';
import { useClaudeAssistant } from '@/features/ai/hooks/useClaudeAssistant';
import { GameState } from '@/features/ai/types/claude.types';

export const StreamingRoom = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'active',
    currentNumbers: [],
    players: [],
    pattern: 'fullhouse'
  });

  const { getAssistance, isLoading } = useClaudeAssistant(gameState);

  const handleGameEvent = async (event: string) => {
    try {
      const assistance = await getAssistance(event);
      // Handle Claude's response
      switch (assistance.type) {
        case 'tip':
          // Show game tip
          break;
        case 'pattern':
          // Handle pattern suggestion
          break;
        case 'help':
          // Show help message
          break;
      }
    } catch (error) {
      console.error('Error getting Claude assistance:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Existing StreamingRoom content */}
      
      {/* Claude Integration */}
      <ClaudeAssistant
        gameState={gameState}
        onGameEvent={handleGameEvent}
        isLoading={isLoading}
      />
    </div>
  );
};
// src/features/ai/hooks/useClaudeAssistant.ts
import { useState, useCallback } from 'react';
import { ClaudeService } from '../services/claude.service';
import { ClaudeResponse, GameState } from '../types/claude.types';

export const useClaudeAssistant = (gameState: GameState) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const claudeService = new ClaudeService();

  const getAssistance = useCallback(async (event: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await claudeService.processGameEvent(event, gameState);
    } catch (err) {
      setError('Error getting assistance from Claude');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [gameState]);

  return { getAssistance, isLoading, error };
};
// src/lib/firebase/services/claude.service.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config';
import { Timestamp } from 'firebase/firestore';

export class ClaudeGameService {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async processGameEvent(gameId: string, event: GameEvent): Promise<AIResponse> {
    const gameRef = doc(db, 'games', gameId);
    const playerRef = collection(db, 'games', gameId, 'players');

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: this.formatEventPrompt(event),
          },
        ],
      });

      await updateDoc(gameRef, {
        lastAIResponse: response.content[0].text,
        lastUpdate: new Date(),
      });

      return {
        message: response.content[0].text,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Claude processing error:', error);
      throw error;
    }
  }

  private formatEventPrompt(event: GameEvent): string {
    return `
      Game Event: ${event.type}
      Player: ${event.playerId}
      Context: ${event.context}
      Interaction Count: ${event.interactionCount}
      
      Generate an engaging response for this bingo game event.
    `;
  }
}

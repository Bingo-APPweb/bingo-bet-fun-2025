import { useState, useEffect } from 'react';
import { ChatService } from '@/services/chat/ChatService';

export type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  type: 'chat' | 'system';
  timestamp: number;
  reactions?: Record<string, string[]>;
};

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Instancia única do ChatService
  const chatService = useState(() => new ChatService())[0];

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeChat = async () => {
      try {
        setLoading(true);
        unsubscribe = await chatService.joinRoom(roomId, (newMessages) => {
          setMessages(newMessages);
          setLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize chat'));
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      unsubscribe?.();
    };
  }, [roomId]);

  const sendMessage = async (text: string, userId: string, userName: string) => {
    try {
      await chatService.sendMessage(roomId, userId, userName, text);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    }
  };

  const addReaction = async (messageId: string, userId: string, reaction: string) => {
    try {
      await chatService.addReaction(roomId, messageId, userId, reaction);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add reaction'));
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    addReaction
  };
}
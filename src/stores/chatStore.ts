// src/stores/chatStore.ts
import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

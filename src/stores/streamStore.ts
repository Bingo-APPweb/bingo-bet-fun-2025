// src/stores/streamStore.ts
import { create } from 'zustand';

interface StreamStore {
  isStreaming: boolean;
  viewers: number;
  streamUrl: string | null;
  setStreaming: (streaming: boolean) => void;
  setViewers: (count: number) => void;
  setStreamUrl: (url: string | null) => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  isStreaming: false,
  viewers: 0,
  streamUrl: null,
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setViewers: (count) => set({ viewers: count }),
  setStreamUrl: (url) => set({ streamUrl: url }),
}));

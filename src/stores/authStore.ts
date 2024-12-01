import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  actions: {
    setUser: (user: User | null) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  actions: {
    setUser: (user) => set({ user, loading: false }),
    setError: (error) => set({ error, loading: false }),
    setLoading: (loading) => set({ loading }),
  },
}));

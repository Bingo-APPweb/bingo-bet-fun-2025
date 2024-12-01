// src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

// Configuração do React Query para testes
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

// Mock do Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  set: vi.fn(),
  onValue: vi.fn(),
  get: vi.fn(),
  push: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
}));

// Mock do Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

// Mock da configuração do Firebase
vi.mock('@/config/firebase', () => ({
  app: {},
  database: {},
  firestore: {},
  DB_REFS: {
    games: 'games',
    users: 'users',
    metrics: 'metrics',
    chat: 'chat',
    rewards: 'rewards',
  },
  BINGO_CARD_CONSTRAINTS: {
    dimensions: {
      rows: 5,
      cols: 5,
    },
    columnRanges: {
      min: [1, 16, 31, 46, 61],
      max: [15, 30, 45, 60, 75],
    },
  },
}));

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do crypto.randomUUID
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// Mock do IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Helpers para testes
export const mockConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

// Limpeza global após cada teste
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

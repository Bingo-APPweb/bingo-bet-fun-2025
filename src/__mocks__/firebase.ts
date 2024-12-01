// src/__mocks__/firebase.ts
export const mockFirebaseConfig = {
  apiKey: 'mock-api-key',
  authDomain: 'mock-auth-domain',
  projectId: 'mock-project-id',
  storageBucket: 'mock-storage-bucket',
  messagingSenderId: 'mock-sender-id',
  appId: 'mock-app-id',
  databaseURL: 'mock-database-url',
};

export const database = {
  ref: jest.fn(),
  set: jest.fn(),
  onValue: jest.fn(),
  get: jest.fn(),
};

export const app = {
  database: () => database,
};

export const getDatabase = jest.fn(() => database);
export const ref = jest.fn();
export const set = jest.fn();
export const onValue = jest.fn();
export const get = jest.fn();

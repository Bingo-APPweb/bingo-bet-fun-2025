// src/config/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';

// Environment type definitions
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL: string;
}

// Enhanced environment configuration
const firebaseConfig: Record<string, FirebaseConfig> = {
  development: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  },
  staging: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: 'bingoapp-8ee2e-staging',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: 'https://bingoapp-8ee2e-staging-default-rtdb.firebaseio.com',
  },
  production: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: 'bingoapp-8ee2e',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: 'https://bingoapp-8ee2e-default-rtdb.firebaseio.com',
  },
} as const;

// Enhanced database references with type safety
export const DB_REFS = {
  games: 'games',
  bingo_cards: 'bingo_cards',
  chat_messages: 'chat_messages',
  drawn_numbers: 'drawn_numbers',
  game_settings: 'game_settings',
  stream_metrics: 'stream_metrics',
  stream_integrations: 'stream_integrations',
  users: 'users',
  indexes: {
    games_status: 'idx_games_status',
    games_room_code: 'idx_games_room_code',
    bingo_cards_game: 'idx_bingo_cards_game',
    bingo_cards_player: 'idx_bingo_cards_player',
    drawn_numbers_game: 'idx_drawn_numbers_game',
    chat_game: 'idx_chat_game',
    chat_user: 'idx_chat_user',
    stream_metrics_stream: 'idx_stream_metrics_stream',
  },
  firestoreCollections: {
    users: 'users',
    gameHistory: 'gameHistory',
    achievements: 'achievements',
  },
} as const;

// Enhanced bingo card constraints
export const BINGO_CARD_CONSTRAINTS = {
  dimensions: {
    rows: 5,
    cols: 5,
  },
  columnRanges: {
    min: [1, 16, 31, 46, 61] as const,
    max: [15, 30, 45, 60, 75] as const,
  },
  centerFree: true,
  minNumbers: 24,
  maxNumbers: 25,
} as const;

// Type definitions
export type Environment = keyof typeof firebaseConfig;
export type DbRefs = typeof DB_REFS;
export type FirestoreCollections = typeof DB_REFS.firestoreCollections;
export type BingoCardConstraints = typeof BINGO_CARD_CONSTRAINTS;

// Firebase instance holders
interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  database: Database;
  functions: Functions;
}

class FirebaseService {
  private static instance: FirebaseService;
  private instances: FirebaseInstances;
  private currentEnv: Environment;

  private constructor() {
    this.currentEnv = (import.meta.env.MODE || 'development') as Environment;
    const config = firebaseConfig[this.currentEnv];

    this.instances = {
      app: initializeApp(config),
      auth: getAuth(),
      firestore: getFirestore(),
      database: getDatabase(),
      functions: getFunctions(),
    };

    this.setupEmulators();
  }

  private setupEmulators(): void {
    if (this.isDevelopment()) {
      connectFirestoreEmulator(this.instances.firestore, 'localhost', 8080);
      connectAuthEmulator(this.instances.auth, 'http://localhost:9099');
      connectFunctionsEmulator(this.instances.functions, 'localhost', 5001);
    }
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getInstances(): FirebaseInstances {
    return this.instances;
  }

  public isProduction = (): boolean => this.currentEnv === 'production';
  public isStaging = (): boolean => this.currentEnv === 'staging';
  public isDevelopment = (): boolean => this.currentEnv === 'development';

  public getCollectionRef<T>(collection: keyof FirestoreCollections): CollectionReference<T> {
    return this.instances.firestore.collection(
      DB_REFS.firestoreCollections[collection]
    ) as CollectionReference<T>;
  }

  public getDocRef<T>(collection: keyof FirestoreCollections, docId: string): DocumentReference<T> {
    return this.instances.firestore.doc(
      `${DB_REFS.firestoreCollections[collection]}/${docId}`
    ) as DocumentReference<T>;
  }
}

// Export singleton instance
const firebaseService = FirebaseService.getInstance();
export const { app, auth, firestore, database, functions } = firebaseService.getInstances();

// Environment helpers
export const isProduction = firebaseService.isProduction;
export const isStaging = firebaseService.isStaging;
export const isDevelopment = firebaseService.isDevelopment;

export default firebaseService;

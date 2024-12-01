// src/lib/firebase/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { Timestamp } from 'firebase/firestore';

const getFirebaseConfig = () => {
  const env = import.meta.env;
  const currentEnv = env.MODE || 'development';

  const configs = {
    development: {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    },
    staging: {
      // ... config staging
    },
    production: {
      // ... config production
    },
  } as const;

  return configs[currentEnv as keyof typeof configs];
};

const app = initializeApp(getFirebaseConfig());
export const db = getFirestore(app);
export const database = getDatabase(app);
export { Timestamp };

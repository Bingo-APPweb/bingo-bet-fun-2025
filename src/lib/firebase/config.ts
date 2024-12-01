// src/lib/firebase/config.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, CollectionReference } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { BingoGame, UserProfile, GameMetrics, Achievement } from '@/types/game';

// Custom error classes
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class InitializationError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'InitializationError';
  }
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_DATABASE_URL',
] as const;

// Validate environment variables
const validateEnvVars = () => {
  const missingVars = REQUIRED_ENV_VARS.filter((varName) => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    throw new ConfigurationError(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Secrets management service interface
interface SecretsManager {
  getSecret(key: string): Promise<string>;
  rotateSecret?(key: string): Promise<void>;
}

// Basic secrets manager implementation
class EnvironmentSecretsManager implements SecretsManager {
  async getSecret(key: string): Promise<string> {
    const value = import.meta.env[key];
    if (!value) {
      throw new ConfigurationError(`Secret ${key} not found`);
    }
    return value;
  }
}

// Production secrets manager (can be replaced with your preferred solution)
class ProductionSecretsManager implements SecretsManager {
  private cache = new Map<string, { value: string; timestamp: number }>();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  async getSecret(key: string): Promise<string> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }

    try {
      // Replace this with your preferred secrets management solution
      // Example: AWS Secrets Manager, HashiCorp Vault, etc.
      const value = await this.fetchSecretFromSecureStorage(key);
      this.cache.set(key, { value, timestamp: Date.now() });
      return value;
    } catch (error) {
      throw new ConfigurationError(`Failed to fetch secret ${key}: ${error.message}`);
    }
  }

  private async fetchSecretFromSecureStorage(key: string): Promise<string> {
    // Implement your secure secrets fetching logic here
    // This is just a placeholder that falls back to environment variables
    return import.meta.env[key];
  }

  async rotateSecret(key: string): Promise<void> {
    // Implement secret rotation logic
    this.cache.delete(key);
  }
}

// Firebase configuration with error handling and validation
const getFirebaseConfig = async (secretsManager: SecretsManager) => {
  try {
    validateEnvVars();

    const projectId = await secretsManager.getSecret('VITE_FIREBASE_PROJECT_ID');
    const environment = (import.meta.env.MODE || 'development') as EnvType;
    const envProjectId = environment === 'production' ? projectId : `${projectId}-${environment}`;

    return {
      apiKey: await secretsManager.getSecret('VITE_FIREBASE_API_KEY'),
      authDomain: `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: await secretsManager.getSecret('VITE_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: await secretsManager.getSecret('VITE_FIREBASE_MESSAGING_SENDER_ID'),
      appId: await secretsManager.getSecret('VITE_FIREBASE_APP_ID'),
      databaseURL: `https://${envProjectId}.firebaseio.com`,
      measurementId: await secretsManager.getSecret('VITE_FIREBASE_MEASUREMENT_ID'),
    };
  } catch (error) {
    throw new ConfigurationError(`Failed to load Firebase configuration: ${error.message}`);
  }
};

// Enhanced initialization with retry logic
const initializeFirebaseContext = async (
  retryAttempts = 3,
  retryDelay = 1000
): Promise<EnhancedFirebaseContext> => {
  const secretsManager = isProduction()
    ? new ProductionSecretsManager()
    : new EnvironmentSecretsManager();

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      const config = await getFirebaseConfig(secretsManager);

      // Initialize core Firebase services
      const app = initializeApp(config);
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      const database = getDatabase(app);

      // Initialize Analytics with error handling
      const analytics = await isSupported()
        .then((yes) => (yes ? getAnalytics(app) : null))
        .catch((error) => {
          console.warn('Analytics initialization failed:', error);
          return null;
        });

      // Initialize typed collections with error handling
      const collections = initializeCollections(firestore);

      return {
        app,
        auth,
        firestore,
        database,
        analytics,
        collections,
        environment: import.meta.env.MODE as EnvType,
        secretsManager,
      };
    } catch (error) {
      lastError = error;
      if (attempt < retryAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }
    }
  }

  throw new InitializationError('Failed to initialize Firebase after multiple attempts', lastError);
};

// Health check function
export const checkFirebaseHealth = async (context: EnhancedFirebaseContext) => {
  try {
    // Test Firestore connection
    await context.firestore.collection('health').doc('ping').set({
      timestamp: new Date().toISOString(),
    });

    // Test Realtime Database connection
    const dbRef = context.database.ref('.info/connected');
    await new Promise((resolve, reject) => {
      dbRef.on(
        'value',
        (snapshot) => {
          dbRef.off();
          if (snapshot.val() === true) {
            resolve(true);
          } else {
            reject(new Error('Database not connected'));
          }
        },
        (error) => reject(error)
      );
    });

    return { status: 'healthy' };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
};

// Initialize and export Firebase context with error handling
let firebaseContext: EnhancedFirebaseContext;

try {
  firebaseContext = await initializeFirebaseContext();
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // Implement your error reporting logic here
  throw error;
}

// AI configuration
export const aiConfig = {
  modelVersion: import.meta.env.VITE_CLAUDE_MODEL,
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  maxTokens: 150,
  temperature: 0.7,
  responseTimeout: 10000,
};
export { firebaseContext };

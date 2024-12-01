import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

class ConfigService {
  private static instance: ConfigService;
  private readonly youtubeConfig: typeof YOUTUBE_CONFIG;
  private readonly firebaseConfig: typeof FIREBASE_CONFIG;
  
  private constructor() {
    // Validar variáveis de ambiente críticas
    const requiredEnvVars = [
      'VITE_YOUTUBE_API_KEY',
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_DATABASE_URL'
    ];

    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    });

    // Inicializar configurações
    this.youtubeConfig = {
      apiKey: process.env.VITE_YOUTUBE_API_KEY!,
      allowedChannels: process.env.VITE_ALLOWED_CHANNELS?.split(',') || [],
      defaultChannel: process.env.VITE_DEFAULT_CHANNEL
    };

    this.firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    // Inicializar Firebase
    const app = initializeApp(this.firebaseConfig);
    getDatabase(app); // Inicializar Realtime Database
    getAuth(app); // Inicializar Authentication
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  getYoutubeConfig() {
    return this.youtubeConfig;
  }

  getFirebaseConfig() {
    return this.firebaseConfig;
  }

  validateChannel(channelUrl: string): boolean {
    if (!channelUrl) return false;
    
    // Verificar se o canal está na lista de permitidos
    if (this.youtubeConfig.allowedChannels.length > 0) {
      return this.youtubeConfig.allowedChannels.some(channel => 
        channelUrl.includes(channel)
      );
    }
    
    return true;
  }

  // Métodos auxiliares para ambiente
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

export const configService = ConfigService.getInstance();
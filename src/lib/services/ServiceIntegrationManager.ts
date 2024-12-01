import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

interface ServiceConfig {
  youtube: {
    apiKey: string;
    allowedChannels: string[];
    defaultChannel: string;
  };
  anthropic: {
    apiKey: string;
  };
  firebase: {
    databaseURL: string;
    projectId: string;
    apiKey: string;
  };
}

class ServiceIntegrationManager {
  private static instance: ServiceIntegrationManager;
  private db;
  private config: ServiceConfig;

  private constructor(config: ServiceConfig) {
    this.config = config;

    // Inicializa Firebase
    const firebaseApp = initializeApp({
      apiKey: config.firebase.apiKey,
      projectId: config.firebase.projectId,
      databaseURL: config.firebase.databaseURL,
    });

    this.db = getDatabase(firebaseApp);
  }

  static getInstance(config: ServiceConfig): ServiceIntegrationManager {
    if (!ServiceIntegrationManager.instance) {
      ServiceIntegrationManager.instance = new ServiceIntegrationManager(config);
    }
    return ServiceIntegrationManager.instance;
  }

  // Gerencia métricas do YouTube
  async getYouTubeMetrics(channelId: string) {
    try {
      if (!this.config.youtube.allowedChannels.includes(channelId)) {
        throw new Error('Canal não autorizado');
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.config.youtube.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar métricas do YouTube');
      }

      const data = await response.json();

      // Salva métricas no Firebase
      await set(ref(this.db, `metrics/youtube/${channelId}`), {
        ...data.items[0].statistics,
        timestamp: Date.now(),
      });

      return data.items[0].statistics;
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      throw error;
    }
  }

  // Monitora mudanças nas métricas
  onMetricsUpdate(callback: (metrics: any) => void) {
    const metricsRef = ref(this.db, 'metrics/youtube');
    onValue(metricsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  // Processa métricas para números do bingo
  processMetricsForBingo(metrics: any): number[] {
    const numbers = new Set<number>();

    // Gera números baseados nas métricas
    if (metrics.viewCount) {
      numbers.add(Math.floor((metrics.viewCount % 75) + 1));
    }
    if (metrics.likeCount) {
      numbers.add(Math.floor((metrics.likeCount % 75) + 1));
    }
    if (metrics.commentCount) {
      numbers.add(Math.floor((metrics.commentCount % 75) + 1));
    }

    return Array.from(numbers).sort((a, b) => a - b);
  }

  // Integração com Anthropic para validação
  async validateGameState(gameState: any) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.anthropic.apiKey}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Validate this bingo game state and check for any irregularities: ${JSON.stringify(gameState)}`,
            },
          ],
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na validação Anthropic:', error);
      throw error;
    }
  }
}

export const initializeServices = () => {
  const config: ServiceConfig = {
    youtube: {
      apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
      allowedChannels: import.meta.env.VITE_ALLOWED_CHANNELS?.split(',') || [],
      defaultChannel: import.meta.env.VITE_DEFAULT_CHANNEL,
    },
    anthropic: {
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    },
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    },
  };

  return ServiceIntegrationManager.getInstance(config);
};

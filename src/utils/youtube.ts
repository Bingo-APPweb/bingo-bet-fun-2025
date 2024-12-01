// src/utils/youtube.ts

interface YouTubeConfig {
  channels: Record<string, string>;
  streams: Record<string, string>;
  urls: Record<string, string>;
}

export class YouTubeUtils {
  private static config: YouTubeConfig = {
    channels: {},
    streams: {},
    urls: {},
  };

  static initialize() {
    try {
      // Parse canais
      const channelsEnv = import.meta.env.VITE_YOUTUBE_CHANNELS;
      this.config.channels = channelsEnv ? JSON.parse(channelsEnv) : {};

      // Parse streams
      const streamsEnv = import.meta.env.VITE_YOUTUBE_STREAMS;
      this.config.streams = streamsEnv ? JSON.parse(streamsEnv) : {};

      // Parse URLs
      const urlsEnv = import.meta.env.VITE_YOUTUBE_URLS;
      this.config.urls = urlsEnv ? JSON.parse(urlsEnv) : {};
    } catch (error) {
      console.error('Erro ao inicializar configuração do YouTube:', error);
    }
  }

  static async getChannelId(channelNameOrUrl: string): Promise<string | null> {
    // Tentar encontrar por nome configurado
    if (this.config.channels[channelNameOrUrl]) {
      return this.config.channels[channelNameOrUrl];
    }

    // Tentar extrair ID do canal da URL
    if (channelNameOrUrl.includes('youtube.com')) {
      const url = new URL(channelNameOrUrl);
      const paths = url.pathname.split('/');

      // Handle diferentes formatos de URL
      if (paths.includes('@')) {
        const username = paths[paths.indexOf('@') + 1];
        return await this.fetchChannelIdFromUsername(username);
      }

      if (paths.includes('channel')) {
        return paths[paths.indexOf('channel') + 1];
      }
    }

    return null;
  }

  static async fetchChannelIdFromUsername(username: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?` +
          `part=id&forUsername=${username}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );

      if (!response.ok) throw new Error('Falha ao buscar ID do canal');

      const data = await response.json();
      return data.items?.[0]?.id || null;
    } catch (error) {
      console.error('Erro ao buscar ID do canal:', error);
      return null;
    }
  }

  static async getLiveStreamId(channelId: string): Promise<string | null> {
    try {
      // Verificar se é um ID de stream direto
      if (this.config.streams[channelId]) {
        return this.config.streams[channelId];
      }

      // Buscar streams ao vivo do canal
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          `part=id&channelId=${channelId}&eventType=live&type=video&` +
          `key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );

      if (!response.ok) throw new Error('Falha ao buscar stream ao vivo');

      const data = await response.json();
      return data.items?.[0]?.id?.videoId || null;
    } catch (error) {
      console.error('Erro ao buscar stream ao vivo:', error);
      return null;
    }
  }

  // Validar se canal/stream está permitido
  static isAllowed(channelOrStreamId: string): boolean {
    return (
      Object.values(this.config.channels).includes(channelOrStreamId) ||
      Object.values(this.config.streams).includes(channelOrStreamId)
    );
  }
}

// Inicializar ao importar
YouTubeUtils.initialize();

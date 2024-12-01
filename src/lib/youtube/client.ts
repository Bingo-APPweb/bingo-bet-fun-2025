import { config } from './config';

class YouTubeClient {
  private apiKey: string;

  constructor() {
    this.apiKey = config.apiKey;
  }

  async getLiveChat(videoId: string) {
    try {
      // Implementação básica para buscar chat ao vivo
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/liveChat/messages?key=${this.apiKey}&liveChatId=${videoId}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching live chat:', error);
      throw error;
    }
  }
}

export const youtubeClient = new YouTubeClient();
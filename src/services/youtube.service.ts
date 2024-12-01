// src/services/youtube.service.ts
import { PROXY_CONFIG } from '../config/proxy.config';

export class YouTubeService {
  private static readonly BASE_URL = '/youtube-api';

  static async fetchLiveStream(channelId: string, apiKey: string) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`,
        {
          headers: PROXY_CONFIG.youtube.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live stream:', error);
      throw error;
    }
  }
}

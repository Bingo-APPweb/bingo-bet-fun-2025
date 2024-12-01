// src/services/integration/TwitchService.ts
export class TwitchService extends BaseIntegrationService {
    protected getPlatformName(): string {
      return 'twitch';
    }
  
    async startStream(streamData: Partial<StreamData>): Promise<StreamData> {
      return this.makeRequest('/helix/streams/start', {
        method: 'POST',
        body: JSON.stringify(streamData)
      });
    }
  
    async getStreamStats(streamId: string): Promise<StreamData> {
      return this.makeRequest(`/helix/streams/${streamId}`);
    }
  
    async updateStreamInfo(streamId: string, title: string): Promise<void> {
      await this.makeRequest(`/helix/channels`, {
        method: 'PATCH',
        body: JSON.stringify({ title })
      });
    }
  }
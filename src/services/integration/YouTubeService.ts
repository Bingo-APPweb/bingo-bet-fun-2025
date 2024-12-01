// src/services/integration/YouTubeService.ts
export class YouTubeService extends BaseIntegrationService {
  protected getPlatformName(): string {
    return 'youtube';
  }

  async startStream(streamData: Partial<StreamData>): Promise<StreamData> {
    return this.makeRequest('/streams/start', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async endStream(streamId: string): Promise<void> {
    await this.makeRequest(`/streams/${streamId}/end`, {
      method: 'POST',
    });
  }

  async getStreamStats(streamId: string): Promise<StreamData> {
    return this.makeRequest(`/streams/${streamId}/stats`);
  }
}

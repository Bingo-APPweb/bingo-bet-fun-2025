// src/services/integration/FacebookService.ts
export class FacebookService extends BaseIntegrationService {
  protected getPlatformName(): string {
    return 'facebook';
  }

  async startStream(streamData: Partial<StreamData>): Promise<StreamData> {
    return this.makeRequest('/live_videos', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async endStream(streamId: string): Promise<void> {
    await this.makeRequest(`/live_videos/${streamId}`, {
      method: 'POST',
      body: JSON.stringify({ end_live_video: true }),
    });
  }

  async getStreamStats(streamId: string): Promise<StreamData> {
    return this.makeRequest(`/live_videos/${streamId}`);
  }
}

// src/services/integration/StreamingManager.ts
export class StreamingManager {
  private services: Map<string, BaseIntegrationService> = new Map();

  constructor(
    youtubeConfig?: IntegrationConfig,
    twitchConfig?: IntegrationConfig,
    facebookConfig?: IntegrationConfig
  ) {
    if (youtubeConfig) {
      this.services.set('youtube', new YouTubeService(youtubeConfig));
    }
    if (twitchConfig) {
      this.services.set('twitch', new TwitchService(twitchConfig));
    }
    if (facebookConfig) {
      this.services.set('facebook', new FacebookService(facebookConfig));
    }
  }

  async startMultiPlatformStream(streamData: Partial<StreamData>): Promise<StreamData[]> {
    const streams: Promise<StreamData>[] = [];

    for (const service of this.services.values()) {
      streams.push(service.startStream(streamData));
    }

    return Promise.all(streams);
  }
}

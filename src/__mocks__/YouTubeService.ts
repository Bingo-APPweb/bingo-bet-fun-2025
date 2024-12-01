export class MockYouTubeService {
    private mockStreams = [
      {
        id: { videoId: 'stream-1' },
        snippet: {
          title: 'Test Stream 1',
          description: 'This is a test live stream',
          channelId: 'channel-1',
          publishedAt: new Date().toISOString()
        }
      },
      {
        id: { videoId: 'stream-2' },
        snippet: {
          title: 'Test Stream 2',
          description: 'Another test live stream',
          channelId: 'channel-1',
          publishedAt: new Date().toISOString()
        }
      }
    ];
  
    private mockChannel = {
      id: 'channel-1',
      snippet: {
        title: 'Test Channel',
        description: 'A test channel for BingoBetFun',
        customUrl: '@testchannel'
      }
    };
  
    private mockMetrics = {
      viewCount: 1000,
      likeCount: 500,
      commentCount: 100,
      chatMessages: ['Hello!', 'Great stream!'],
      timestamp: new Date()
    };
  
    async getChannel(channelId: string) {
      if (channelId === 'invalid-channel') {
        throw new Error('Channel not found');
      }
      return this.mockChannel;
    }
  
    async getLiveStreams(channelId: string) {
      if (channelId === 'no-streams') {
        return [];
      }
      return this.mockStreams;
    }
  
    async getStreamMetrics(streamId: string) {
      if (streamId === 'invalid-stream') {
        throw new Error('Stream not found');
      }
      return this.mockMetrics;
    }
  
    setMockMetrics(metrics: typeof this.mockMetrics) {
      this.mockMetrics = metrics;
    }
  
    resetMocks() {
      this.mockMetrics = {
        viewCount: 1000,
        likeCount: 500,
        commentCount: 100,
        chatMessages: ['Hello!', 'Great stream!'],
        timestamp: new Date()
      };
    }
  }
  
  // Mock do hook useYouTubeStream
  export const mockUseYouTubeStream = {
    __esModule: true,
    default: jest.fn()
  };
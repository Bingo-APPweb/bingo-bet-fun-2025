import { rest } from 'msw';

export const handlers = [
  // Mock da API do YouTube para canais
  rest.get('https://youtube.googleapis.com/youtube/v3/channels', (req, res, ctx) => {
    const channelId = req.url.searchParams.get('id');
    
    if (channelId === 'invalid-channel') {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Channel not found',
            code: 404
          }
        })
      );
    }

    return res(
      ctx.json({
        items: [{
          id: channelId,
          snippet: {
            title: 'Test Channel',
            description: 'Test Channel Description'
          }
        }]
      })
    );
  }),

  // Mock da API do YouTube para streams ao vivo
  rest.get('https://youtube.googleapis.com/youtube/v3/search', (req, res, ctx) => {
    const channelId = req.url.searchParams.get('channelId');
    
    if (channelId === 'no-streams') {
      return res(
        ctx.json({
          items: []
        })
      );
    }

    return res(
      ctx.json({
        items: [
          {
            id: { videoId: 'test-stream-1' },
            snippet: {
              title: 'Test Live Stream',
              description: 'Test Stream Description',
              channelId,
              liveBroadcastContent: 'live'
            }
          }
        ]
      })
    );
  }),

  // Mock da API do YouTube para métricas
  rest.get('https://youtube.googleapis.com/youtube/v3/videos', (req, res, ctx) => {
    const videoId = req.url.searchParams.get('id');
    
    if (videoId === 'invalid-stream') {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Stream not found',
            code: 404
          }
        })
      );
    }

    return res(
      ctx.json({
        items: [{
          id: videoId,
          statistics: {
            viewCount: '1000',
            likeCount: '500',
            commentCount: '100'
          },
          liveStreamingDetails: {
            concurrentViewers: '1000',
            activeLiveChatId: 'chat-1'
          }
        }]
      })
    );
  })
];
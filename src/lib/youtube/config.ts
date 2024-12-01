export const config = {
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  };
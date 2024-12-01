// youtube.config.ts
export const YOUTUBE_CONFIG = {
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
  CHANNEL_ID: import.meta.env.VITE_CHANNEL_ID,
  CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
  REFRESH_INTERVAL: 30000,
};

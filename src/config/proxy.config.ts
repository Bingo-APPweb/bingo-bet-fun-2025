// src/config/proxy.config.ts
import { ProxyConfig } from '../types/proxy';

export const PROXY_CONFIG: ProxyConfig = {
  youtube: {
    target: 'https://www.googleapis.com/youtube/v3',
    changeOrigin: true,
    secure: true,
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    pathRewrite: {
      '^/youtube-api': '',
    },
    onProxyReq: (proxyReq: any) => {
      // Add any necessary authentication headers
      proxyReq.setHeader('User-Agent', 'BBF-YouTube-Integration');
    },
    onError: (err: Error, req: any, res: any) => {
      console.error('Proxy Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy Error: ' + err.message);
    },
  },
};

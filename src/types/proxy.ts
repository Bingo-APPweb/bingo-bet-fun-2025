// src/types/proxy.ts
export interface ProxyConfig {
    youtube: {
      target: string;
      changeOrigin: boolean;
      secure: boolean;
      headers: {
        [key: string]: string;
      };
      pathRewrite: {
        [key: string]: string;
      };
      onProxyReq: (proxyReq: any) => void;
      onError: (err: Error, req: any, res: any) => void;
    };
  }
// src/services/integration/BaseIntegrationService.ts
export abstract class BaseIntegrationService {
  protected config: IntegrationConfig;
  protected retryCount: number = 0;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (this.retryCount < this.config.retryAttempts) {
        this.retryCount++;
        return this.makeRequest(endpoint, options);
      }
      throw this.handleError(error);
    }
  }

  protected handleError(error: any): StreamError {
    const streamError: StreamError = {
      name: 'StreamError',
      message: error.message || 'An unknown error occurred',
      code: 'INTEGRATION_ERROR',
      platform: this.getPlatformName(),
      timestamp: new Date(),
    };

    console.error(`[${this.getPlatformName()}] Integration Error:`, streamError);
    return streamError;
  }

  protected abstract getPlatformName(): string;
}

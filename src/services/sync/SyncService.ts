// src/services/sync/SyncService.ts
interface SyncConfig {
  retryAttempts: number;
  retryDelay: number;
  batchSize: number;
  priority: 'high' | 'medium' | 'low';
}

class SyncService {
  private operationQueue: PriorityQueue<SyncOperation>;
  private isProcessing: boolean;
  private config: SyncConfig;
  private failedOperations: Map<string, number>;

  constructor(config: SyncConfig) {
    this.operationQueue = new PriorityQueue();
    this.isProcessing = false;
    this.config = config;
    this.failedOperations = new Map();
    this.startProcessing();
  }

  async queueOperation(operation: SyncOperation): Promise<void> {
    this.operationQueue.enqueue(operation, this.getPriority(operation));
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (!this.operationQueue.isEmpty()) {
      const batch = await this.getBatch();
      try {
        await this.processBatch(batch);
      } catch (error) {
        await this.handleError(error, batch);
      }
    }

    this.isProcessing = false;
  }

  private async processBatch(operations: SyncOperation[]): Promise<void> {
    const results = await Promise.allSettled(operations.map((op) => this.processOperation(op)));

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.handleFailedOperation(operations[index]);
      }
    });
  }

  private async handleFailedOperation(operation: SyncOperation): Promise<void> {
    const retryCount = (this.failedOperations.get(operation.id) || 0) + 1;

    if (retryCount < this.config.retryAttempts) {
      this.failedOperations.set(operation.id, retryCount);
      setTimeout(() => {
        this.queueOperation(operation);
      }, this.config.retryDelay * retryCount);
    } else {
      // Log permanente failure
      this.eventEmitter.emit('syncFailed', { operation, attempts: retryCount });
    }
  }
}

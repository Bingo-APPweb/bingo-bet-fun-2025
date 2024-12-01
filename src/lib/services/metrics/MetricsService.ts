// src/services/metrics/MetricsService.ts

import { EventEmitter } from 'events';
import { MetricEvent, MetricBuffer, PerformanceMetrics } from '../types/metrics';

export class MetricsService {
  private static instance: MetricsService;
  private eventEmitter: EventEmitter;
  private eventBuffer: MetricBuffer;
  private performanceMetrics: PerformanceMetrics;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventBuffer = {
      maxSize: 1000,
      flushInterval: 5000, // 5 segundos
      events: [],
    };
    this.performanceMetrics = {
      eventFrequency: new Map(),
      responseTime: new Map(),
      bufferUtilization: 0,
    };

    this.initializeBufferFlush();
  }

  static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  // Tratamento de Eventos com Error Handling
  async trackEvent(event: MetricEvent): Promise<void> {
    try {
      const startTime = performance.now();

      // Validação de evento
      this.validateEvent(event);

      // Buffering com threshold
      if (this.eventBuffer.events.length >= this.eventBuffer.maxSize) {
        await this.flushBuffer();
      }

      // Adiciona ao buffer com timestamp
      this.eventBuffer.events.push({
        ...event,
        timestamp: new Date(),
        processTime: performance.now() - startTime,
      });

      // Atualiza métricas de performance
      this.updatePerformanceMetrics(event.type, startTime);

      // Emite evento para subscribers
      this.eventEmitter.emit('metricUpdated', event);
    } catch (error) {
      this.handleError('trackEvent', error);
    }
  }

  // Implementação do Buffer Flush
  private async flushBuffer(): Promise<void> {
    try {
      if (this.eventBuffer.events.length === 0) return;

      const eventsToProcess = [...this.eventBuffer.events];
      this.eventBuffer.events = [];

      // Processamento em batch
      await this.processBatchEvents(eventsToProcess);

      // Atualiza métricas de utilização do buffer
      this.performanceMetrics.bufferUtilization =
        (this.eventBuffer.events.length / this.eventBuffer.maxSize) * 100;
    } catch (error) {
      this.handleError('flushBuffer', error);
      // Restaura eventos em caso de falha
      this.eventBuffer.events = [...this.eventBuffer.events];
    }
  }

  // Monitoramento de Performance
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      ...this.performanceMetrics,
      currentBufferSize: this.eventBuffer.events.length,
      averageResponseTime: this.calculateAverageResponseTime(),
      eventFrequencyDistribution: this.getEventFrequencyDistribution(),
    };
  }

  // Error Handling Centralizado
  private handleError(context: string, error: any): void {
    console.error(`[MetricsService] Error in ${context}:`, error);

    // Notifica listeners sobre o erro
    this.eventEmitter.emit('metricError', {
      context,
      error,
      timestamp: new Date(),
    });

    // Log estruturado para análise
    this.logError(context, error);
  }

  // Utilitários de Performance
  private calculateAverageResponseTime(): number {
    const times = Array.from(this.performanceMetrics.responseTime.values());
    return times.reduce((acc, time) => acc + time, 0) / times.length;
  }

  private getEventFrequencyDistribution(): Map<string, number> {
    return new Map(Array.from(this.performanceMetrics.eventFrequency.entries()));
  }

  // Validação de Eventos
  private validateEvent(event: MetricEvent): void {
    if (!event.type) throw new Error('Event type is required');
    if (!event.data) throw new Error('Event data is required');
  }

  private logError(context: string, error: any): void {
    // Implementar logging estruturado
    // TODO: Integrar com sistema de logging
  }
}

// src/hooks/useGameAnalytics.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { MetricsService } from '../services/metrics/MetricsService';
import { debounce } from 'lodash';

export interface GameAnalytics {
  eventCount: number;
  averageResponseTime: number;
  bufferUtilization: number;
  lastUpdate: Date;
}

export const useGameAnalytics = () => {
  const [analytics, setAnalytics] = useState<GameAnalytics>({
    eventCount: 0,
    averageResponseTime: 0,
    bufferUtilization: 0,
    lastUpdate: new Date(),
  });

  const metricsService = useRef(MetricsService.getInstance());

  // Cache local para otimização
  const analyticsCache = useRef(new Map());

  // Atualização throttled para evitar renders excessivos
  const updateAnalytics = useCallback(
    debounce((newData: Partial<GameAnalytics>) => {
      setAnalytics((prev) => ({
        ...prev,
        ...newData,
        lastUpdate: new Date(),
      }));
    }, 1000),
    []
  );

  // Listener otimizado para eventos de métricas
  useEffect(() => {
    const handleMetricUpdate = (event: any) => {
      try {
        // Atualiza cache local
        analyticsCache.current.set(event.type, event);

        // Obtém métricas de performance atualizadas
        const performanceMetrics = metricsService.current.getPerformanceMetrics();

        // Atualiza estado com throttling
        updateAnalytics({
          eventCount: analyticsCache.current.size,
          averageResponseTime: performanceMetrics.averageResponseTime,
          bufferUtilization: performanceMetrics.bufferUtilization,
        });
      } catch (error) {
        console.error('[useGameAnalytics] Error handling metric update:', error);
      }
    };

    const metrics = metricsService.current;
    metrics.eventEmitter.on('metricUpdated', handleMetricUpdate);

    return () => {
      metrics.eventEmitter.off('metricUpdated', handleMetricUpdate);
      updateAnalytics.cancel();
    };
  }, [updateAnalytics]);

  // API pública do hook
  return {
    analytics,
    trackEvent: useCallback((type: string, data: any) => {
      metricsService.current.trackEvent({ type, data });
    }, []),
    getPerformanceMetrics: useCallback(() => {
      return metricsService.current.getPerformanceMetrics();
    }, []),
  };
};

// src/features/game/hooks/useGameMetrics.ts
import { useEffect, useState } from 'react';
import { initializeServices } from '@/lib/services';

export const useGameMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const services = initializeServices();

    services.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
      try {
        const bingoNumbers = services.processMetricsForBingo(newMetrics);
        setNumbers((prev) => [...new Set([...prev, ...bingoNumbers])]);
      } catch (err) {
        setError(err as Error);
      }
    });
  }, []);

  return { metrics, numbers, error };
};

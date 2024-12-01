import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Play, Square, Youtube, Database } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StreamMetrics {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  concurrentViewers: number;
  timestamp: number;
  source: 'simulation' | 'youtube' | 'data-connect';
  lastUpdated: number;
}

interface BingoNumber {
  value: number;
  source: string;
  timestamp: Date;
}

interface Props {
  onNumbersGenerated: (numbers: number[]) => void;
  isDevelopment?: boolean;
}

export default function StreamIntegration({ 
  onNumbersGenerated,
  isDevelopment = false
}: Props) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastNumbers, setLastNumbers] = useState<BingoNumber[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'simulation' | 'youtube' | 'data-connect'>('simulation');
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const normalizeNumber = useCallback((value: number, min: number, max: number): number => {
    const normalized = (value % max) + min;
    return Math.floor(normalized);
  }, []);

  const simulateMetrics = useCallback((): StreamMetrics => {
    return {
      viewCount: Math.floor(Math.random() * 10000),
      likeCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 500),
      concurrentViewers: Math.floor(Math.random() * 2000),
      timestamp: Date.now(),
      source: 'simulation',
      lastUpdated: Date.now()
    };
  }, []);

  const convertMetricsToBingoNumbers = useCallback((metrics: StreamMetrics): BingoNumber[] => {
    const numbers: BingoNumber[] = [];
    const timestamp = new Date(metrics.timestamp);

    const metricsMap = [
      { value: metrics.viewCount, source: 'views' },
      { value: metrics.likeCount, source: 'likes' },
      { value: metrics.concurrentViewers, source: 'viewers' }
    ];

    metricsMap.forEach(({ value, source }) => {
      const normalizedValue = normalizeNumber(value, 1, 75);
      numbers.push({
        value: normalizedValue,
        source: `${source} (${metrics.source})`,
        timestamp
      });
    });

    return numbers;
  }, [normalizeNumber]);

  const handleMetricsUpdate = useCallback((metrics: StreamMetrics) => {
    const numbers = convertMetricsToBingoNumbers(metrics);
    setLastNumbers(numbers);
    setLastUpdate(new Date(metrics.lastUpdated));
    onNumbersGenerated(numbers.map(n => n.value));
  }, [convertMetricsToBingoNumbers, onNumbersGenerated]);

  const startTracking = () => {
    try {
      const id = setInterval(() => {
        const metrics = simulateMetrics();
        handleMetricsUpdate(metrics);
      }, 5000);

      setIntervalId(id as unknown as number);
      setIsTracking(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
    }
  };

  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTracking(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {dataSource === 'data-connect' ? (
            <Database className="h-5 w-5" />
          ) : (
            <Youtube className="h-5 w-5" />
          )}
          Stream Integration
          {isDevelopment && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Development Mode
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center gap-4">
          <Select
            value={dataSource}
            onValueChange={(value: 'simulation' | 'youtube' | 'data-connect') => setDataSource(value)}
            disabled={isTracking}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simulation">Simulation</SelectItem>
              <SelectItem value="youtube">YouTube Direct</SelectItem>
              <SelectItem value="data-connect">Data Connect</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={isTracking ? stopTracking : startTracking}
            variant={isTracking ? "destructive" : "default"}
          >
            {isTracking ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Tracking
              </>
            )}
          </Button>
        </div>

        {lastUpdate && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Source: {dataSource}</span>
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}

        {lastNumbers.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {lastNumbers.map((number, index) => (
              <div 
                key={index}
                className="flex flex-col rounded bg-blue-50 p-3"
              >
                <span className="text-sm capitalize text-gray-600">{number.source}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {number.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
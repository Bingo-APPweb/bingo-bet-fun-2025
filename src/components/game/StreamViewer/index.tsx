// src/components/game/StreamViewer/index.tsx
import React from 'react';
import { useStreamStore } from '@/stores/streamStore';
import { Card } from '@/components/ui/card';

export function StreamViewer() {
  const { isLive, metrics } = useStreamStore();

  return (
    <Card className='aspect-video bg-gray-900'>
      {isLive ? (
        <div id='stream-player' className='w-full h-full' />
      ) : (
        <div className='flex items-center justify-center h-full text-white'>Stream offline</div>
      )}
    </Card>
  );
}

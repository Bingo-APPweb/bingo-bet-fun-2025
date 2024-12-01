import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { YouTubeIntegration } from '@/components/ui/YouTubeIntegration';

export const PlayerGame = () => {
  return (
    <div className='container mx-auto p-4'>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>BingoBetFun Game</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className='font-medium mb-2'>Welcome, Player!</h2>
          <p className='text-muted-foreground'>Join a live stream to start playing.</p>
        </CardContent>
      </Card>

      <YouTubeIntegration isHost={false} />
    </div>
  );
};

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { YouTubeIntegration } from '@/components/ui/YouTubeIntegration';

export const HostPanel = () => {
  return (
    <div className='container mx-auto p-4'>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Host Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className='font-medium mb-2'>Welcome, Host!</h2>
          <p className='text-muted-foreground'>
            Here you can manage your live stream and start a new game.
          </p>
        </CardContent>
      </Card>

      <YouTubeIntegration isHost={true} />
    </div>
  );
};

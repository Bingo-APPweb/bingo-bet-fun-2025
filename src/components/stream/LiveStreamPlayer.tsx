import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGame } from '@/features/game/GameProvider';
import { AlertTriangle, Video, RefreshCw } from 'lucide-react';
import { YouTubeUtils } from '@/utils/youtube';

interface LiveStreamPlayerProps {
  channelOrStreamId: string;
}

export const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({ channelOrStreamId }) => {
  const { metrics } = useGame();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamId, setStreamId] = useState<string | null>(null);

  useEffect(() => {
    const initializeStream = async () => {
      try {
        if (YouTubeUtils.isAllowed(channelOrStreamId)) {
          setStreamId(channelOrStreamId);
          return;
        }

        const channelId = await YouTubeUtils.getChannelId(channelOrStreamId);
        if (!channelId) {
          throw new Error('Canal não encontrado');
        }

        const liveStreamId = await YouTubeUtils.getLiveStreamId(channelId);
        if (!liveStreamId) {
          throw new Error('Nenhuma stream ao vivo encontrada');
        }

        setStreamId(liveStreamId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStream();
  }, [channelOrStreamId]);

  const retryLoad = () => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  };

  if (error) {
    return (
      <Card className='w-full'>
        <CardContent className='p-6'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={retryLoad} className='mt-4'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Video className='h-5 w-5' />
          Stream ao Vivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='relative' style={{ paddingTop: '56.25%' }}>
          {streamId && (
            <iframe
              className='absolute top-0 left-0 w-full h-full rounded-lg'
              src={`https://www.youtube.com/embed/${streamId}?autoplay=1&mute=1`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        </div>
        {metrics && (
          <div className='mt-4 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg'>
            <div>
              <div className='text-sm text-gray-500'>Espectadores</div>
              <div className='text-xl font-bold'>{metrics.viewCount}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Likes</div>
              <div className='text-xl font-bold'>{metrics.likeCount}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Comentários</div>
              <div className='text-xl font-bold'>{metrics.commentCount}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveStreamPlayer;

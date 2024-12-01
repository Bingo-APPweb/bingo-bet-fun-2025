import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Play, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Stream {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
  };
}

interface Channel {
  snippet: {
    title: string;
  };
}

const YouTubeIntegration = ({ isHost = false }) => {
  const [channelData, setChannelData] = useState<Channel | null>(null);
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [customChannelId, setCustomChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'AIzaSyCoXvDoJqfxjEF1r6-uQdgxTZtc36sqcjk';
  const DEFAULT_CHANNEL_ID = 'UCLHIUIBIid6qpljFBWEOHSw';

  useEffect(() => {
    if (isHost || customChannelId) {
      fetchChannelData(customChannelId || DEFAULT_CHANNEL_ID);
    }
  }, [customChannelId]);

  const fetchChannelData = async (channelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setChannelData(data.items?.[0] || null);
      await fetchLiveStreams(channelId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching channel');
      console.error('Error fetching channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveStreams = async (channelId: string) => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setLiveStreams(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching streams');
      console.error('Error fetching streams:', err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-48'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading channel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-4'>
      {isHost && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Host Panel</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Input
              placeholder='Channel ID (optional)'
              value={customChannelId}
              onChange={(e) => setCustomChannelId(e.target.value)}
              className='max-w-lg'
            />
            <Button
              onClick={() => fetchChannelData(customChannelId || DEFAULT_CHANNEL_ID)}
              className='w-full sm:w-auto'
            >
              Refresh Channel Data
            </Button>
          </CardContent>
        </Card>
      )}

      {channelData && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Video className='h-5 w-5 text-primary' />
              {channelData.snippet.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              {liveStreams.map((stream) => (
                <div
                  key={stream.id.videoId}
                  className={`
                    flex flex-col sm:flex-row items-start sm:items-center 
                    justify-between p-4 border rounded-lg
                    hover:bg-accent/5 transition-colors
                    ${selectedStream?.id.videoId === stream.id.videoId ? 'bg-accent/10 border-primary' : ''}
                  `}
                >
                  <div className='mb-4 sm:mb-0'>
                    <h3 className='font-medium mb-1'>{stream.snippet.title}</h3>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {stream.snippet.description}
                    </p>
                  </div>
                  <Button
                    variant={
                      selectedStream?.id.videoId === stream.id.videoId ? 'default' : 'outline'
                    }
                    onClick={() => setSelectedStream(stream)}
                    className='w-full sm:w-auto'
                  >
                    <Play className='h-4 w-4 mr-2' />
                    {isHost ? 'Select Stream' : 'Join Game'}
                  </Button>
                </div>
              ))}

              {liveStreams.length === 0 && (
                <div className='text-center py-8'>
                  <Video className='h-12 w-12 text-muted-foreground/50 mx-auto mb-4' />
                  <p className='text-muted-foreground'>No live streams found</p>
                  {isHost && (
                    <p className='text-sm text-muted-foreground mt-2'>
                      Start a live stream to begin your game
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStream && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='aspect-video bg-black rounded-lg overflow-hidden'>
              <iframe
                className='w-full h-full'
                src={`https://www.youtube.com/embed/${selectedStream.id.videoId}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeIntegration;

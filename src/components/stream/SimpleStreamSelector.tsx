// src/components/stream/SimpleStreamSelector.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Play } from 'lucide-react';

interface StreamSelectorProps {
  userType: 'player' | 'host';
  onStreamSelect: (streamId: string) => void;
}

const SimpleStreamSelector: React.FC<StreamSelectorProps> = ({ userType, onStreamSelect }) => {
  const [streamInput, setStreamInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    try {
      // Validação básica de URL/ID
      if (streamInput.includes('youtube.com') || streamInput.includes('youtu.be')) {
        // Extrair ID do vídeo da URL
        const url = new URL(streamInput);
        const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
        if (videoId) {
          onStreamSelect(videoId);
          return;
        }
      } else if (streamInput.startsWith('@')) {
        // Handle de canal
        onStreamSelect(streamInput);
        return;
      } else if (streamInput.length > 5) {
        // ID direto
        onStreamSelect(streamInput);
        return;
      }

      throw new Error('Formato inválido');
    } catch (err) {
      setError('Por favor, insira uma URL do YouTube válida ou ID do canal/vídeo');
    }
  };

  const getPlaceholder = () => {
    if (userType === 'host') {
      return 'Cole o link da sua live ou ID do seu canal';
    }
    return 'Cole o link da live ou @canal que deseja assistir';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Video className='h-5 w-5' />
          {userType === 'host' ? 'Sua Stream' : 'Conectar à Stream'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Campo de entrada simplificado */}
          <div className='flex gap-2'>
            <Input
              value={streamInput}
              onChange={(e) => setStreamInput(e.target.value)}
              placeholder={getPlaceholder()}
              className='flex-1'
            />
            <Button onClick={handleSubmit}>
              <Play className='h-4 w-4 mr-2' />
              {userType === 'host' ? 'Iniciar' : 'Conectar'}
            </Button>
          </div>

          {/* Exemplos de formatos aceitos */}
          <div className='text-sm text-gray-500'>
            <p>Formatos aceitos:</p>
            <ul className='list-disc list-inside'>
              <li>URL do YouTube (ex: https://youtube.com/watch?v=XXXXX)</li>
              <li>Handle do canal (ex: @seucanal)</li>
              <li>ID do vídeo (ex: dQw4w9WgXcQ)</li>
            </ul>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

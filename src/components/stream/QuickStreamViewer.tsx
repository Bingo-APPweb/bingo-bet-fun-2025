// src/components/stream/QuickStreamViewer.tsx
interface QuickStreamViewerProps {
  streamId: string;
  userType: 'player' | 'host';
}

const QuickStreamViewer: React.FC<QuickStreamViewerProps> = ({ streamId, userType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Video className='h-5 w-5' />
            {userType === 'host' ? 'Sua Transmissão' : 'Stream ao Vivo'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='relative' style={{ paddingTop: '56.25%' }}>
          <iframe
            className='absolute top-0 left-0 w-full h-full rounded-lg'
            src={`https://www.youtube.com/embed/${streamId}?autoplay=1&mute=1`}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Exemplo de uso em uma página
const SimpleBingoPage: React.FC = () => {
  const [streamId, setStreamId] = useState<string | null>(null);
  const userType: 'player' | 'host' = 'player'; // Defina com base na autenticação

  return (
    <div className='container mx-auto p-4 space-y-6'>
      {!streamId ? (
        <SimpleStreamSelector userType={userType} onStreamSelect={setStreamId} />
      ) : (
        <QuickStreamViewer streamId={streamId} userType={userType} />
      )}

      {/* Resto do jogo */}
    </div>
  );
};

export { SimpleStreamSelector, QuickStreamViewer };

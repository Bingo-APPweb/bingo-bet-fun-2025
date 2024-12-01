// Para o jogador (BingoPlayer.tsx)
import { SimpleStreamSelector, QuickStreamViewer } from '@/components/stream';

const BingoPlayer = () => {
  const [streamId, setStreamId] = useState<string | null>(null);

  return (
    <div className='container mx-auto p-4'>
      {!streamId ? (
        <SimpleStreamSelector userType='player' onStreamSelect={setStreamId} />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <QuickStreamViewer streamId={streamId} userType='player' />
          {/* Cartela de Bingo */}
        </div>
      )}
    </div>
  );
};

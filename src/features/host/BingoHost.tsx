// Para o streamer (BingoHost.tsx)
const BingoHost = () => {
    const [streamId, setStreamId] = useState<string | null>(null);
  
    return (
      <div className="container mx-auto p-4">
        {!streamId ? (
          <SimpleStreamSelector 
            userType="host"
            onStreamSelect={setStreamId}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickStreamViewer 
              streamId={streamId}
              userType="host"
            />
            {/* Controles do Host */}
          </div>
        )}
      </div>
    );
  };
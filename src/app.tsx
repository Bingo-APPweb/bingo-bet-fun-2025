import React, { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent, YouTubeIntegration } from '@/components/ui';

import { GameProvider, BingoGame, useGame } from '@/features/game';

import { BingoPlayer, BingoHost } from '@/features';

import { useGameStore } from '@/stores/gameStore';
import { useAuth } from '@/features/auth';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { StreamingRoom } from '@/components';
import { Home } from '@/pages';

// Lazy loading dos componentes do jogo
const BingoCard = React.lazy(() => import('@/components/game/BingoCard'));
const GameControls = React.lazy(() => import('@/components/game/GameControls'));
const Chat = React.lazy(() => import('@/components/game/Chat'));
const IntegrationTestDashboard = React.lazy(
  () => import('@/components/debug/IntegrationTestDashboard')
);

const LoadingFallback = () => (
  <div className='flex items-center justify-center h-32'>
    <Loader2 className='h-8 w-8 animate-spin text-primary' />
  </div>
);

const App: React.FC = () => {
  const { user } = useAuth();
  const { game, isHost, isLoading, error } = useGameStore();

  if (error) {
    return (
      <Card className='p-4 bg-red-50 border-red-200'>
        <div className='text-red-600'>
          <h2 className='text-lg font-semibold'>Error</h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <GameProvider>
        <div className='min-h-screen bg-gray-50'>
          <div className='container mx-auto p-4'>
            <header className='mb-6'>
              <h1 className='text-3xl font-bold'>BingoBetFun</h1>
            </header>

            <main>
              <Suspense fallback={<LoadingFallback />}>
                <div className='grid md:grid-cols-2 gap-6'>
                  <section>
                    {isHost ? <BingoHost /> : <BingoPlayer />}
                    <BingoGame />
                  </section>

                  <section>
                    <StreamingRoom />
                    <YouTubeIntegration isHost={isHost} />
                  </section>
                </div>

                {/* Game Components */}
                <div className='mt-6'>
                  {isHost && <GameControls />}
                  <BingoCard />
                  <Chat />
                </div>

                {/* Development Dashboard */}
                {import.meta.env.DEV && <IntegrationTestDashboard />}
              </Suspense>
            </main>
          </div>
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;

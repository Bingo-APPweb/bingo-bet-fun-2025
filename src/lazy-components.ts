// src/lazy-components.ts
export const LazyComponents = {
  BingoCard: React.lazy(() => import('@/components/game/BingoCard')),
  GameControls: React.lazy(() => import('@/components/game/GameControls')),
  Chat: React.lazy(() => import('@/components/game/Chat')),
  IntegrationTestDashboard: React.lazy(() => import('@/components/debug/IntegrationTestDashboard')),
};

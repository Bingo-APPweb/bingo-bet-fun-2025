// packages/maintainer/src/core/monitoring/__tests__/BingoAlertManager.test.ts
import { BingoAlertManager } from '../BingoAlertManager';
import { BingoMetricType } from '../../../types/monitoring';
import { BingoAlertType } from '../../../types/alerts';

describe('BingoAlertManager', () => {
  let alertManager: BingoAlertManager;

  beforeEach(() => {
    alertManager = new BingoAlertManager();
  });

  test('should create alert for high latency', async () => {
    const metric = {
      type: BingoMetricType.GAME_LATENCY,
      name: 'game_latency',
      value: 300,
      timestamp: new Date(),
      labels: {},
      gameId: 'test-game',
    };

    const alert = await alertManager.checkMetric(metric);

    expect(alert).toBeDefined();
    expect(alert?.type).toBe(BingoAlertType.HIGH_LATENCY);
    expect(alert?.severity).toBe('HIGH');
  });
});

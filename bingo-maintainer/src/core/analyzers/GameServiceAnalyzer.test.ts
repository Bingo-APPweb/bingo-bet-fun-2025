import { GameServiceAnalyzer } from '../../../../src/core/analyzers/GameServiceAnalyzer';
import { AnalyzerConfig } from '../../../../src/types/analyzers';

describe('GameServiceAnalyzer', () => {
  let analyzer: GameServiceAnalyzer;
  const config: AnalyzerConfig = {
    targetPath: './src/services/game/GameService.ts',
    severity: 'error',
  };

  beforeEach(() => {
    analyzer = new GameServiceAnalyzer(config);
  });

  describe('Player Management Analysis', () => {
    test('detects invalid player data handling', async () => {
      const results = await analyzer.analyzePlayerManagement();
      expect(
        results.some((r) => r.message.includes('Invalid player data') && r.severity === 'error')
      ).toBe(true);
    });

    test('validates player state updates', async () => {
      const results = await analyzer.analyzePlayerManagement();
      expect(
        results.some(
          (r) => r.message.includes('Player state update') && r.location?.includes('updateState')
        )
      ).toBe(true);
    });
  });

  describe('Game Flow Analysis', () => {
    test('validates game state transitions', async () => {
      const results = await analyzer.analyzeGameFlow();
      expect(
        results.some((r) => r.message.includes('Game state transition') && r.severity === 'error')
      ).toBe(false);
    });

    test('checks number drawing logic', async () => {
      const results = await analyzer.analyzeGameFlow();
      expect(
        results.some(
          (r) => r.message.includes('Number drawing') && r.location?.includes('drawNumber')
        )
      ).toBe(true);
    });
  });

  describe('Win Condition Analysis', () => {
    test('validates horizontal win detection', async () => {
      const results = await analyzer.analyzeWinConditions();
      expect(results.some((r) => r.message.includes('Horizontal win detection'))).toBe(true);
    });

    test('validates diagonal win detection', async () => {
      const results = await analyzer.analyzeWinConditions();
      expect(results.some((r) => r.message.includes('Diagonal win detection'))).toBe(true);
    });
  });

  describe('State Management Analysis', () => {
    test('validates subscription mechanism', async () => {
      const results = await analyzer.analyzeStateManagement();
      expect(
        results.some(
          (r) => r.message.includes('State subscription') && r.location?.includes('subscribe')
        )
      ).toBe(true);
    });

    test('checks update propagation', async () => {
      const results = await analyzer.analyzeStateManagement();
      expect(results.some((r) => r.message.includes('Update propagation'))).toBe(true);
    });
  });

  describe('Memory Management', () => {
    test('checks for subscriber cleanup', async () => {
      const results = await analyzer.analyze();
      expect(
        results.some((r) => r.message.includes('Subscriber cleanup') && r.severity === 'error')
      ).toBe(false);
    });
  });
});

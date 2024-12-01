// bingo-maintainer/src/core/__tests__/Runner.test.ts
import { Runner } from '../Runner';
import { BaseAnalyzer } from '../analyzers/BaseAnalyzer';

class MockAnalyzer extends BaseAnalyzer {
  constructor(
    name: string,
    private result: any
  ) {
    super(name);
  }

  async analyze() {
    return this.result;
  }
}

describe('Runner', () => {
  it('should run all analyzers and collect results', async () => {
    const analyzers = [
      new MockAnalyzer('Test1', { status: 'success', message: 'Test 1 passed' }),
      new MockAnalyzer('Test2', { status: 'warning', message: 'Test 2 warning' }),
    ];

    const runner = new Runner(analyzers);
    const results = await runner.runAll();

    expect(results).toHaveLength(2);
    expect(results[0].status).toBe('success');
    expect(results[1].status).toBe('warning');
  });

  it('should handle analyzer failures', async () => {
    const failingAnalyzer = new MockAnalyzer('Failing', {
      throw: new Error('Test error'),
    });

    const runner = new Runner([failingAnalyzer]);
    const results = await runner.runAll();

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('error');
  });
});

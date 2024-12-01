// bingo-maintainer/src/core/analyzers/__tests__/BaseAnalyzer.test.ts
import { BaseAnalyzer } from '../BaseAnalyzer';

class TestAnalyzer extends BaseAnalyzer {
  constructor() {
    super('TestAnalyzer');
  }

  async analyze() {
    return this.createResult('success', 'Test analysis completed');
  }
}

describe('BaseAnalyzer', () => {
  let analyzer: TestAnalyzer;

  beforeEach(() => {
    analyzer = new TestAnalyzer();
  });

  it('should create a successful result', async () => {
    const result = await analyzer.analyze();

    expect(result).toEqual({
      status: 'success',
      message: 'Test analysis completed',
    });
  });
});

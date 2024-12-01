// packages/maintainer/tests/unit/bin/bingo-maintain.test.ts
import { jest } from '@jest/globals';
import { execSync } from 'child_process';
import * as path from 'path';
import { Runner } from '../../../src/core/Runner';

// Mock de dependências
jest.mock('../../../src/core/Runner');
jest.mock('chalk', () => ({
  green: jest.fn((text) => text),
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
}));
jest.mock('ora', () => () => ({
  start: jest.fn(),
  stop: jest.fn(),
  succeed: jest.fn(),
  fail: jest.fn(),
}));

describe('bingo-maintain CLI', () => {
  const CLI_PATH = path.resolve(__dirname, '../../../bin/bingo-maintain.ts');
  let mockRunner: jest.Mocked<Runner>;

  beforeEach(() => {
    mockRunner = new Runner({}) as jest.Mocked<Runner>;
    (Runner as jest.MockedClass<typeof Runner>).mockImplementation(() => mockRunner);
    mockRunner.run = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Line Interface', () => {
    test('executes check command correctly', async () => {
      const result = execSync(`ts-node ${CLI_PATH} check`, { encoding: 'utf-8' });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'check',
        })
      );
      expect(mockRunner.run).toHaveBeenCalled();
      expect(result).toContain('Analysis complete');
    });

    test('executes watch command with options', async () => {
      const result = execSync(`ts-node ${CLI_PATH} watch --fix`, { encoding: 'utf-8' });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'watch',
          autoFix: true,
        })
      );
      expect(mockRunner.run).toHaveBeenCalled();
      expect(result).toContain('Watching for changes');
    });

    test('executes analyze command with target path', async () => {
      const targetPath = './src/components/GameRoom.tsx';
      const result = execSync(`ts-node ${CLI_PATH} analyze ${targetPath} --detailed`, {
        encoding: 'utf-8',
      });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'analyze',
          targetPath,
          detailed: true,
        })
      );
      expect(mockRunner.run).toHaveBeenCalled();
      expect(result).toContain('Analysis complete');
    });
  });

  describe('Error Handling', () => {
    test('handles invalid commands', () => {
      expect(() => {
        execSync(`ts-node ${CLI_PATH} invalid-command`, { encoding: 'utf-8' });
      }).toThrow();
    });

    test('handles missing required arguments', () => {
      expect(() => {
        execSync(`ts-node ${CLI_PATH} analyze`, { encoding: 'utf-8' });
      }).toThrow(/missing required argument/i);
    });

    test('handles analysis failures', async () => {
      mockRunner.run.mockRejectedValue(new Error('Analysis failed'));

      expect(() => {
        execSync(`ts-node ${CLI_PATH} check`, { encoding: 'utf-8' });
      }).toThrow(/Analysis failed/);
    });
  });

  describe('Configuration Options', () => {
    test('loads custom config file', async () => {
      const configPath = './custom-config.json';
      const result = execSync(`ts-node ${CLI_PATH} check --config ${configPath}`, {
        encoding: 'utf-8',
      });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          configPath,
        })
      );
      expect(result).toContain('Analysis complete');
    });

    test('respects verbosity level', async () => {
      const result = execSync(`ts-node ${CLI_PATH} check --verbose`, { encoding: 'utf-8' });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          verbose: true,
        })
      );
      expect(result).toContain('Analysis complete');
    });

    test('handles different output formats', async () => {
      const result = execSync(`ts-node ${CLI_PATH} analyze ./src --format json`, {
        encoding: 'utf-8',
      });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          outputFormat: 'json',
        })
      );
      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('Integration with Analyzers', () => {
    test('passes correct analyzers configuration', async () => {
      execSync(`ts-node ${CLI_PATH} check --analyzers complexity,security`, { encoding: 'utf-8' });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          analyzers: ['complexity', 'security'],
        })
      );
    });

    test('respects analyzer thresholds', async () => {
      execSync(`ts-node ${CLI_PATH} check --threshold.complexity 15`, { encoding: 'utf-8' });

      expect(Runner).toHaveBeenCalledWith(
        expect.objectContaining({
          thresholds: expect.objectContaining({
            complexity: 15,
          }),
        })
      );
    });
  });

  describe('Progress and Output', () => {
    test('shows progress spinner', async () => {
      const result = execSync(`ts-node ${CLI_PATH} check`, { encoding: 'utf-8' });
      expect(result).toContain('Analysis in progress');
    });

    test('displays summary after analysis', async () => {
      mockRunner.run.mockResolvedValue({
        issues: 5,
        warnings: 2,
        duration: 1500,
      });

      const result = execSync(`ts-node ${CLI_PATH} check`, { encoding: 'utf-8' });
      expect(result).toContain('issues found');
      expect(result).toContain('warnings');
      expect(result).toContain('completed in');
    });
  });
});

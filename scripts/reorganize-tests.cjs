// scripts/reorganize-tests.js
const fs = require('fs/promises');
const path = require('path');

async function reorganizeTests() {
  const rootDir = process.cwd();
  
  try {
    console.log('\x1b[34m%s\x1b[0m', 'Creating new directory structure...');
    
    // 1. Criar estrutura de diretórios
    await fs.mkdir(path.join(rootDir, 'src', '__tests__', 'components'), { recursive: true });
    await fs.mkdir(path.join(rootDir, 'src', '__tests__', 'integration'), { recursive: true });
    await fs.mkdir(path.join(rootDir, 'src', '__mocks__'), { recursive: true });

    // 2. Mover arquivos de teste
    console.log('\x1b[34m%s\x1b[0m', '\nMoving test files...');
    
    const rootTestDir = path.join(rootDir, 'test');
    try {
      const testFiles = await fs.readdir(rootTestDir);
      for (const file of testFiles) {
        const sourcePath = path.join(rootTestDir, file);
        const targetPath = path.join(rootDir, 'src', '__tests__', file);
        
        console.log('\x1b[90m%s\x1b[0m', `Moving ${file} to src/__tests__`);
        await fs.copyFile(sourcePath, targetPath);
      }
    } catch (err) {
      console.log('No root test directory found, skipping...');
    }

    // 3. Reorganizar mocks existentes
    console.log('\x1b[34m%s\x1b[0m', '\nReorganizing mocks...');
    const srcMocksDir = path.join(rootDir, 'src', '_mocks_');
    try {
      const mockFiles = await fs.readdir(srcMocksDir);
      for (const file of mockFiles) {
        const sourcePath = path.join(srcMocksDir, file);
        const targetPath = path.join(rootDir, 'src', '__mocks__', file);
        
        console.log('\x1b[90m%s\x1b[0m', `Moving ${file} to src/__mocks__`);
        await fs.copyFile(sourcePath, targetPath);
      }
    } catch (err) {
      console.log('No src/_mocks_ directory found, skipping...');
    }

    // 4. Criar setupTests.ts
    const setupPath = path.join(rootDir, 'src', 'setupTests.ts');
    try {
      await fs.access(setupPath);
    } catch {
      console.log('\x1b[34m%s\x1b[0m', '\nCreating setupTests.ts...');
      const setupContent = `
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './__mocks__/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
`.trim();
      
      await fs.writeFile(setupPath, setupContent);
    }

    // 5. Criar/Atualizar jest.config.ts
    console.log('\x1b[34m%s\x1b[0m', '\nUpdating jest configuration...');
    const jestConfig = `
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**/*',
    '!src/__mocks__/**/*',
  ],
};

export default config;
`.trim();

    await fs.writeFile(path.join(rootDir, 'jest.config.ts'), jestConfig);

    // 6. Limpar diretórios antigos
    console.log('\x1b[34m%s\x1b[0m', '\nCleaning up old directories...');
    try {
      await fs.rm(rootTestDir, { recursive: true });
      console.log('\x1b[90m%s\x1b[0m', 'Removed /test directory');
    } catch {}
    
    try {
      await fs.rm(srcMocksDir, { recursive: true });
      console.log('\x1b[90m%s\x1b[0m', 'Removed src/_mocks_ directory');
    } catch {}

    console.log('\x1b[32m%s\x1b[0m', '\n✓ Test directory reorganization completed successfully!');
    console.log('\x1b[33m%s\x1b[0m', '\nNext steps:');
    console.log('1. Review the moved files');
    console.log('2. Update any import paths in test files');
    console.log('3. Run npm test to verify everything works');

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '\nError during reorganization:', error);
    process.exit(1);
  }
}

reorganizeTests().catch(console.error);

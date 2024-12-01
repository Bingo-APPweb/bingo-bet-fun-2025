#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

try {
  // 1. Remover arquivos do Jest
  log.info('Removing Jest configuration files...');
  const filesToRemove = ['jest.config.js', 'jest.config.cjs', 'jest.setup.ts', 'jest.config.ts'];

  filesToRemove.forEach((file) => {
    try {
      unlinkSync(file);
      log.success(`Removed ${file}`);
    } catch (err) {
      log.warning(`${file} not found, skipping...`);
    }
  });

  // 2. Criar diretório de teste se não existir
  const testDir = join(process.cwd(), 'src', 'test');
  if (!existsSync(testDir)) {
    mkdirSync(testDir, { recursive: true });
    log.success('Created test directory');
  }

  // 3. Criar arquivo de configuração do Vitest
  log.info('Creating Vitest configuration...');
  const vitestConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/*'
      ]
    }
  }
});`;

  writeFileSync('vitest.config.ts', vitestConfig);
  log.success('Created vitest.config.ts');

  // 4. Criar arquivo de setup
  log.info('Creating test setup file...');
  const setupContent = `import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}));`;

  writeFileSync(join(testDir, 'setup.ts'), setupContent);
  log.success('Created src/test/setup.ts');

  // 5. Criar componente de teste de exemplo
  log.info('Creating example test component...');
  const exampleComponentTest = `import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StreamIntegration } from '@/components/StreamIntegration';

describe('StreamIntegration', () => {
  it('should render connect button when not connected', () => {
    render(
      <StreamIntegration 
        onNumbersGenerated={vi.fn()}
        roomId="test-room"
      />
    );

    expect(screen.getByText(/connect/i)).toBeInTheDocument();
  });

  it('should handle stream connection', async () => {
    const onNumbersGenerated = vi.fn();
    
    render(
      <StreamIntegration 
        onNumbersGenerated={onNumbersGenerated}
        roomId="test-room"
      />
    );

    const urlInput = screen.getByPlaceholderText(/enter.*url/i);
    const connectButton = screen.getByText(/connect/i);

    fireEvent.change(urlInput, { target: { value: 'https://youtube.com/watch?v=test123' } });
    fireEvent.click(connectButton);

    expect(await screen.findByText(/connected/i)).toBeInTheDocument();
  });
});`;

  const testComponentDir = join(process.cwd(), 'src', 'components', '__tests__');
  if (!existsSync(testComponentDir)) {
    mkdirSync(testComponentDir, { recursive: true });
  }
  writeFileSync(join(testComponentDir, 'StreamIntegration.test.tsx'), exampleComponentTest);
  log.success('Created example test component');

  // 6. Atualizar dependências
  log.info('Updating dependencies...');

  // Remover dependências do Jest
  log.info('Removing Jest dependencies...');
  execSync('npm uninstall jest jest-environment-jsdom ts-jest @swc/jest', { stdio: 'inherit' });

  // Instalar dependências do Vitest
  log.info('Installing Vitest dependencies...');
  execSync(
    'npm install -D vitest @vitest/coverage-c8 @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths',
    { stdio: 'inherit' }
  );

  // 7. Atualizar scripts no package.json
  log.info('Updating package.json scripts...');
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      test: 'vitest',
      'test:ui': 'vitest --ui',
      'test:coverage': 'vitest run --coverage',
    };

    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    log.success('Updated package.json');
  } catch (error) {
    log.error('Error updating package.json: ' + error.message);
    log.warning('Please update the scripts manually in package.json:');
    log.info(`
      "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest run --coverage"
      }
    `);
  }

  log.success('\n✨ Setup completed successfully! ✨');
  log.info('\nYou can now run your tests with:');
  log.info('  npm test           - Run tests in watch mode');
  log.info('  npm run test:ui    - Run tests with UI');
  log.info('  npm run test:coverage - Run tests with coverage\n');
} catch (error) {
  log.error('\nError during setup:');
  console.error(error);
  process.exit(1);
}

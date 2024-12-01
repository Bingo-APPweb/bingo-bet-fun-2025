#!/usr/bin/env node

import { unlinkSync, existsSync } from 'fs';

const jestFiles = [
  'jest.config.ts',
  'jest.config.js',
  'jest.config.cjs',
  'jest.config.mjs',
  'jest.setup.ts',
  'jest.setup.js',
];

console.log('🧹 Cleaning up Jest files...');

jestFiles.forEach((file) => {
  if (existsSync(file)) {
    try {
      unlinkSync(file);
      console.log(`✅ Removed ${file}`);
    } catch (err) {
      console.error(`❌ Error removing ${file}:`, err.message);
    }
  }
});

console.log('🎉 Cleanup complete!');

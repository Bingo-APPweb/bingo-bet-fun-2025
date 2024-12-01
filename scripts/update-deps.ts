// scripts/update-deps.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const REQUIRED_DEPS = {
  dependencies: {
    '@hookform/resolvers': '^3.3.4',
    'react-hook-form': '^7.50.0',
    zod: '^3.22.4',
    '@radix-ui/react-toast': '^1.1.5',
    'date-fns': '^3.3.1',
  },
  devDependencies: {
    husky: '^9.0.11',
    'lint-staged': '^15.2.2',
    '@types/socket.io-client': '^4.8.1',
    'cross-env': '^7.0.3',
  },
};

async function updateDependencies() {
  try {
    // Read current package.json
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check and add missing dependencies
    let missingDeps: string[] = [];
    let missingDevDeps: string[] = [];

    Object.entries(REQUIRED_DEPS.dependencies).forEach(([dep, version]) => {
      if (!packageJson.dependencies[dep]) {
        missingDeps.push(`${dep}@${version}`);
      }
    });

    Object.entries(REQUIRED_DEPS.devDependencies).forEach(([dep, version]) => {
      if (!packageJson.devDependencies[dep]) {
        missingDevDeps.push(`${dep}@${version}`);
      }
    });

    // Install missing dependencies
    if (missingDeps.length > 0) {
      console.log(chalk.blue('Installing missing dependencies...'));
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    }

    if (missingDevDeps.length > 0) {
      console.log(chalk.blue('Installing missing dev dependencies...'));
      execSync(`npm install -D ${missingDevDeps.join(' ')}`, { stdio: 'inherit' });
    }

    // Update existing dependencies
    console.log(chalk.blue('Updating existing dependencies...'));
    execSync('npm update', { stdio: 'inherit' });

    console.log(chalk.green('Dependencies updated successfully!'));
  } catch (error) {
    console.error(chalk.red('Error updating dependencies:'), error);
    process.exit(1);
  }
}

// scripts/setup-config.ts
async function setupConfigurations() {
  try {
    // Create necessary directories
    const dirs = [
      'src/components',
      'src/hooks',
      'src/utils',
      'src/store',
      'src/types',
      'src/lib',
      'src/test',
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(chalk.green(`Created directory: ${dir}`));
      }
    });

    // Setup Husky
    console.log(chalk.blue('Setting up Husky...'));
    execSync('npx husky install', { stdio: 'inherit' });
    execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: 'inherit' });
    execSync('npx husky add .husky/pre-push "npm test"', { stdio: 'inherit' });

    // Create configuration files
    const configs = [
      {
        path: '.lintstagedrc.js',
        content: `module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss}': ['prettier --write'],
  '*.{json,md}': ['prettier --write']
};`,
      },
      {
        path: 'src/test/setup.ts',
        content: `import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});`,
      },
    ];

    configs.forEach(({ path: configPath, content }) => {
      fs.writeFileSync(configPath, content);
      console.log(chalk.green(`Created/Updated: ${configPath}`));
    });

    console.log(chalk.green('Configuration setup completed successfully!'));
  } catch (error) {
    console.error(chalk.red('Error setting up configurations:'), error);
    process.exit(1);
  }
}

// Main script
async function main() {
  console.log(chalk.blue('Starting project update...'));

  await updateDependencies();
  await setupConfigurations();

  console.log(chalk.green('\nProject update completed successfully!'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log('1. Review the updated package.json');
  console.log('2. Run tests to ensure everything works');
  console.log('3. Commit the changes');
}

main().catch(console.error);

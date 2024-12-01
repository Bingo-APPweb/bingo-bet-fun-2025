#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { MaintainerRunner } from '../src/core/Runner';
import { MaintainerAuth } from '../src/auth';
import { loadConfig } from '../src/utils/config';

const program = new Command();

program
  .version('1.0.0')
  .description('BingoBetFun code maintainer and analyzer');

program
  .command('check')
  .description('Run a basic check on the codebase')
  .action(async () => {
    const spinner = ora('Running code check...').start();
    try {
      const config = await loadConfig();
      const auth = new MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
      const runner = new MaintainerRunner(config, auth);

      runner.on('health-check', (health) => {
        spinner.text = `Analyzing... Complexity: ${health.complexity}`;
      });

      await runner.run();
      
      spinner.succeed('Check completed');
    } catch (error) {
      spinner.fail(chalk.red(`Check failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('watch')
  .description('Watch for changes and run continuous analysis')
  .option('--fix', 'Automatically fix issues when possible')
  .action(async (options) => {
    console.log(chalk.blue('Starting watch mode...'));
    try {
      const config = await loadConfig();
      config.autofix = options.fix;
      
      const auth = new MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
      const runner = new MaintainerRunner(config, auth);

      runner.on('health-check', (health) => {
        console.log(chalk.green(`Health check completed: ${health.timestamp}`));
      });

      runner.watch();
      console.log(chalk.green('Watching for changes...'));
    } catch (error) {
      console.error(chalk.red(`Watch mode failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('analyze <file>')
  .description('Analyze a specific file')
  .option('-d, --detailed', 'Show detailed analysis')
  .action(async (file, options) => {
    const spinner = ora(`Analyzing ${file}...`).start();
    try {
      const config = await loadConfig();
      const auth = new MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
      const runner = new MaintainerRunner(config, auth);

      const result = await runner.analyzeFile(file);
      spinner.stop();

      if (options.detailed) {
        console.log(chalk.blue('Detailed Analysis:'));
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green('Analysis Summary:'));
        console.log(`Complexity: ${result.complexity}`);
        console.log(`Issues: ${result.issues.length}`);
      }
    } catch (error) {
      spinner.fail(chalk.red(`Analysis failed: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
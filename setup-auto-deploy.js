// setup-auto-deploy.js
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SetupAutoDeploy {
  constructor() {
    this.scriptPath = join(__dirname, 'git-auto-deploy.js');
  }

  async setup() {
    try {
      // Create package.json script entry
      console.log('📦 Adding script to package.json...');
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['auto-deploy'] = 'node git-auto-deploy.js';
      writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

      // Create cron job for Linux/Mac or scheduled task for Windows
      if (process.platform === 'win32') {
        console.log('🪟 Setting up Windows scheduled task...');
        execSync(
          `schtasks /create /sc minute /mo 30 /tn "GitAutoDeploy" /tr "node ${this.scriptPath}"`
        );
      } else {
        console.log('🐧 Setting up cron job...');
        const cronCommand = `*/30 * * * * cd ${process.cwd()} && node ${this.scriptPath}`;
        execSync(`(crontab -l 2>/dev/null; echo "${cronCommand}") | crontab -`);
      }

      console.log('✅ Setup completed successfully!');
      console.log('You can now run auto-deploy with: npm run auto-deploy');
    } catch (error) {
      console.error('❌ Error during setup:', error.message);
      process.exit(1);
    }
  }
}

// Run the setup
const setup = new SetupAutoDeploy();
setup.setup();

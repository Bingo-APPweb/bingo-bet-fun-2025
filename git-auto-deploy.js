// git-auto-deploy.js
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class GitAutoDeploy {
  constructor(branch = 'master') {
    this.branch = branch;
    this.timestamp = new Date().toISOString();
  }

  execute() {
    try {
      // Add all changes
      console.log('🔍 Checking for changes...');
      execSync('git add .', { stdio: 'inherit' });

      // Check if there are changes to commit
      const status = execSync('git status --porcelain').toString();

      if (!status) {
        console.log('✨ No changes to commit');
        return;
      }

      // Create commit message with timestamp
      const commitMessage = `Auto-commit: Project update ${this.timestamp}`;
      console.log('📝 Creating commit...');
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Push to remote repository
      console.log(`🚀 Pushing to ${this.branch}...`);
      execSync(`git push origin ${this.branch}`, { stdio: 'inherit' });

      console.log('✅ Auto-deploy completed successfully!');
    } catch (error) {
      console.error('❌ Error during auto-deploy:', error.message);
      process.exit(1);
    }
  }
}

// Run the auto deploy
const deploy = new GitAutoDeploy();
deploy.execute();

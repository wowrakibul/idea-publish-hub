
#!/usr/bin/env node

// This script runs the build command without the frozen lockfile flag
const { execSync } = require('child_process');

try {
  // Run the actual build command
  console.log('Running build with unfrozen lockfile...');
  execSync('npm install --no-frozen-lockfile && npm run build:vite', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}


// This file is used to configure the build process for Cloudflare Pages
module.exports = {
  // Configure build command
  build: {
    command: 'node build-command.js',
    directory: 'dist',
    environment: {
      NODE_VERSION: '18'
    }
  },
  // Disable frozen lockfile to allow automatic dependency resolution
  packageManager: {
    enableFrozenLockfile: false
  }
}

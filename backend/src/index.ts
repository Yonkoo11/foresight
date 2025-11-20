/**
 * CT league Backend
 * Main entry point
 */

import { startServer } from './server';

console.log('Backend starting...');

// Start the server
startServer().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});

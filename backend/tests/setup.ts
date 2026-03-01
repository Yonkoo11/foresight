/**
 * Test Setup
 * Runs before all tests
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';
// Provide a test JWT secret if none is set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-do-not-use-in-production-abcdef1234567890';
}

beforeAll(async () => {
  // Any global setup
  console.log('Test suite starting...');
});

afterAll(async () => {
  // Any global cleanup
  console.log('Test suite complete.');
});

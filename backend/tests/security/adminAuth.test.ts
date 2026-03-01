/**
 * FINDING-004: Admin Endpoints Missing Authorization
 *
 * Tests that admin endpoints require admin role, not just authentication.
 * A regular authenticated user should get 403 on all admin routes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/server';
import * as authUtils from '../../src/utils/auth';

// Create a non-admin JWT for testing
const NON_ADMIN_PAYLOAD = {
  userId: 'test-user-123',
  walletAddress: '0xtest',
  role: 'user',
};

const ADMIN_PAYLOAD = {
  userId: 'test-admin-456',
  walletAddress: '0xadmin',
  role: 'admin',
};

describe('FINDING-004: Admin Endpoint Authorization', () => {
  let userToken: string;
  let adminToken: string;

  beforeEach(() => {
    // Create real JWTs using the app's auth utils
    userToken = authUtils.createAccessToken(NON_ADMIN_PAYLOAD);
    adminToken = authUtils.createAccessToken(ADMIN_PAYLOAD);
  });

  const adminEndpoints = [
    { method: 'get', path: '/api/admin/stats' },
    { method: 'post', path: '/api/admin/trigger-scoring' },
    { method: 'get', path: '/api/admin/cron-status' },
    { method: 'post', path: '/api/admin/update-metrics' },
    { method: 'get', path: '/api/admin/metrics-status' },
    { method: 'get', path: '/api/admin/snapshot-status' },
    { method: 'post', path: '/api/admin/trigger-start-snapshot' },
    { method: 'post', path: '/api/admin/trigger-end-snapshot' },
    { method: 'post', path: '/api/admin/trigger-weekly-scoring' },
    { method: 'get', path: '/api/admin/api-fetch-logs' },
    { method: 'post', path: '/api/admin/trigger-prized-lock' },
    { method: 'post', path: '/api/admin/trigger-prized-scoring' },
    { method: 'post', path: '/api/admin/trigger-contest-finalization' },
  ];

  for (const endpoint of adminEndpoints) {
    it(`should reject non-admin user on ${endpoint.method.toUpperCase()} ${endpoint.path}`, async () => {
      const res = await (request(app) as any)[endpoint.method](endpoint.path)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  }

  it('should allow admin user on GET /api/admin/stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    // Should NOT be 403 (might be 200 or 500 depending on DB, but not 403)
    expect(res.status).not.toBe(403);
  });

  it('should reject unauthenticated requests on admin endpoints', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });
});

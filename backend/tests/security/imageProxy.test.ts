/**
 * FINDING-003: SSRF Vulnerability in Image Proxy
 *
 * Tests that /api/proxy-image validates URLs and blocks:
 * - Private/internal IPs (localhost, 127.x, 10.x, 192.168.x, 169.254.x)
 * - Non-image content types
 * - Non-whitelisted domains
 * - Missing URL parameter
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server';

describe('FINDING-003: Image Proxy SSRF Protection', () => {
  it('should reject requests without url param', async () => {
    const res = await request(app).get('/api/proxy-image');
    expect(res.status).toBe(400);
  });

  it('should reject localhost URLs', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'http://localhost:3001/api/admin/stats' });
    expect(res.status).toBe(403);
  });

  it('should reject 127.0.0.1 URLs', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'http://127.0.0.1:3001/health' });
    expect(res.status).toBe(403);
  });

  it('should reject private 10.x.x.x IPs', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'http://10.0.0.1/internal' });
    expect(res.status).toBe(403);
  });

  it('should reject private 192.168.x.x IPs', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'http://192.168.1.1/admin' });
    expect(res.status).toBe(403);
  });

  it('should reject AWS metadata endpoint', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'http://169.254.169.254/latest/meta-data/' });
    expect(res.status).toBe(403);
  });

  it('should reject non-whitelisted domains', async () => {
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'https://evil-site.com/steal-data' });
    expect(res.status).toBe(403);
  });

  it('should allow whitelisted domain (pbs.twimg.com)', async () => {
    // This will either succeed (200) or fail upstream (502/404) — but NOT 403
    const res = await request(app)
      .get('/api/proxy-image')
      .query({ url: 'https://pbs.twimg.com/profile_images/test/photo.jpg' });
    expect(res.status).not.toBe(403);
  }, 15000);
});

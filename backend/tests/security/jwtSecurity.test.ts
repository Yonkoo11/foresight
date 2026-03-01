/**
 * FINDING-016: JWT Algorithm Not Explicitly Pinned
 *
 * Tests that JWT tokens are signed and verified with explicit HS256 algorithm,
 * preventing algorithm confusion attacks.
 */

import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { createAccessToken, verifyToken } from '../../src/utils/auth';

describe('FINDING-016: JWT Algorithm Security', () => {
  it('should create tokens with HS256 algorithm', () => {
    const token = createAccessToken({ userId: 'test-user', role: 'user' });
    const decoded = jwt.decode(token, { complete: true });
    expect(decoded?.header.alg).toBe('HS256');
  });

  it('should reject tokens signed with "none" algorithm', () => {
    // Craft a token with alg: none (classic attack)
    const payload = { userId: 'attacker', role: 'admin' };
    const fakeToken = jwt.sign(payload, '', { algorithm: 'none' as any });
    const result = verifyToken(fakeToken);
    expect(result).toBeNull();
  });

  it('should verify valid tokens correctly', () => {
    const token = createAccessToken({ userId: 'test-user', role: 'user' });
    const result = verifyToken(token);
    expect(result).not.toBeNull();
    expect(result?.userId).toBe('test-user');
  });
});

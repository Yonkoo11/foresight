import db from './db';
import { Request } from 'express';

/**
 * FINDING-029: Audit logging for admin and sensitive actions
 * Logs who did what, when, and from where.
 */
export async function logAuditEvent(
  req: Request,
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    await db('audit_log').insert({
      user_id: (req as any).user?.userId || null,
      action,
      resource_type: resourceType || null,
      resource_id: resourceId || null,
      ip_address: req.ip || req.socket.remoteAddress || null,
      details: details ? JSON.stringify(details) : null,
    });
  } catch (error) {
    // Audit logging should never break the request — log and continue
    console.error('[AUDIT] Failed to write audit log:', error);
  }
}

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { writeAuditEvent } from '../../src/core/audit';
import { createHadaraEvent, serializeHadaraEvent } from '../../src/core/events';

const roots: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-events-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('HADARA events', () => {
  it('normalizes structured events and redacts summaries and payloads', () => {
    const event = createHadaraEvent({
      time: '2026-05-25T00:00:00.000Z',
      level: 'warn',
      actor: 'cli',
      eventType: 'policy.preflight.completed',
      taskId: 'T-0095',
      summary: 'Saw token ghp_123456789012345678901234567890123456',
      payload: {
        nested: {
          token: 'ghp_123456789012345678901234567890123456'
        }
      }
    });

    expect(event).toMatchObject({
      schemaVersion: 'hadara.event.v1',
      time: '2026-05-25T00:00:00.000Z',
      level: 'warn',
      actor: 'cli',
      eventType: 'policy.preflight.completed',
      taskId: 'T-0095'
    });
    expect(event.summary).not.toContain('ghp_123456789012345678901234567890123456');
    expect(JSON.stringify(event.payload)).not.toContain('ghp_123456789012345678901234567890123456');
    expect(() => JSON.parse(serializeHadaraEvent(event))).not.toThrow();
  });

  it('writes audit records with compatibility fields plus a structured event', () => {
    const auditDir = tempDir();
    const filePath = writeAuditEvent(auditDir, {
      actor: 'agent',
      task_id: 'T-0095',
      event_type: 'mcp.evidence.attach.failed',
      risk: 'blocked',
      summary: 'Attach failed for ghp_123456789012345678901234567890123456',
      payload: {
        ok: false,
        secret: 'ghp_123456789012345678901234567890123456'
      }
    });

    const [record] = fs
      .readFileSync(filePath, 'utf8')
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line));

    expect(record).toMatchObject({
      actor: 'agent',
      task_id: 'T-0095',
      event_type: 'mcp.evidence.attach.failed',
      risk: 'blocked',
      event: {
        schemaVersion: 'hadara.event.v1',
        level: 'error',
        actor: 'agent',
        eventType: 'mcp.evidence.attach.failed',
        taskId: 'T-0095'
      }
    });
    expect(record.event.time).toBe(record.time);
    expect(JSON.stringify(record)).not.toContain('ghp_123456789012345678901234567890123456');
  });
});

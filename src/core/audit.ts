import path from 'node:path';
import { ensureDir, writeJsonl } from './fs';
import { redactSecrets } from './redaction';

export interface AuditEvent {
  time: string;
  session_id?: string;
  task_id?: string;
  actor: 'user' | 'agent' | 'system';
  event_type: string;
  risk?: 'low' | 'medium' | 'high' | 'blocked';
  summary: string;
  payload?: unknown;
}

export function writeAuditEvent(auditDir: string, event: Omit<AuditEvent, 'time'>): string {
  ensureDir(auditDir);
  const day = new Date().toISOString().slice(0, 10);
  const filePath = path.join(auditDir, `${day}.jsonl`);
  const sanitized: AuditEvent = {
    time: new Date().toISOString(),
    ...event,
    summary: redactSecrets(event.summary),
    payload: event.payload ? JSON.parse(redactSecrets(JSON.stringify(event.payload))) : undefined
  };
  writeJsonl(filePath, sanitized);
  return filePath;
}

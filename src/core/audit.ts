import path from 'node:path';
import { ensureDir, writeJsonl } from './fs';
import { redactSecrets } from './redaction';
import { createHadaraEvent, HadaraEvent } from './events';

export interface AuditEvent {
  time: string;
  session_id?: string;
  task_id?: string;
  actor: 'user' | 'agent' | 'system';
  event_type: string;
  risk?: 'low' | 'medium' | 'high' | 'blocked';
  summary: string;
  payload?: unknown;
  event?: HadaraEvent;
}

export function writeAuditEvent(auditDir: string, event: Omit<AuditEvent, 'time'>): string {
  ensureDir(auditDir);
  const day = new Date().toISOString().slice(0, 10);
  const filePath = path.join(auditDir, `${day}.jsonl`);
  const time = new Date().toISOString();
  const structuredEvent = createHadaraEvent({
    time,
    level: auditRiskToEventLevel(event.risk),
    actor: event.actor,
    eventType: event.event_type,
    taskId: event.task_id,
    summary: event.summary,
    payload: event.payload
  });
  const sanitized: AuditEvent = {
    time,
    ...event,
    summary: redactSecrets(event.summary),
    payload: structuredEvent.payload,
    event: structuredEvent
  };
  writeJsonl(filePath, sanitized);
  return filePath;
}

function auditRiskToEventLevel(risk: AuditEvent['risk']): HadaraEvent['level'] {
  if (risk === 'blocked') return 'error';
  if (risk === 'high') return 'warn';
  return 'info';
}

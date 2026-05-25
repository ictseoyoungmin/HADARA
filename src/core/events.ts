import { redactSecrets } from './redaction';
import { validateSchema } from './schema';

export type HadaraEventLevel = 'debug' | 'info' | 'warn' | 'error';
export type HadaraEventActor = 'cli' | 'mcp' | 'system' | 'agent' | 'user';

export interface HadaraEvent {
  schemaVersion: 'hadara.event.v1';
  time: string;
  level: HadaraEventLevel;
  eventType: string;
  actor: HadaraEventActor;
  taskId?: string;
  summary: string;
  payload?: unknown;
}

export interface HadaraEventInput {
  time?: string;
  level?: HadaraEventLevel;
  eventType: string;
  actor: HadaraEventActor;
  taskId?: string;
  summary: string;
  payload?: unknown;
}

export interface HadaraEventOptions {
  assertSchema?: boolean;
}

export class HadaraEventSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HadaraEventSchemaError';
  }
}

export function createHadaraEvent(input: HadaraEventInput, options: HadaraEventOptions = {}): HadaraEvent {
  const event: HadaraEvent = {
    schemaVersion: 'hadara.event.v1',
    time: input.time ?? new Date().toISOString(),
    level: input.level ?? 'info',
    eventType: input.eventType,
    actor: input.actor,
    summary: redactSecrets(input.summary)
  };
  if (input.taskId) event.taskId = input.taskId;
  const payload = sanitizePayload(input.payload);
  if (payload !== undefined) event.payload = payload;
  return options.assertSchema ? assertHadaraEventSchema(event) : event;
}

export function assertHadaraEventSchema(event: HadaraEvent): HadaraEvent {
  const result = validateSchema('hadara.event.v1', event);
  if (!result.ok) {
    const firstIssue = result.issues[0];
    throw new HadaraEventSchemaError(
      firstIssue
        ? `HADARA event failed schema validation: ${firstIssue.path} ${firstIssue.code} ${firstIssue.message}`
        : 'HADARA event failed schema validation.'
    );
  }
  return event;
}

export function serializeHadaraEvent(event: HadaraEvent): string {
  return JSON.stringify(event);
}

export function sanitizePayload(value: unknown): unknown {
  if (value === undefined) return undefined;
  const seen = new WeakSet<object>();
  const serialized = JSON.stringify(value, (_key, current) => {
    if (typeof current === 'bigint') return current.toString();
    if (typeof current !== 'object' || current === null) return current;
    if (seen.has(current)) return '[Circular]';
    seen.add(current);
    return current;
  });
  if (serialized === undefined) return undefined;
  return JSON.parse(redactSecrets(serialized));
}

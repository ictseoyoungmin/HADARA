import { createHash } from 'node:crypto';

export interface HadaraPlanContext {
  planId: string;
  generatedAt: string;
  affectedFiles: string[];
  beforeHash?: string;
  idempotencyKey?: string;
  reviewed: false;
}

export interface CreateHadaraPlanContextOptions {
  planId?: string;
  generatedAt?: string;
  affectedFiles: string[];
  beforeHash?: string;
  idempotencyKey?: string;
}

export function createHadaraPlanContext(options: CreateHadaraPlanContextOptions): HadaraPlanContext {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const affectedFiles = [...options.affectedFiles];
  return {
    planId: options.planId ?? createPlanId(generatedAt, affectedFiles, options.beforeHash, options.idempotencyKey),
    generatedAt,
    affectedFiles,
    beforeHash: options.beforeHash,
    idempotencyKey: options.idempotencyKey,
    reviewed: false
  };
}

function createPlanId(generatedAt: string, affectedFiles: string[], beforeHash?: string, idempotencyKey?: string): string {
  const hash = createHash('sha256')
    .update(JSON.stringify({ generatedAt, affectedFiles, beforeHash: beforeHash ?? null, idempotencyKey: idempotencyKey ?? null }))
    .digest('hex')
    .slice(0, 16);
  return `plan_${hash}`;
}

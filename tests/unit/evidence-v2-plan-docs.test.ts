import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('evidence v2 writer and migration plan docs', () => {
  it('documents v2 writer shape, dry-run-first migration, and non-goals', () => {
    const plan = read('docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md');
    const schemas = read('docs/SCHEMAS.md');
    const tests = read('docs/TEST_STRATEGY.md');

    for (const field of ['`schemaVersion`', '`id`', '`category`', '`outcome`', '`artifacts`', '`tags`', '`legacy`']) {
      expect(plan).toContain(field);
    }

    expect(plan).toContain('Proof `strength` should remain derived by the semantic analyzer');
    expect(plan).toContain('hadara evidence migrate --task T-XXXX --to v2 --json');
    expect(plan).toContain('Dry-run default');
    expect(plan).toContain('Execute guard');
    expect(plan).toContain('Mixed-version tolerance');
    expect(plan).toContain('No automatic rewrite of existing `evidence.jsonl`.');
    expect(plan).toContain('No automatic rewrite of existing `EVIDENCE.md`.');
    expect(plan).toContain('No acceptance of free-text failed-evidence resolution words as semantic resolution.');

    expect(schemas).toContain('docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md');
    expect(schemas).toContain('must not imply that existing v1 evidence has already been migrated');
    expect(tests).toContain('dual-read v1/v2 normalization');
    expect(tests).toContain('hash-guarded execute behavior');
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface SchemaIndex {
  schemaVersion: string;
  schemas: Array<{
    id: string;
    path: string;
    status: string;
    owner: string;
    notes: string;
  }>;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

describe('schema fixtures', () => {
  it('keeps the schema index aligned with parseable JSON Schema fixtures', () => {
    const root = process.cwd();
    const index = readJson<SchemaIndex>(path.join(root, 'src', 'schemas', 'schema-index.json'));

    expect(index.schemaVersion).toBe('hadara.schema.index.v1');
    expect(index.schemas.map((entry) => entry.id).sort()).toEqual([
      'hadara.active_run.projection.v1',
      'hadara.active_run.resume.v1',
      'hadara.context.export.v1',
      'hadara.event.v1',
      'hadara.evidence.list.v1',
      'hadara.privateEvidence.v1',
      'hadara.releaseGate.v1',
      'hadara.tools.list.v1'
    ]);

    for (const entry of index.schemas) {
      const schemaPath = path.join(root, entry.path);
      expect(fs.existsSync(schemaPath), `${entry.path} should exist`).toBe(true);
      const schema = readJson<Record<string, any>>(schemaPath);
      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
      expect(schema.$id).toBe(entry.id);
      expect(schema['x-hadara-schema-id']).toBe(entry.id);
      expect(schema.properties?.schemaVersion?.const).toBe(entry.id);
      expect(schema.required).toContain('schemaVersion');
      if (schema.properties?.command) {
        expect(schema.required).toContain('command');
        expect(schema.required).toContain('issues');
      }
      expect(entry.status).toBe('fixture');
      expect(entry.owner).toMatch(/^[a-z-]+\/[a-z-]+/);
    }
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('schema stability classification docs', () => {
  it('documents field stability classes and classifies task workbench compatibility aliases', () => {
    const root = process.cwd();
    const docs = fs.readFileSync(path.join(root, 'docs', 'SCHEMAS.md'), 'utf8');
    const schema = JSON.parse(fs.readFileSync(path.join(root, 'src', 'schemas', 'task-workbench.schema.json'), 'utf8')) as {
      'x-hadara-field-classes'?: {
        stable?: string[];
        compatibilityAlias?: Array<{ field: string; preferred: string }>;
        additive?: string[];
        experimental?: string[];
        deprecated?: string[];
      };
    };

    for (const label of ['Stable', 'Additive', 'Compatibility alias', 'Deprecated', 'Experimental']) {
      expect(docs).toContain(`| ${label} |`);
    }
    expect(docs).toContain('`state.closed` | Compatibility alias | `state.closedValid`');
    expect(schema['x-hadara-field-classes']?.stable).toContain('state.closedValid');
    expect(schema['x-hadara-field-classes']?.stable).toContain('state.closeState');
    expect(schema['x-hadara-field-classes']?.compatibilityAlias).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'state.closed', preferred: 'state.closedValid' })])
    );
    expect(schema['x-hadara-field-classes']?.additive).toContain('sources.*');
    expect(schema['x-hadara-field-classes']?.experimental).toContain('generatedAt');
    expect(schema['x-hadara-field-classes']?.deprecated).toEqual([]);
  });
});

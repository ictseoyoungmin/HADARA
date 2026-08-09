import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listCommandRegistryEntries } from '../../src/services/capability-registry';

const root = process.cwd();

describe('HADARA-dev archive boundary', () => {
  it('keeps only current and future version lines in docs/specs', () => {
    const specsPath = path.join(root, 'docs', 'specs');
    const entries = fs.existsSync(specsPath) ? fs.readdirSync(specsPath).sort() : [];

    expect(entries).toEqual(['0.5.0-rc2', '0.5.0-rc3']);
  });

  it('preserves completed committed spec lines under docs/archive', () => {
    for (const directory of ['0.3.0', '0.3.1', '0.3.3', '0.3.4', '0.4.0', 'agent-ux', 'rc3-proof-reliability']) {
      expect(fs.statSync(path.join(root, 'docs', 'archive', 'specs', directory)).isDirectory()).toBe(true);
    }
    expect(fs.existsSync(path.join(root, 'docs', 'archive', 'history', 'REFACTOR_LOG.md'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs', 'archive', 'README.md'), 'utf8')).toContain('Archive files are never default required reading.');
  });

  it('keeps command registry document links resolvable after archival', () => {
    const linkedArchivePaths = listCommandRegistryEntries()
      .flatMap((entry) => entry.docs)
      .filter((documentPath) => documentPath.startsWith('docs/archive/'));

    expect(linkedArchivePaths.length).toBeGreaterThan(0);
    for (const documentPath of linkedArchivePaths) {
      expect(fs.existsSync(path.join(root, documentPath)), documentPath).toBe(true);
    }
  });
});

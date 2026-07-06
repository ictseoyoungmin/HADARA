import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  diffCommandIds,
  diffRoutingParity,
  extractDispatcherCaseTokens,
  extractRegistryTopLevelVerbs,
  findInstalledPackageRoot
} from '../../src/services/command-surface-drift';
import { listCommandRegistryEntries } from '../../src/services/capability-registry';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('command surface drift helpers (FD-011)', () => {
  it('reports ids missing from the installed artifact', () => {
    const diff = diffCommandIds(['a', 'b', 'c'], ['a', 'c']);
    expect(diff).toEqual({ ok: false, missingFromInstalled: ['b'], extraInInstalled: [] });
  });

  it('reports ids only present in the installed artifact', () => {
    const diff = diffCommandIds(['a'], ['a', 'ghost.command']);
    expect(diff).toEqual({ ok: false, missingFromInstalled: [], extraInInstalled: ['ghost.command'] });
  });

  it('passes when id sets match regardless of order', () => {
    expect(diffCommandIds(['b', 'a'], ['a', 'b']).ok).toBe(true);
  });

  it('extracts dispatcher case tokens from compiled and source dispatchers', () => {
    const compiled = "switch (command) {\n  case 'help': {\n  case \"run-state\": {\n  default:\n}";
    expect(extractDispatcherCaseTokens(compiled)).toEqual(['help', 'run-state']);
  });

  it('extracts top-level verbs from registry command patterns', () => {
    expect(
      extractRegistryTopLevelVerbs([
        'hadara docs mark --path <path>',
        'hadara docs register --path <path>',
        'hadara task finalize --task <task-id>',
        'not-a-hadara-pattern'
      ])
    ).toEqual(['docs', 'task']);
  });

  it('reports routing parity failures in both directions', () => {
    const parity = diffRoutingParity(['docs', 'task', 'lost'], ['docs', 'task', 'phantom']);
    expect(parity).toEqual({
      ok: false,
      registryVerbsWithoutRouting: ['lost'],
      routedVerbsWithoutRegistry: ['phantom']
    });
  });

  it('locates installed package roots in posix and windows npm prefix layouts', () => {
    const prefix = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-drift-prefix-'));
    roots.push(prefix);
    expect(findInstalledPackageRoot(prefix)).toBeNull();
    const posixRoot = path.join(prefix, 'lib', 'node_modules', 'hadara');
    fs.mkdirSync(posixRoot, { recursive: true });
    fs.writeFileSync(path.join(posixRoot, 'package.json'), '{}', 'utf8');
    expect(findInstalledPackageRoot(prefix)).toBe(posixRoot);
  });

  it('holds routing parity between the source registry and the source dispatcher (no drift on main)', () => {
    const dispatcherSource = fs.readFileSync(path.join(process.cwd(), 'src', 'cli', 'main.ts'), 'utf8');
    const tokens = extractDispatcherCaseTokens(dispatcherSource);
    const verbs = extractRegistryTopLevelVerbs(listCommandRegistryEntries().map((entry) => entry.command));
    const parity = diffRoutingParity(verbs, tokens);
    expect(parity.registryVerbsWithoutRouting).toEqual([]);
    expect(parity.routedVerbsWithoutRegistry).toEqual([]);
  });
});

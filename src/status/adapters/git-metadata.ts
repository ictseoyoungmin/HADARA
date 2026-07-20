import { spawnSync } from 'node:child_process';
import type { FactRecord } from '../model';
import { invalidFact, presentFact } from '../model';

export interface GitWorkspaceChange {
  status: 'added' | 'modified' | 'deleted' | 'renamed' | 'untracked' | 'unknown';
  path: string;
  renamedFrom?: string;
}

/**
 * Bounded, read-only `git status --porcelain` snapshot. Never mutates the workspace.
 * `unavailable` (not `invalid`) when git itself cannot run, so callers can degrade instead of failing.
 */
export function readGitWorkspaceChangesFact(projectRoot: string, factKey = 'workspace.gitChanges'): FactRecord<GitWorkspaceChange[]> {
  const source = { sourceId: 'git-workspace', adapter: 'git-metadata' };
  const result = spawnSync('git', ['status', '--porcelain=v1', '--find-renames'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 5_000
  });
  if (result.error || result.status !== 0) {
    return invalidFact(factKey, source);
  }
  const changes = result.stdout
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map(parsePorcelainLine);
  return presentFact(factKey, changes, source, { authority: 'observed' });
}

function parsePorcelainLine(line: string): GitWorkspaceChange {
  const code = line.slice(0, 2);
  const rest = line.slice(3);
  if (code.includes('R')) {
    const [from, to] = rest.split(' -> ');
    return { status: 'renamed', path: to ?? rest, renamedFrom: from };
  }
  if (code.includes('A')) return { status: 'added', path: rest };
  if (code.includes('D')) return { status: 'deleted', path: rest };
  if (code === '??') return { status: 'untracked', path: rest };
  if (code.includes('M')) return { status: 'modified', path: rest };
  return { status: 'unknown', path: rest };
}

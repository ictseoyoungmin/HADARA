import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import type { InitIssue, InitWriteOperation } from './types';

export function readProjectText(projectRoot: string, relativePath: string): string | null {
  const fullPath = path.join(projectRoot, relativePath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : null;
}

export function writeFilesAtomically(projectRoot: string, writes: InitWriteOperation[]): InitIssue[] {
  if (writes.length === 0) return [];
  const prepared: Array<{ relativePath: string; target: string; tmp: string; existed: boolean; original: string | null }> = [];
  const committed: typeof prepared = [];
  try {
    for (const write of writes) {
      const target = path.join(projectRoot, write.path);
      ensureDir(path.dirname(target));
      const tmp = path.join(path.dirname(target), `.hadara-tmp-${process.pid}-${Date.now()}-${path.basename(target)}`);
      prepared.push({
        relativePath: write.path,
        target,
        tmp,
        existed: fs.existsSync(target),
        original: fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null
      });
      fs.writeFileSync(tmp, write.content, { encoding: 'utf8', flag: 'wx' });
    }
    for (const item of prepared) {
      fs.renameSync(item.tmp, item.target);
      committed.push(item);
    }
    return [];
  } catch (error) {
    for (const item of prepared) {
      if (fs.existsSync(item.tmp)) fs.rmSync(item.tmp, { force: true });
    }
    for (const item of committed.reverse()) {
      try {
        if (item.existed && item.original !== null) {
          fs.writeFileSync(item.target, item.original, 'utf8');
        } else {
          fs.rmSync(item.target, { force: true });
        }
      } catch {
        // The returned issue tells the operator to inspect paths before retrying.
      }
    }
    const failedPath = prepared.find((item) => fs.existsSync(item.tmp))?.relativePath ?? writes[0]?.path;
    return [{
      severity: 'error',
      code: 'INIT_ATOMIC_WRITE_FAILED',
      path: failedPath,
      message: `Atomic write failed and rollback was attempted. Inspect generated files before retrying. Cause: ${error instanceof Error ? error.message : String(error)}`
    }];
  }
}

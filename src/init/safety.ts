import fs from 'node:fs';
import path from 'node:path';
import type { InitIssue } from './types';

const SKIP_DESCENDANTS = new Set(['.git', '.hadara', 'node_modules']);

export function validateInitPaths(projectRoot: string, targetPaths: string[]): InitIssue[] {
  const issues: InitIssue[] = [];
  const root = path.resolve(projectRoot);
  if (fs.existsSync(root) && fs.lstatSync(root).isSymbolicLink()) {
    issues.push(issue('INIT_SYMLINK_ESCAPE', '.', 'The project root must not be a symlink.'));
    return issues;
  }
  const ancestor = findAncestorProject(root);
  if (ancestor) {
    issues.push(issue('INIT_NESTED_PROJECT_UNSUPPORTED', '.', `Ancestor HADARA project found at ${ancestor}.`));
  }
  const descendantScan = findDescendantProject(root);
  if (descendantScan.found) {
    issues.push(issue('INIT_NESTED_PROJECT_UNSUPPORTED', descendantScan.found, 'A descendant HADARA project cannot be merged into this init root.'));
  } else if (descendantScan.incomplete) {
    issues.push(issue(
      'INIT_NESTED_PROJECT_SCAN_INCOMPLETE',
      '.',
      'The descendant HADARA project scan stopped before inspecting the entire directory tree; init cannot verify no nested project exists.'
    ));
  }
  for (const targetPath of targetPaths) {
    const normalized = targetPath.replaceAll('\\', '/');
    const absolute = path.resolve(root, normalized);
    const relative = path.relative(root, absolute);
    if (
      normalized.startsWith('/')
      || /^[A-Za-z]:\//.test(normalized)
      || relative.startsWith('..')
      || path.isAbsolute(relative)
      || normalized.split('/').includes('..')
    ) {
      issues.push(issue('INIT_PATH_OUTSIDE_ROOT', targetPath, `Init target escapes the project root: ${targetPath}.`));
      continue;
    }
    issues.push(...validateExistingSegments(root, normalized));
  }
  return dedupeIssues(issues);
}

function validateExistingSegments(root: string, relativePath: string): InitIssue[] {
  const issues: InitIssue[] = [];
  let current = root;
  for (const segment of relativePath.split('/').filter(Boolean)) {
    if (!fs.existsSync(current) || !fs.lstatSync(current).isDirectory()) break;
    const collision = fs.readdirSync(current).find((entry) => entry.toLowerCase() === segment.toLowerCase() && entry !== segment);
    if (collision) {
      issues.push(issue(
        'INIT_PATH_CASE_COLLISION',
        relativePath,
        `Path ${relativePath} collides with existing case variant ${path.join(path.relative(root, current), collision).replaceAll('\\', '/')}.`
      ));
      break;
    }
    current = path.join(current, segment);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) {
      issues.push(issue('INIT_SYMLINK_ESCAPE', relativePath, `Init target traverses symlink ${path.relative(root, current).replaceAll('\\', '/')}.`));
      break;
    }
  }
  return issues;
}

function findAncestorProject(root: string): string | null {
  let current = path.dirname(root);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.hadara', 'project.json'))) return current;
    current = path.dirname(current);
  }
  return null;
}

const DESCENDANT_SCAN_LIMIT = 10000;

function findDescendantProject(root: string): { found: string | null; incomplete: boolean } {
  if (!fs.existsSync(root) || !fs.lstatSync(root).isDirectory()) return { found: null, incomplete: false };
  const queue = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_DESCENDANTS.has(entry.name))
    .map((entry) => path.join(root, entry.name));
  let inspected = 0;
  while (queue.length > 0 && inspected < DESCENDANT_SCAN_LIMIT) {
    const directory = queue.shift()!;
    inspected += 1;
    if (fs.existsSync(path.join(directory, '.hadara', 'project.json'))) {
      return { found: path.relative(root, directory).replaceAll('\\', '/'), incomplete: false };
    }
    try {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && !entry.isSymbolicLink() && !SKIP_DESCENDANTS.has(entry.name)) {
          queue.push(path.join(directory, entry.name));
        }
      }
    } catch {
      // Unreadable descendants are not write targets; target-specific checks still fail closed.
    }
  }
  // Hitting the cap with directories still queued means the tree was not
  // fully inspected. Reporting "no nested project" here would be an
  // unverified guess, not a fact; fail closed instead of proceeding as if
  // the scan had completed.
  return { found: null, incomplete: queue.length > 0 };
}

function issue(code: string, issuePath: string, message: string): InitIssue {
  return { severity: 'error', code, path: issuePath, message };
}

function dedupeIssues(issues: InitIssue[]): InitIssue[] {
  const seen = new Set<string>();
  return issues.filter((candidate) => {
    const key = `${candidate.code}:${candidate.path ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

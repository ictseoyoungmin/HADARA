import fs from 'node:fs';
import path from 'node:path';
import type { FactRecord } from '../model';
import { invalidFact, missingFact, presentFact } from '../model';

export function resolveJsonPointer(document: unknown, pointer: string): { found: boolean; value: unknown } {
  if (pointer === '' || pointer === '/') return { found: true, value: document };
  const tokens = pointer.replace(/^\//, '').split('/').map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'));
  let current: unknown = document;
  for (const token of tokens) {
    if (current === null || typeof current !== 'object') return { found: false, value: undefined };
    const record = current as Record<string, unknown>;
    if (!(token in record)) return { found: false, value: undefined };
    current = record[token];
  }
  return { found: true, value: current };
}

export function readJsonDocumentFact<T = unknown>(
  projectRoot: string,
  factKey: string,
  sourceId: string,
  relativePath: string,
  pointer: string,
  options: { optional?: boolean } = {}
): FactRecord<T> {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = { sourceId, path: relativePath, selector: pointer, adapter: 'json-document' };
  if (!fs.existsSync(absolutePath)) {
    return options.optional ? missingFact(factKey, source) : missingFact(factKey, source, 'canonical');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch {
    return invalidFact(factKey, source, 'canonical');
  }
  const resolved = resolveJsonPointer(parsed, pointer);
  if (!resolved.found || resolved.value === undefined || resolved.value === null) {
    return missingFact(factKey, source);
  }
  return presentFact(factKey, resolved.value as T, source, { authority: 'canonical' });
}

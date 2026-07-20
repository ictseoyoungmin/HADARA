import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, parseMarkdownRowsUnderHeading, type MarkdownTableRow } from '../../services/markdown-table';
import type { FactRecord } from '../model';
import { missingFact, presentFact } from '../model';

export function readMarkdownTableFact(
  projectRoot: string,
  factKey: string,
  sourceId: string,
  relativePath: string,
  options: { heading?: string; authority?: 'canonical' | 'declared' | 'projection' | 'fallback' | 'observed' } = {}
): FactRecord<MarkdownTableRow[]> {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = { sourceId, path: relativePath, selector: options.heading, adapter: 'markdown-table' };
  if (!fs.existsSync(absolutePath)) return missingFact(factKey, source);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const rows = options.heading ? parseMarkdownRowsUnderHeading(content, options.heading) : parseMarkdownRows(content);
  if (rows.length === 0) return missingFact(factKey, source);
  return presentFact(factKey, rows, source, { authority: options.authority ?? 'observed' });
}

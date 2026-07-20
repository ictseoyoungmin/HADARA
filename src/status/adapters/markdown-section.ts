import fs from 'node:fs';
import path from 'node:path';
import { readMarkdownSection } from '../../services/markdown-table';
import type { FactRecord } from '../model';
import { missingFact, presentFact } from '../model';

export function readMarkdownSectionFact(
  projectRoot: string,
  factKey: string,
  sourceId: string,
  relativePath: string,
  heading: string,
  options: { authority?: 'canonical' | 'declared' | 'projection' | 'fallback' | 'observed' } = {}
): FactRecord<string> {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = { sourceId, path: relativePath, selector: heading, adapter: 'markdown-section' };
  if (!fs.existsSync(absolutePath)) return missingFact(factKey, source);
  const body = readMarkdownSection(fs.readFileSync(absolutePath, 'utf8'), heading).trim();
  if (!body) return missingFact(factKey, source);
  return presentFact(factKey, body, source, { authority: options.authority ?? 'observed' });
}

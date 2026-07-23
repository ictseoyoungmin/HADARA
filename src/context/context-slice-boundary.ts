import path from 'node:path';
import { normalizeContextGraphPath } from './extractor-contract';

export const CONTEXT_SLICE_HADARA_ALLOWLIST = new Set([
  '.hadara/context/HADARA_CONTEXT.md',
  '.hadara/docs-registry.json'
]);

export const CONTEXT_SLICE_DENIED_PATHS = [
  '.git',
  'node_modules',
  '.hadara/tmp',
  '.hadara/run'
];

export function normalizeContextSliceInputPath(inputPath: string | undefined): string {
  return inputPath ? normalizeContextGraphPath(inputPath.replace(/^\.?\//, '')) : '';
}

export function isDeniedContextSlicePath(normalized: string): boolean {
  if (normalized.startsWith('.hadara/') && !CONTEXT_SLICE_HADARA_ALLOWLIST.has(normalized)) return true;
  return CONTEXT_SLICE_DENIED_PATHS.some((denied) => normalized === denied || normalized.startsWith(`${denied}/`));
}

export function isContextSliceProjectRelativePath(inputPath: string | undefined): boolean {
  const normalized = normalizeContextSliceInputPath(inputPath);
  return Boolean(normalized)
    && !path.isAbsolute(inputPath ?? '')
    && !normalized.split('/').includes('..')
    && !isDeniedContextSlicePath(normalized);
}

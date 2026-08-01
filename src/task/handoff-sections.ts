import { readMarkdownSection } from '../services/markdown-table';

export type HandoffContinuationPhase = 'pre-close' | 'post-close';

export const HANDOFF_PRE_CLOSE_HEADING = '## Pre-Close Operator Action';
export const HANDOFF_POST_CLOSE_HEADING = '## Post-Close Continuation';
export const HANDOFF_LEGACY_HEADING = '## Next Recommended Step';

export function readHandoffContinuationSection(content: string, phase: HandoffContinuationPhase): {
  heading: string;
  content: string;
  legacy: boolean;
} {
  const canonicalHeading = phase === 'post-close' ? HANDOFF_POST_CLOSE_HEADING : HANDOFF_PRE_CLOSE_HEADING;
  if (hasHeading(content, canonicalHeading)) {
    return { heading: canonicalHeading, content: readMarkdownSection(content, canonicalHeading), legacy: false };
  }
  return {
    heading: HANDOFF_LEGACY_HEADING,
    content: readMarkdownSection(content, HANDOFF_LEGACY_HEADING),
    legacy: true
  };
}

function hasHeading(content: string, heading: string): boolean {
  return new RegExp(`^${escapeRegExp(heading)}\\s*$`, 'm').test(content);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

import fs from 'node:fs';
import path from 'node:path';
import { createManualRemediation } from './protocol-remediation';

export type ProtocolProfile = 'basic' | 'standard' | 'governed' | 'unknown' | 'mixed';
export type TargetProtocolProfile = 'basic' | 'standard' | 'governed';

export interface ProfileDiagnosticIssue {
  code: string;
  severity: 'error' | 'warning' | 'info';
  area: 'profile' | 'docs' | 'task' | 'evidence' | 'handoff' | 'validation' | 'required-reading';
  path?: string;
  taskId?: string;
  message: string;
  expected?: string;
  actual?: string;
  remediationId?: string;
}

export interface ProfileDiagnosticRemediation {
  id: string;
  issueIds: string[];
  title: string;
  mode: 'manual' | 'safe-auto' | 'unsafe-auto';
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
}

export interface ProfileDiagnostics {
  detectedProfile: ProtocolProfile;
  declaredProfile: ProtocolProfile;
  targetProfile: TargetProtocolProfile | 'unknown';
  profileSummary: ProtocolProfileSummary;
  checkedDocs: Set<string>;
  issues: ProfileDiagnosticIssue[];
  remediations: ProfileDiagnosticRemediation[];
}

export interface ProtocolProfileSummary {
  declared: ProtocolProfile;
  detected: ProtocolProfile;
  target: TargetProtocolProfile | 'unknown';
  source: 'metadata-and-docset';
}

const CORE_PROJECT_DOCS = ['AGENTS.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/IMPLEMENTATION_SOP.md'];
const STANDARD_PROJECT_DOCS = ['docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md'];
const GOVERNED_PROJECT_DOCS = ['docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'];

export function createProfileConsistencyDiagnostics(projectRoot: string): ProfileDiagnostics {
  const checkedDocs = new Set<string>();
  const issues: ProfileDiagnosticIssue[] = [];
  const docSet = getProfileDocSet(projectRoot);
  const metadata = readProfileMetadata(projectRoot);
  const detectedProfile = detectProfileFromDocSet(docSet);
  const declaredProfile = inferDeclaredProfile(metadata);
  const targetProfile = inferTargetProfile(docSet, declaredProfile);
  const profileSummary = {
    declared: declaredProfile,
    detected: detectedProfile,
    target: targetProfile,
    source: 'metadata-and-docset' as const
  };
  const requiredDocs = targetProfile === 'unknown' ? CORE_PROJECT_DOCS : requiredDocsForProfile(targetProfile);
  const missingTargetDocs = requiredDocs.filter((relativePath) => !exists(projectRoot, relativePath));

  for (const relativePath of new Set([...CORE_PROJECT_DOCS, ...STANDARD_PROJECT_DOCS, ...GOVERNED_PROJECT_DOCS])) {
    checkedDocs.add(relativePath);
  }

  if (detectedProfile === 'mixed') {
    issues.push({
      code: 'PROFILE_DOC_SET_MIXED',
      severity: 'warning',
      area: 'profile',
      message: 'Project profile document set is mixed or partial.',
      expected: targetProfile === 'unknown' ? 'complete basic, standard, or governed doc set' : `complete ${targetProfile} doc set`,
      actual: describeDocSet(docSet),
      remediationId: 'profile-doc-set-complete'
    });
  }

  for (const relativePath of missingTargetDocs) {
    issues.push({
      code: 'PROFILE_REQUIRED_DOC_MISSING',
      severity: 'warning',
      area: 'docs',
      path: relativePath,
      message: `Profile target ${targetProfile} expects a missing protocol document: ${relativePath}`,
      expected: `${relativePath} present`,
      actual: 'missing',
      remediationId: 'profile-doc-set-complete'
    });
  }

  const metadataTargets = [
    { path: 'docs/PROJECT_STATE.md', actual: metadata.projectState },
    { path: 'docs/IMPLEMENTATION_SOP.md', actual: metadata.sop }
  ];

  if (targetProfile !== 'unknown') {
    for (const item of metadataTargets) {
      if (!exists(projectRoot, item.path)) continue;
      checkedDocs.add(item.path);
      if (!item.actual) {
        issues.push({
          code: 'PROFILE_METADATA_MISSING',
          severity: 'warning',
          area: 'profile',
          path: item.path,
          message: `${item.path} does not declare the HADARA profile.`,
          expected: targetProfile,
          actual: 'missing',
          remediationId: 'profile-metadata-align'
        });
      } else if (item.actual !== targetProfile) {
        issues.push({
          code: 'PROFILE_METADATA_DRIFT',
          severity: 'warning',
          area: 'profile',
          path: item.path,
          message: `${item.path} declares ${item.actual} while metadata and project docs target ${targetProfile}.`,
          expected: targetProfile,
          actual: item.actual,
          remediationId: 'profile-metadata-align'
        });
      }
    }

    const requiredReadingDocs = requiredReadingDocsForProfile(targetProfile);
    const sopMissing = missingRequiredReadingPaths(projectRoot, 'docs/IMPLEMENTATION_SOP.md', requiredReadingDocs);
    if (sopMissing.length > 0) {
      issues.push({
        code: 'PROFILE_REQUIRED_READING_DRIFT',
        severity: 'warning',
        area: 'required-reading',
        path: 'docs/IMPLEMENTATION_SOP.md',
        message: `SOP Required Reading is missing ${targetProfile} profile paths.`,
        expected: sopMissing.join(', '),
        actual: 'not listed',
        remediationId: 'profile-metadata-align'
      });
    }

    const agentsMissing = missingRequiredReadingPaths(projectRoot, 'AGENTS.md', requiredReadingDocs);
    if (agentsMissing.length > 0) {
      issues.push({
        code: 'PROFILE_REQUIRED_READING_DRIFT',
        severity: 'warning',
        area: 'required-reading',
        path: 'AGENTS.md',
        message: `AGENTS Required Reading is missing ${targetProfile} profile paths.`,
        expected: agentsMissing.join(', '),
        actual: 'not listed',
        remediationId: 'profile-metadata-align'
      });
    }
  }

  const remediations = buildProfileRemediations(targetProfile, missingTargetDocs, issues);
  return { detectedProfile, declaredProfile, targetProfile, profileSummary, checkedDocs, issues, remediations };
}

export function createProtocolProfileSummary(projectRoot: string): ProtocolProfileSummary {
  const docSet = getProfileDocSet(projectRoot);
  const metadata = readProfileMetadata(projectRoot);
  const detected = detectProfileFromDocSet(docSet);
  const declared = inferDeclaredProfile(metadata);
  return {
    declared,
    detected,
    target: inferTargetProfile(docSet, declared),
    source: 'metadata-and-docset'
  };
}

function buildProfileRemediations(
  targetProfile: TargetProtocolProfile | 'unknown',
  missingTargetDocs: string[],
  issues: ProfileDiagnosticIssue[]
): ProfileDiagnosticRemediation[] {
  if (targetProfile === 'unknown' || issues.length === 0) return [];
  const remediations: ProfileDiagnosticRemediation[] = [];
  const docSetIssues = issues.filter((issue) => issue.remediationId === 'profile-doc-set-complete');
  const metadataIssues = issues.filter((issue) => issue.remediationId === 'profile-metadata-align');

  if (docSetIssues.length > 0) {
    remediations.push(
      createManualRemediation({
        id: 'profile-doc-set-complete',
        title: `Complete the ${targetProfile} profile document set`,
        command: `hadara init upgrade --profile ${targetProfile} --json`,
        targetPaths: missingTargetDocs,
        summary: `The project contains partial ${targetProfile} profile evidence. Review the upgrade dry-run and create the missing profile docs before treating the profile as consistent.`,
        steps: [
          `Run \`hadara init upgrade --profile ${targetProfile} --json\` to preview the profile expansion.`,
          'Review the listed document additions and confirm they are appropriate for this repository.',
          `Create or merge the missing documents: ${missingTargetDocs.join(', ') || 'none'}.`,
          'Re-run `hadara protocol doctor --scope profile --json` and confirm the doc-set issues are gone.'
        ]
      })
    );
  }

  if (metadataIssues.length > 0) {
    const targets = Array.from(new Set(metadataIssues.map((issue) => issue.path).filter((value): value is string => Boolean(value))));
    remediations.push(
      createManualRemediation({
        id: 'profile-metadata-align',
        title: `Align project metadata to the ${targetProfile} profile`,
        command: `hadara init upgrade --profile ${targetProfile} --json`,
        targetPaths: targets,
        summary: `Project metadata or Required Reading does not match the ${targetProfile} profile implied by the protocol documents.`,
        steps: [
          `Run \`hadara init upgrade --profile ${targetProfile} --json\` and review the dry-run merge plan.`,
          `In \`docs/PROJECT_STATE.md\`, set the HADARA profile metadata to \`${targetProfile}\`.`,
          `In \`docs/IMPLEMENTATION_SOP.md\`, update the profile sentence and Required Reading table for \`${targetProfile}\`.`,
          `In \`AGENTS.md\`, add Required Reading entries for the \`${targetProfile}\` profile documents.`,
          'Re-run `hadara protocol doctor --scope profile --json` before using an execute-mode remediation command.'
        ],
        preview: {
          before: 'basic or missing profile metadata',
          after: targetProfile
        }
      })
    );
  }

  return remediations;
}

function getProfileDocSet(projectRoot: string): {
  core: { present: string[]; missing: string[] };
  standard: { present: string[]; missing: string[] };
  governed: { present: string[]; missing: string[] };
} {
  return {
    core: splitDocPresence(projectRoot, CORE_PROJECT_DOCS),
    standard: splitDocPresence(projectRoot, STANDARD_PROJECT_DOCS),
    governed: splitDocPresence(projectRoot, GOVERNED_PROJECT_DOCS)
  };
}

function detectProfileFromDocSet(docSet: ReturnType<typeof getProfileDocSet>): ProtocolProfile {
  const standardAny = docSet.standard.present.length > 0;
  const standardComplete = docSet.standard.missing.length === 0;
  const governedAny = docSet.governed.present.length > 0;
  const governedComplete = docSet.governed.missing.length === 0;
  const coreAny = docSet.core.present.length > 0;
  if (governedAny) return governedComplete && standardComplete ? 'governed' : 'mixed';
  if (standardAny) return standardComplete ? 'standard' : 'mixed';
  if (coreAny) return 'basic';
  return 'unknown';
}

function inferTargetProfile(docSet: ReturnType<typeof getProfileDocSet>, declaredProfile: ProtocolProfile): TargetProtocolProfile | 'unknown' {
  const candidates = [highestDocSetProfile(docSet), declaredProfile].filter(
    (profile): profile is TargetProtocolProfile => profile === 'basic' || profile === 'standard' || profile === 'governed'
  );
  return candidates.sort((a, b) => profileRank(b) - profileRank(a))[0] ?? 'unknown';
}

function highestDocSetProfile(docSet: ReturnType<typeof getProfileDocSet>): TargetProtocolProfile | 'unknown' {
  if (docSet.governed.present.length > 0) return 'governed';
  if (docSet.standard.present.length > 0) return 'standard';
  if (docSet.core.present.length > 0) return 'basic';
  return 'unknown';
}

function requiredDocsForProfile(profile: TargetProtocolProfile): string[] {
  if (profile === 'governed') return [...CORE_PROJECT_DOCS, ...STANDARD_PROJECT_DOCS, ...GOVERNED_PROJECT_DOCS];
  if (profile === 'standard') return [...CORE_PROJECT_DOCS, ...STANDARD_PROJECT_DOCS];
  return CORE_PROJECT_DOCS;
}

function requiredReadingDocsForProfile(profile: TargetProtocolProfile): string[] {
  return requiredDocsForProfile(profile).filter((relativePath) => relativePath !== 'AGENTS.md');
}

function readProfileMetadata(projectRoot: string): { projectState: TargetProtocolProfile | null; sop: TargetProtocolProfile | null } {
  return {
    projectState: readProjectStateProfile(projectRoot),
    sop: readSopProfile(projectRoot)
  };
}

function inferDeclaredProfile(metadata: { projectState: TargetProtocolProfile | null; sop: TargetProtocolProfile | null }): ProtocolProfile {
  const declared = [metadata.projectState, metadata.sop].filter((profile): profile is TargetProtocolProfile => Boolean(profile));
  if (declared.length === 0) return 'unknown';
  if (new Set(declared).size > 1) return 'mixed';
  return declared[0];
}

function readProjectStateProfile(projectRoot: string): TargetProtocolProfile | null {
  const relativePath = 'docs/PROJECT_STATE.md';
  if (!exists(projectRoot, relativePath)) return null;
  const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
  for (const row of parseMarkdownRows(content)) {
    if (!/^hadara profile$/i.test(row[0] ?? '')) continue;
    return normalizeProfile(row.slice(1).join(' '));
  }
  return normalizeProfile(firstMatch(content, /HADARA\s+Profile\s*[:|]\s*`?(basic|standard|governed)`?/i));
}

function readSopProfile(projectRoot: string): TargetProtocolProfile | null {
  const relativePath = 'docs/IMPLEMENTATION_SOP.md';
  if (!exists(projectRoot, relativePath)) return null;
  const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
  return (
    normalizeProfile(firstMatch(content, /(?:initialized with|uses|operates as)\s+(?:the\s+)?`?(basic|standard|governed)`?\s+HADARA profile/i)) ??
    normalizeProfile(firstMatch(content, /HADARA profile\s*[:|]\s*`?(basic|standard|governed)`?/i))
  );
}

function missingRequiredReadingPaths(projectRoot: string, relativePath: string, requiredPaths: string[]): string[] {
  if (!exists(projectRoot, relativePath)) return requiredPaths;
  const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
  const requiredReading = readMarkdownSection(content, '## Required Reading');
  const listedPaths = new Set(parseMarkdownRows(requiredReading).flatMap((row) => row.flatMap((cell) => [...cell.matchAll(/`([^`]+)`/g)].map((match) => match[1]))));
  return requiredPaths.filter((requiredPath) => !listedPaths.has(requiredPath));
}

function describeDocSet(docSet: ReturnType<typeof getProfileDocSet>): string {
  return [
    `core missing: ${docSet.core.missing.join(', ') || 'none'}`,
    `standard missing: ${docSet.standard.missing.join(', ') || 'none'}`,
    `governed missing: ${docSet.governed.missing.join(', ') || 'none'}`
  ].join('; ');
}

function splitDocPresence(projectRoot: string, relativePaths: string[]): { present: string[]; missing: string[] } {
  const present: string[] = [];
  const missing: string[] = [];
  for (const relativePath of relativePaths) {
    (exists(projectRoot, relativePath) ? present : missing).push(relativePath);
  }
  return { present, missing };
}

function exists(projectRoot: string, relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function firstMatch(content: string, pattern: RegExp): string | null {
  return content.match(pattern)?.[1] ?? null;
}

function normalizeProfile(value: string | null | undefined): TargetProtocolProfile | null {
  const normalized = value?.trim().replace(/`/g, '').toLowerCase();
  return normalized === 'basic' || normalized === 'standard' || normalized === 'governed' ? normalized : null;
}

function profileRank(profile: TargetProtocolProfile): number {
  if (profile === 'governed') return 3;
  if (profile === 'standard') return 2;
  return 1;
}

function readMarkdownSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}

function parseMarkdownRows(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim())
    );
}

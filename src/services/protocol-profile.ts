import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, readMarkdownSection } from './markdown-table';
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

const CORE_PROJECT_DOCS = ['AGENTS.md', 'docs/TASK_BOARD.md', 'docs/HADARA_WORKFLOW.md'];
const STANDARD_MINIMAL_DOCS = ['.hadara/context/HADARA_CONTEXT.md'];
const GOVERNED_MINIMAL_DOCS: string[] = [];
const OPTIONAL_PROJECT_DOCS = ['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md', 'docs/SECURITY_MODEL.md'];

export function createProfileConsistencyDiagnostics(projectRoot: string): ProfileDiagnostics {
  const checkedDocs = new Set<string>();
  const issues: ProfileDiagnosticIssue[] = [];
  const standardMinimalDocs = standardMinimalDocsForProject(projectRoot);
  const docSet = getProfileDocSet(projectRoot, standardMinimalDocs);
  const metadata = readProfileMetadata(projectRoot);
  const declaredProfile = inferDeclaredProfile(metadata);
  const detectedProfile = declaredProfile === 'unknown' ? detectProfileFromDocSet(docSet) : declaredProfile;
  const targetProfile = inferTargetProfile(docSet, declaredProfile);
  const profileSummary = {
    declared: declaredProfile,
    detected: detectedProfile,
    target: targetProfile,
    source: 'metadata-and-docset' as const
  };
  const requiredDocs = targetProfile === 'unknown' ? CORE_PROJECT_DOCS : requiredDocsForProfile(targetProfile, standardMinimalDocs);
  const missingTargetDocs = requiredDocs.filter((relativePath) => !exists(projectRoot, relativePath));

  for (const relativePath of new Set([...CORE_PROJECT_DOCS, ...standardMinimalDocs, ...GOVERNED_MINIMAL_DOCS, ...OPTIONAL_PROJECT_DOCS])) {
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

  if (targetProfile !== 'unknown') {
    const requiredReadingDocs = requiredReadingDocsForProfile(targetProfile, standardMinimalDocs);
    const agentsMissing = missingRequiredReadingPaths(projectRoot, 'AGENTS.md', requiredReadingDocs);
    if (agentsMissing.length > 0) {
      issues.push({
        code: 'PROFILE_REQUIRED_READING_DRIFT',
        severity: 'warning',
        area: 'required-reading',
        path: 'AGENTS.md',
      message: `AGENTS Required Reading is missing generated or present ${targetProfile} profile paths.`,
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
  const docSet = getProfileDocSet(projectRoot, standardMinimalDocsForProject(projectRoot));
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
        command: 'hadara protocol doctor --scope profile --json',
        targetPaths: missingTargetDocs,
        summary: `The project contains partial ${targetProfile} profile evidence. Review the upgrade dry-run and create the missing profile docs before treating the profile as consistent.`,
        steps: [
          'Review the profile diagnostic and confirm the intended project configuration.',
          'Use an explicit project configuration workflow; init upgrade does not change profiles or create optional document packs.',
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
        command: 'hadara protocol doctor --scope profile --json',
        targetPaths: targets,
        summary: `Project metadata or Required Reading does not match the ${targetProfile} profile implied by the protocol documents.`,
        steps: [
          'Review the profile diagnostic; init upgrade does not change project configuration.',
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

function getProfileDocSet(projectRoot: string, standardMinimalDocs: string[] = STANDARD_MINIMAL_DOCS): {
  core: { present: string[]; missing: string[] };
  governedMinimal: { present: string[]; missing: string[] };
  standard: { present: string[]; missing: string[] };
  governed: { present: string[]; missing: string[] };
} {
  return {
    core: splitDocPresence(projectRoot, CORE_PROJECT_DOCS),
    governedMinimal: splitDocPresence(projectRoot, GOVERNED_MINIMAL_DOCS),
    standard: splitDocPresence(projectRoot, standardMinimalDocs),
    governed: splitDocPresence(projectRoot, [])
  };
}

function detectProfileFromDocSet(docSet: ReturnType<typeof getProfileDocSet>): ProtocolProfile {
  const standardAny = docSet.standard.present.length > 0;
  const governedAny = docSet.governedMinimal.present.length > 0 || docSet.governed.present.length > 0;
  const coreAny = docSet.core.present.length > 0;
  if (governedAny) return 'governed';
  if (standardAny) return 'standard';
  if (coreAny) return 'basic';
  return 'unknown';
}

function inferTargetProfile(docSet: ReturnType<typeof getProfileDocSet>, declaredProfile: ProtocolProfile): TargetProtocolProfile | 'unknown' {
  if (declaredProfile === 'basic' || declaredProfile === 'standard' || declaredProfile === 'governed') return declaredProfile;
  return highestDocSetProfile(docSet);
}

function highestDocSetProfile(docSet: ReturnType<typeof getProfileDocSet>): TargetProtocolProfile | 'unknown' {
  if (docSet.governedMinimal.present.length > 0 || docSet.governed.present.length > 0) return 'governed';
  if (docSet.standard.present.length > 0) return 'standard';
  if (docSet.core.present.length > 0) return 'basic';
  return 'unknown';
}

function requiredDocsForProfile(profile: TargetProtocolProfile, standardMinimalDocs: string[] = STANDARD_MINIMAL_DOCS): string[] {
  const docs = [...CORE_PROJECT_DOCS];
  if (profile === 'standard' || profile === 'governed') docs.push(...standardMinimalDocs);
  if (profile === 'governed') docs.push(...GOVERNED_MINIMAL_DOCS);
  return Array.from(new Set(docs));
}

function requiredReadingDocsForProfile(profile: TargetProtocolProfile, standardMinimalDocs: string[] = STANDARD_MINIMAL_DOCS): string[] {
  return requiredDocsForProfile(profile, standardMinimalDocs).filter((relativePath) => relativePath !== 'AGENTS.md' && relativePath !== 'docs/REFACTOR_LOG.md');
}

function standardMinimalDocsForProject(projectRoot: string): string[] {
  return fs.existsSync(path.join(projectRoot, '.hadara', 'project.json'))
    ? ['.hadara/context/READ_MAP.md']
    : STANDARD_MINIMAL_DOCS;
}

function readProfileMetadata(projectRoot: string): { scaffold: TargetProtocolProfile | null } {
  return {
    scaffold: readScaffoldProfile(projectRoot)
  };
}

function inferDeclaredProfile(metadata: { scaffold: TargetProtocolProfile | null }): ProtocolProfile {
  return metadata.scaffold ?? 'unknown';
}

function readScaffoldProfile(projectRoot: string): TargetProtocolProfile | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(projectRoot, '.hadara', 'scaffold.json'), 'utf8')) as { profile?: unknown };
    return normalizeProfile(typeof parsed.profile === 'string' ? parsed.profile : null);
  } catch {
    return null;
  }
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
    `governed minimal missing: ${docSet.governedMinimal.missing.join(', ') || 'none'}`,
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

function normalizeProfile(value: string | null | undefined): TargetProtocolProfile | null {
  const normalized = value?.trim().replace(/`/g, '').toLowerCase();
  return normalized === 'basic' || normalized === 'standard' || normalized === 'governed' ? normalized : null;
}

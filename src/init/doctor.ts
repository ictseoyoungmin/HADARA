import fs from 'node:fs';
import path from 'node:path';
import { DOCS_REGISTRY_PATH } from '../services/docs-registry';
import type { DocumentRegistryFile } from '../services/docs-registry';
import { isLowerProfile, requiredDocsForProfile } from './profile';
import type { InitAction, InitFollowUpReport, InitIssue, InitProfile } from './types';
import { readProjectText } from './files';

export function createInitDoctorReport(projectRoot: string): InitFollowUpReport {
  const issues: InitIssue[] = [];
  const actions: InitAction[] = [];
  const requiredCore: Array<{ path: string; code: string }> = [
    { path: 'AGENTS.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: '.gitignore', code: 'INIT_GITIGNORE_MISSING' },
    { path: '.hadara/context/HADARA_CONTEXT.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: '.hadara/scaffold.json', code: 'INIT_PROTOCOL_MISSING' },
    { path: '.hadara/docs-registry.json', code: 'INIT_DOCS_REGISTRY_MISSING' },
    { path: '.hadara/slot-registry.json', code: 'INIT_SLOT_REGISTRY_MISSING' },
    { path: 'docs/PROJECT_STATE.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: 'docs/TASK_BOARD.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: 'docs/HADARA_WORKFLOW.md', code: 'INIT_WORKFLOW_DOC_MISSING' }
  ];
  for (const required of requiredCore) {
    const relativePath = required.path;
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      issues.push({ severity: 'error', code: required.code, path: relativePath, message: `${relativePath} is missing from the init scaffold.` });
    }
  }

  const scaffold = readProjectText(projectRoot, '.hadara/scaffold.json');
  if (scaffold !== null) {
    try {
      const parsed = JSON.parse(scaffold) as { hadaraProtocol?: unknown };
      if (parsed.hadaraProtocol !== '0.4') {
        issues.push({ severity: 'error', code: 'INIT_PROTOCOL_UNSUPPORTED', path: '.hadara/scaffold.json', message: '.hadara/scaffold.json must declare hadaraProtocol "0.4".' });
      }
    } catch (error) {
      issues.push({ severity: 'error', code: 'INIT_PROTOCOL_UNSUPPORTED', path: '.hadara/scaffold.json', message: `.hadara/scaffold.json could not be parsed: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  for (const relativePath of ['HERMES.md', '.hermes.md']) {
    if (fs.existsSync(path.join(projectRoot, relativePath))) {
      issues.push({ severity: 'warning', code: 'INIT_STALE_HERMES_DEFAULT', path: relativePath, message: `${relativePath} looks like an old default Hermes scaffold file.` });
    }
  }

  const gitignore = readProjectText(projectRoot, '.gitignore');
  if (gitignore === null) {
    issues.push({ severity: 'error', code: 'INIT_GITIGNORE_MISSING', path: '.gitignore', message: 'Generated scaffold .gitignore is missing.' });
  } else if (/^data\/$/m.test(gitignore)) {
    issues.push({ severity: 'warning', code: 'INIT_BROAD_DATA_IGNORE', path: '.gitignore', message: 'Top-level data/ is ignored; generated init should only ignore HADARA local/private state.' });
  }

  const workflow = readProjectText(projectRoot, 'docs/HADARA_WORKFLOW.md');
  if (workflow !== null && mentionsLegacyInitProfile(workflow)) {
    issues.push({ severity: 'warning', code: 'INIT_OLD_PROFILE_NAME', path: 'docs/HADARA_WORKFLOW.md', message: 'Workflow guide mentions old init profile names.' });
  }

  issues.push(...detectEntryDocDuplication(projectRoot));
  issues.push(...detectRequiredReadingTooBroad(projectRoot));
  issues.push(...detectProductDefaultLeaks(projectRoot));
  issues.push(...detectProfileMetadataMismatches(projectRoot));

  for (const [relativePath, headers] of Object.entries(CANONICAL_TABLE_HEADERS)) {
    const content = readProjectText(projectRoot, relativePath);
    if (content === null) continue;
    for (const header of headers) {
      if (!content.includes(header)) {
        issues.push({ severity: 'warning', code: 'INIT_TABLE_FRAME_MISSING', path: relativePath, message: `${relativePath} is missing canonical table header: ${header}` });
      }
    }
  }

  if (issues.length === 0) {
    actions.push({ action: 'doctor', status: 'exists', summary: 'Init scaffold matches current Phase 1 expectations.' });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.doctor',
    ok: issues.every((issue) => issue.severity !== 'error'),
    actions,
    issues
  };
}

function mentionsLegacyInitProfile(content: string): boolean {
  return /(?:initialized with|profile(?:\s+name)?|init profile)\s+(?:the\s+)?`?(minimal|full|hadara-protocol)`?/i.test(content);
}

function detectEntryDocDuplication(projectRoot: string): InitIssue[] {
  const issues: InitIssue[] = [];
  const agents = readProjectText(projectRoot, 'AGENTS.md');
  if (agents !== null && commandRecipeCount(agents) >= 2) {
    issues.push({
      severity: 'warning',
      code: 'INIT_AGENTS_COMMAND_COOKBOOK',
      path: 'AGENTS.md',
      message: 'AGENTS.md appears to duplicate lifecycle or context command recipes; keep command usage in docs/HADARA_WORKFLOW.md.'
    });
  }
  const context = readProjectText(projectRoot, '.hadara/context/HADARA_CONTEXT.md');
  if (context !== null && (context.includes('| Document | When to Read | Purpose |') || context.includes('## Required Reading') || commandRecipeCount(context) >= 2)) {
    issues.push({
      severity: 'warning',
      code: 'INIT_CONTEXT_DUPLICATES_WORKFLOW',
      path: '.hadara/context/HADARA_CONTEXT.md',
      message: 'HADARA_CONTEXT.md appears to duplicate Required Reading or command recipes; keep it as a compact routing anchor.'
    });
  }
  return issues;
}

function commandRecipeCount(content: string): number {
  const matches = content.match(/^\s*`?hadara\s+(?:task|context|session|evidence|docs|harness|init)\s+[a-z-]+/gm);
  return new Set(matches ?? []).size;
}

function detectRequiredReadingTooBroad(projectRoot: string): InitIssue[] {
  const registry = readDocsRegistryForDoctor(projectRoot);
  if (registry === null) return [];
  const broad = registry.documents.filter((doc) => {
    const raw = doc as DocumentRegistryFile['documents'][number] & {
      readTier?: string;
      drift?: { reviewRequiredBeforeUse?: boolean; risk?: string };
    };
    const defaultRead = doc.requiredReading || doc.readWhen.includes('session-start') || doc.readWhen.includes('task-start');
    if (!defaultRead) return false;
    return doc.status === 'historical'
      || doc.status === 'superseded'
      || doc.status === 'archived'
      || raw.readTier === 'historical'
      || raw.readTier === 'excluded'
      || raw.readTier === 'drift-review'
      || raw.drift?.reviewRequiredBeforeUse === true
      || raw.drift?.risk === 'medium'
      || raw.drift?.risk === 'high';
  });
  return broad.map((doc) => ({
    severity: 'warning' as const,
    code: 'INIT_REQUIRED_READING_TOO_BROAD',
    path: doc.path,
    message: `${doc.path} is in the default read path but is historical, excluded, superseded, archived, or drift-risk.`
  }));
}

function readDocsRegistryForDoctor(projectRoot: string): DocumentRegistryFile | null {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
  } catch {
    return null;
  }
}

function detectProductDefaultLeaks(projectRoot: string): InitIssue[] {
  const paths = [
    'AGENTS.md',
    '.hadara/context/HADARA_CONTEXT.md',
    'docs/HADARA_WORKFLOW.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    'docs/ARCHITECTURE.md',
    'docs/ROADMAP.md',
    'docs/DECISIONS.md',
    'docs/SECURITY_MODEL.md'
  ];
  const issues: InitIssue[] = [];
  for (const relativePath of paths) {
    const content = readProjectText(projectRoot, relativePath);
    if (content === null) continue;
    const token = productDefaultLeakToken(content);
    if (token) {
      issues.push({
        severity: 'warning',
        code: 'INIT_PRODUCT_DEFAULT_LEAK',
        path: relativePath,
        message: `${relativePath} appears to contain project-specific generated default text (${token}); product scaffolds must stay generic.`
      });
    }
  }
  return issues;
}

function productDefaultLeakToken(content: string): string | null {
  const checks: Array<[RegExp, string]> = [
    [/\bHADARA-dev\b/, 'HADARA-dev'],
    [/\bDocker\b|\bdocker\s+(?:exec|run|compose|ps|build)\b/i, 'Docker'],
    [/\bnpm\s+(?:run|publish|view|ci|install|pack)\b/i, 'npm'],
    [/\bnode\s+dist\/cli\/main\.js\b/i, 'node dist/cli/main.js'],
    [/\bhadara\s+(?:release|package|smoke)\s+(?:publish|artifact|gate|dry-run|closeout|smoke|recycle|clean-checkout)\b/i, 'release/package command'],
    [/\/workspace\b|\/mnt\/|[A-Za-z]:\\/, 'machine-local path'],
    [/\bhadara@\d+\.\d+\.\d+/, 'package version']
  ];
  return checks.find(([pattern]) => pattern.test(content))?.[1] ?? null;
}

const CANONICAL_TABLE_HEADERS: Record<string, string[]> = {
  'AGENTS.md': ['| Document | When to Read | Purpose |'],
  'docs/PROJECT_STATE.md': ['| Field | Value |', '| Area | Status | Notes |', '| Source | Path | Purpose |'],
  'docs/AGENT_HANDOFF.md': ['| Area | State | Notes |', '| History Type | Path | When to Use |'],
  'docs/TASK_BOARD.md': ['| ID | Title | Status | Capsule | Notes |'],
  'docs/HADARA_WORKFLOW.md': ['| Order | Authority | Allowed Reads |', '| Gate | Required State |', '| Timing | Update |', '| Situation | Use | Notes |', '| Surface | Human / Operator | Agent | CLI |'],
  'docs/ARCHITECTURE.md': ['| Field | Value |', '| Boundary | Rule | Notes |', '| Component | Path / Surface | Responsibility | Status |'],
  'docs/DEVELOPMENT_SLICES.md': ['| Order | Slice | Capsule | Purpose | Done Evidence |'],
  'docs/DECISIONS.md': ['| ID | Date | Decision | Status | Rationale | Evidence |'],
  'docs/TEST_STRATEGY.md': ['| Field | Value |', '| Suite | Command | Purpose | Required For Done |', '| Step | Check | Evidence Location |', '| Check Type | Add Only When |'],
  'docs/SECURITY_MODEL.md': ['| Mode | Rule | Approval Boundary |', '| Invariant | Rule | Evidence |', '| Check Type | Add To | When Required |'],
  'docs/REFACTOR_LOG.md': ['| Date | Area | Change | Rationale | Evidence |'],
  'docs/ROADMAP.md': ['| Order | Item | Purpose | Done Evidence |', '| Item | Reason Deferred | Revisit When |']
};

function detectProfileMetadataMismatches(projectRoot: string): InitIssue[] {
  const inferredProfile = inferProfileFromGeneratedDocs(projectRoot);
  const issues: InitIssue[] = [];
  const projectState = readProjectText(projectRoot, 'docs/PROJECT_STATE.md');
  const projectStateProfile = projectState?.match(/\|\s*HADARA Profile\s*\|\s*(basic|standard|governed)\s*\|/)?.[1] as InitProfile | undefined;
  if (projectStateProfile !== undefined && isLowerProfile(projectStateProfile, inferredProfile)) {
    issues.push({
      severity: 'warning',
      code: 'INIT_PROFILE_METADATA_MISMATCH',
      path: 'docs/PROJECT_STATE.md',
      message: `PROJECT_STATE says ${projectStateProfile}, but ${inferredProfile}-level scaffold docs exist.`
    });
  }

  const agents = readProjectText(projectRoot, 'AGENTS.md');
  if (agents !== null) {
    for (const requiredPath of requiredDocsForProfile(inferredProfile)) {
      if (!agents.includes(`\`${requiredPath}\``)) {
        issues.push({
          severity: 'warning',
          code: 'INIT_PROFILE_METADATA_MISMATCH',
          path: 'AGENTS.md',
          message: `AGENTS required reading does not include ${requiredPath}, but ${inferredProfile}-level scaffold docs exist.`
        });
        break;
      }
    }
  }
  return issues;
}

function inferProfileFromGeneratedDocs(projectRoot: string): InitProfile {
  if (['docs/SECURITY_MODEL.md', 'docs/AGENT_HANDOFF.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'governed';
  }
  if (['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'standard';
  }
  return 'basic';
}

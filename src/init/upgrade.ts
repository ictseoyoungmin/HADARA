import fs from 'node:fs';
import path from 'node:path';
import { DOCS_REGISTRY_PATH, createSeedDocumentRegistry, registryJson } from '../services/docs-registry';
import type { DocumentRegistryFile } from '../services/docs-registry';
import { planProjectCurrentStateUpgrade, projectCurrentStateDocument, PROJECT_CURRENT_STATE_PATH } from '../services/project-current-state';
import { createGeneratedScaffoldFiles } from './scaffold';
import type { InitAction, InitFollowUpMode, InitFollowUpReport, InitIssue, InitProfile, InitWriteOperation } from './types';
import { readProjectText, writeFilesAtomically } from './files';
import { createHermesIntegrationDoc, createMcpIntegrationDoc, formatTableRow } from './templates';

export function createInitUpgradeReport(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): InitFollowUpReport {
  const actions: InitAction[] = [];
  const issues: InitIssue[] = [];
  const writes: InitWriteOperation[] = [];
  const summary = 'This command creates missing scaffold docs and updates generated profile metadata in known scaffold files. It does not overwrite unrelated user-authored content.';
  for (const file of createGeneratedScaffoldFiles(profile)) {
    if (file.path === PROJECT_CURRENT_STATE_PATH) continue;
    const filePath = path.join(projectRoot, file.path);
    if (fs.existsSync(filePath)) {
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'exists', summary: `${file.path} already exists and will not be overwritten.` });
      continue;
    }
    if (mode === 'execute') {
      writes.push({ path: file.path, content: file.content });
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'created', summary: `${file.path} was created.` });
    } else {
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'planned', summary: `${file.path} would be created.` });
    }
  }
  const metadataMerge = createProfileMetadataMerge(projectRoot, profile, mode);
  actions.push(...metadataMerge.actions);
  writes.push(...metadataMerge.writes);
  issues.push(...metadataMerge.issues);
  const currentStateUpgrade = planProjectCurrentStateUpgrade(projectRoot, profile);
  issues.push(...currentStateUpgrade.issues);
  for (const write of currentStateUpgrade.writes) {
    actions.push({
      action: 'upgrade-current-state',
      path: write.path,
      status: mode === 'execute' ? (write.before === null ? 'created' : 'updated') : 'planned',
      summary: write.before === null
        ? `${write.path} ${mode === 'execute' ? 'was created' : 'would be created'} as the structured current-state canon.`
        : `${write.path} ${mode === 'execute' ? 'was synchronized' : 'would be synchronized'} from the structured current-state canon.`
    });
    if (mode === 'execute') {
      const existing = writes.find((candidate) => candidate.path === write.path);
      if (existing && (write.path === 'docs/PROJECT_STATE.md' || write.path === 'docs/AGENT_HANDOFF.md')) {
        existing.content = projectCurrentStateDocument(existing.content, write.path === 'docs/PROJECT_STATE.md' ? 'project-state' : 'handoff', currentStateUpgrade.state);
      } else if (!existing) {
        writes.push({ path: write.path, content: write.after });
      }
    }
  }
  const registryMerge = createDocsRegistryProfileMerge(projectRoot, profile, mode);
  actions.push(...registryMerge.actions);
  writes.push(...registryMerge.writes);
  issues.push(...registryMerge.issues);
  if (mode === 'execute') {
    issues.push(...writeFilesAtomically(projectRoot, writes));
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.upgrade',
    ok: issues.every((issue) => issue.severity !== 'error'),
    summary,
    mode,
    profile,
    actions,
    issues
  };
}

function createDocsRegistryProfileMerge(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): {
  actions: InitAction[];
  writes: InitWriteOperation[];
  issues: InitIssue[];
} {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) {
    return { actions: [], writes: [], issues: [] };
  }
  let registry: DocumentRegistryFile;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
  } catch (error) {
    return {
      actions: [],
      writes: [],
      issues: [{
        severity: 'error',
        code: 'INIT_DOCS_REGISTRY_INVALID_JSON',
        path: DOCS_REGISTRY_PATH,
        message: `.hadara docs registry could not be parsed: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
  const seed = createSeedDocumentRegistry(profile);
  const existingPaths = new Set(registry.documents.map((doc) => doc.path));
  const missing = seed.documents.filter((doc) => !existingPaths.has(doc.path));
  const profileMatches = registry.projectProfile === profile;
  if (missing.length === 0 && profileMatches) {
    return {
      actions: [{
        action: 'upgrade-docs-registry',
        path: DOCS_REGISTRY_PATH,
        status: 'exists',
        summary: `Docs registry already matches the ${profile} seed.`
      }],
      writes: [],
      issues: []
    };
  }
  const merged: DocumentRegistryFile = {
    ...registry,
    projectProfile: profile,
    documents: [...registry.documents, ...missing]
  };
  return {
    actions: [{
      action: 'upgrade-docs-registry',
      path: DOCS_REGISTRY_PATH,
      status: mode === 'execute' ? 'updated' : 'planned',
      summary: describeDocsRegistryProfileMerge(profile, mode, missing.length)
    }],
    writes: mode === 'execute' ? [{ path: DOCS_REGISTRY_PATH, content: registryJson(merged) }] : [],
    issues: []
  };
}

function describeDocsRegistryProfileMerge(profile: InitProfile, mode: InitFollowUpMode, missingCount: number): string {
  const verb = mode === 'execute' ? 'was' : 'would be';
  if (missingCount === 0) return `Docs registry profile metadata ${verb} updated to ${profile}.`;
  return `Docs registry ${verb} updated with ${missingCount} ${profile} profile seed entr${missingCount === 1 ? 'y' : 'ies'}.`;
}

function createRequiredReadingRegistrationReport(
  projectRoot: string,
  input: { documentPath: string; when: string; purpose: string; mode: InitFollowUpMode; requireExists?: boolean }
): InitFollowUpReport {
  const pathResult = normalizeProjectRelativePath(input.documentPath);
  const cellIssues = validateTableCells([input.when, input.purpose]);
  if (!pathResult.ok || cellIssues.length > 0) {
    return {
      schemaVersion: 'hadara.init.followup.v1',
      command: 'init.register-doc',
      ok: false,
      mode: input.mode,
      actions: [],
      issues: [...(pathResult.ok ? [] : [pathResult.issue]), ...cellIssues]
    };
  }
  const relativePath = pathResult.relativePath;
  const issues: InitIssue[] = [];
  if ((input.requireExists ?? false) && !fs.existsSync(path.join(projectRoot, relativePath))) {
    issues.push({
      severity: 'error',
      code: 'INIT_REGISTERED_DOC_MISSING',
      path: relativePath,
      message: `${relativePath} does not exist yet.`
    });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.register-doc',
    ok: issues.every((issue) => issue.severity !== 'error'),
    summary: 'init.register-doc is a compatibility guide only in 0.4 projects; use `hadara docs register` to update .hadara/docs-registry.json.',
    mode: input.mode,
    actions: [{
      action: 'register-doc',
      path: relativePath,
      status: 'skipped',
      summary: `Use hadara docs register --path ${relativePath} --json to register project document metadata.`
    }],
    issues
  };
}

export function createIntegrationEnableReport(
  projectRoot: string,
  input: { integration: string; mode: InitFollowUpMode }
): InitFollowUpReport {
  const integration = parseIntegration(input.integration);
  const relativePath = integration === 'hermes' ? 'docs/integrations/HERMES.md' : 'docs/integrations/MCP.md';
  const content = integration === 'hermes' ? createHermesIntegrationDoc() : createMcpIntegrationDoc();
  const actions: InitAction[] = [];
  const issues: InitIssue[] = [];
  const fullPath = path.join(projectRoot, relativePath);
  actions.push({
    action: 'enable-integration-registration',
    path: relativePath,
    status: 'skipped',
    summary: `Use hadara docs register --path ${relativePath} --json after creating this optional integration guide.`
  });

  if (fs.existsSync(fullPath)) {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'exists', summary: `${relativePath} already exists and will not be overwritten.` });
  } else if (input.mode === 'execute') {
    issues.push(...writeFilesAtomically(projectRoot, [{ path: relativePath, content }]));
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'created', summary: `${relativePath} was created.` });
  } else {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'planned', summary: `${relativePath} would be created.` });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.enable-integration',
    summary: 'This command registers project guidance only; it does not enable Hermes/MCP runtime behavior.',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    integration,
    actions,
    issues
  };
}

function createProfileMetadataMerge(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): { actions: InitAction[]; writes: InitWriteOperation[]; issues: InitIssue[] } {
  const actions: InitAction[] = [];
  const writes: InitWriteOperation[] = [];
  const issues: InitIssue[] = [];
  const planUpdate = (relativePath: string, nextContent: string | null, summary: string): void => {
    if (nextContent === null) return;
    const current = readProjectText(projectRoot, relativePath);
    if (current === null || current === nextContent) return;
    actions.push({
      action: 'upgrade-profile-metadata',
      path: relativePath,
      status: mode === 'execute' ? 'updated' : 'planned',
      summary
    });
    if (mode === 'execute') writes.push({ path: relativePath, content: nextContent });
  };

  planUpdate(
    'docs/PROJECT_STATE.md',
    replaceProfileTableValue(readProjectText(projectRoot, 'docs/PROJECT_STATE.md'), profile),
    `docs/PROJECT_STATE.md HADARA profile metadata ${mode === 'execute' ? 'was updated' : 'would be updated'} to ${profile}.`
  );
  planUpdate(
    'docs/ARCHITECTURE.md',
    replaceProfileTableValue(readProjectText(projectRoot, 'docs/ARCHITECTURE.md'), profile),
    `docs/ARCHITECTURE.md HADARA profile metadata ${mode === 'execute' ? 'was updated' : 'would be updated'} to ${profile}.`
  );
  planUpdate(
    'AGENTS.md',
    mergeAgentsRequiredReading(readProjectText(projectRoot, 'AGENTS.md'), profile),
    `AGENTS.md Required Reading rows ${mode === 'execute' ? 'were updated' : 'would be updated'} for ${profile}.`
  );

  if (actions.length === 0) {
    actions.push({ action: 'upgrade-profile-metadata', status: 'exists', summary: `Profile metadata already matches ${profile} where generated metadata was found.` });
  }
  return { actions, writes, issues };
}

function replaceProfileTableValue(content: string | null, profile: InitProfile): string | null {
  if (content === null) return null;
  return content.replace(/\|\s*HADARA Profile\s*\|\s*(basic|standard|governed)\s*\|/g, `| HADARA Profile | ${profile} |`);
}

function mergeAgentsRequiredReading(content: string | null, profile: InitProfile): string | null {
  if (content === null || !content.includes('| Order | Document | When | Purpose |')) return content;
  let next = content;
  const missingRows = agentsRequiredReadingRowsForProfile(profile).filter((row) => !next.includes(row.document));
  if (missingRows.length === 0) return next;
  const lines = next.split('\n');
  const headerIndex = lines.findIndex((line) => line.trim() === '| Order | Document | When | Purpose |');
  if (headerIndex < 0) return content;
  let insertAt = headerIndex + 2;
  while (insertAt < lines.length && lines[insertAt].startsWith('|')) {
    if (lines[insertAt].includes('Active `tasks/T-*/TASK.md`') || lines[insertAt].includes('Active Task Capsule docs') || lines[insertAt].includes('Project-specific registered docs')) break;
    insertAt += 1;
  }
  const orders = lines
    .slice(headerIndex + 2, insertAt)
    .map((line) => Number(line.match(/^\|\s*(\d+)\s*\|/)?.[1] ?? 0))
    .filter((order) => Number.isFinite(order));
  let order = Math.max(0, ...orders) + 1;
  const rows = missingRows.map((row) => formatTableRow([String(order++), row.document, row.when, row.purpose]));
  lines.splice(insertAt, 0, ...rows);
  next = lines.join('\n');
  return next;
}

function agentsRequiredReadingRowsForProfile(profile: InitProfile): Array<{ document: string; when: string; purpose: string }> {
  const rows: Array<{ document: string; when: string; purpose: string }> = [
    { document: '`.hadara/state/current.json`', when: 'Every session unless session start already exposed it', purpose: 'Structured current release, task continuity, next intent, problems, and validation baseline.' },
    { document: '`docs/PROJECT_STATE.md`', when: 'Every session', purpose: 'Current product and capability state.' },
    { document: '`docs/TASK_BOARD.md`', when: 'Every session', purpose: 'Current task queue and status.' },
    { document: '`docs/HADARA_WORKFLOW.md`', when: 'Every session', purpose: 'Workflow rules and command-surface routing.' }
  ];
  if (profile === 'standard' || profile === 'governed') {
    rows.push(
      { document: '`docs/ARCHITECTURE.md`', when: 'Architecture, component, or boundary work', purpose: 'Current system shape and ownership boundaries.' },
      { document: '`docs/DECISIONS.md`', when: 'Project-level decision work', purpose: 'Durable project decisions.' },
      { document: '`docs/ROADMAP.md`', when: 'Roadmap, milestone, or scope planning', purpose: 'Longer-term priorities and deferred work.' }
    );
  }
  if (profile === 'governed') {
    rows.push(
      { document: '`docs/AGENT_HANDOFF.md`', when: 'Every session', purpose: 'Compact continuation state.' },
      { document: '`docs/SECURITY_MODEL.md`', when: 'Security, secret, permission, or evidence-safety work', purpose: 'Project security invariants.' },
    );
  }
  return rows;
}

function normalizeProjectRelativePath(value: string): { ok: true; relativePath: string } | { ok: false; issue: InitIssue } {
  const normalized = value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
  const issue = (message: string): { ok: false; issue: InitIssue } => ({
    ok: false,
    issue: { severity: 'error', code: 'INIT_INVALID_REGISTER_DOC_PATH', path: value, message }
  });
  if (normalized.length === 0) return issue('Registered document path must not be empty.');
  if (value.startsWith('/') || /^[A-Za-z]:\//.test(value.replace(/\\/g, '/'))) return issue('Registered document path must be project-relative.');
  if (normalized.split('/').includes('..')) return issue('Registered document path must not contain .. segments.');
  if (/[|\r\n]/.test(normalized)) return issue('Registered document path must not contain table delimiters or newlines.');
  return { ok: true, relativePath: normalized };
}

function validateTableCells(values: string[]): InitIssue[] {
  return values.flatMap((value) => (/[|\r\n]/.test(value)
    ? [{ severity: 'error' as const, code: 'INIT_INVALID_TABLE_CELL', message: 'Required Reading table cells must not contain | or newline characters.' }]
    : []));
}

function parseIntegration(value: string): 'hermes' | 'mcp' {
  if (value === 'hermes' || value === 'mcp') return value;
  throw new Error(`unsupported init integration: ${value}; expected hermes or mcp`);
}

import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, readTextIfExists } from '../core/fs';

export interface HermesDetection {
  found: string[];
  missing: string[];
}

const HERMES_CONTEXT_FILES = ['AGENTS.md', '.hermes.md', 'HERMES.md', 'CLAUDE.md', '.cursorrules'];

export function detectHermesContext(projectRoot: string): HermesDetection {
  const found: string[] = [];
  const missing: string[] = [];

  for (const file of HERMES_CONTEXT_FILES) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) found.push(file);
    else missing.push(file);
  }

  return { found, missing };
}

export function exportHadaraContext(projectRoot: string): string {
  const contextDir = path.join(projectRoot, '.hadara', 'context');
  ensureDir(contextDir);

  const sourceFiles = [
    'docs/PROJECT_STATE.md',
    'docs/TASK_BOARD.md',
    'docs/AGENT_HANDOFF.md',
    'docs/CLI_JSON_CONTRACT.md',
    'docs/MCP_BRIDGE_CONTRACT.md',
    'docs/MCP_EVIDENCE_ATTACH_CONTRACT.md',
    'docs/ARCHITECTURE.md',
    'docs/SECURITY_MODEL.md',
    'docs/TEST_STRATEGY.md'
  ];

  const sections = sourceFiles.map((relativePath) => {
    const content = readTextIfExists(path.join(projectRoot, relativePath)) ?? '_Missing._';
    return `## ${relativePath}\n\n${content}`;
  });

  const output = `# HADARA_CONTEXT

This file is generated for Hermes Agent and external agent-harness compatibility.

Agents must:
1. Preserve the portable/project store boundary.
2. Work inside the active Task Capsule.
3. Attach evidence before marking work complete.
4. Update AGENT_HANDOFF.md before stopping.
5. Respect policy decisions for shell/file/git operations.
6. Treat AGENT_HANDOFF.md as compact current state and follow its Historical Index for older history.
7. Use the read-only MCP bridge contract before assuming write-capable MCP tools exist.
8. Treat policy.evaluate as policy evaluation only, not MCP execution authorization.
9. Treat MCP evidence attachment as contract-only until an implementation capsule explicitly enables it.

${sections.join('\n\n---\n\n')}
`;

  const outputPath = path.join(contextDir, 'HADARA_CONTEXT.md');
  fs.writeFileSync(outputPath, output, 'utf8');
  return outputPath;
}

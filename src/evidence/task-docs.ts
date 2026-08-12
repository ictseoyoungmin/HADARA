import fs from 'node:fs';
import path from 'node:path';

export interface TaskEvidenceDocs {
  acceptance?: string;
  risks?: string;
  handoff?: string;
}

/** Shared task-document extraction for evidence lint, close semantics, and projection. */
export function readTaskEvidenceDocs(taskDir: string): TaskEvidenceDocs {
  const taskPath = path.join(taskDir, 'TASK.md');
  const taskContent = readOptionalFile(taskPath);
  return {
    acceptance: readOptionalFile(path.join(taskDir, 'ACCEPTANCE.md')) ?? (taskContent ? readMarkdownSection(taskContent, '## Acceptance') : undefined),
    risks: readOptionalFile(path.join(taskDir, 'RISKS.md')) ?? (taskContent ? readMarkdownSection(taskContent, '## Risks / Follow-ups') : undefined),
    handoff: readOptionalFile(path.join(taskDir, 'HANDOFF.md'))
  };
}

function readOptionalFile(filePath: string): string | undefined {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : undefined;
}

function readMarkdownSection(content: string, heading: string): string | undefined {
  const start = content.indexOf(heading);
  if (start < 0) return undefined;
  const bodyStart = start + heading.length;
  const nextHeading = content.slice(bodyStart).search(/\n##\s+/);
  return content.slice(bodyStart, nextHeading < 0 ? undefined : bodyStart + nextHeading).trim();
}

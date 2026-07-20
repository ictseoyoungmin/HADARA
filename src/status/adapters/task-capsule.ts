import fs from 'node:fs';
import path from 'node:path';
import { findTaskCapsule } from '../../task/task-capsule';
import { findMarkdownRowByCell, parseMarkdownRowsUnderHeading } from '../../services/markdown-table';
import type { FactRecord } from '../model';
import { missingFact, presentFact } from '../model';
import { taskToWorkUnit, type WorkUnitFact } from '../transformers';

/** Normalizes a HADARA Task Capsule into a generic workUnit fact (docx section 5.3, "task-capsule" adapter). */
export function readTaskCapsuleWorkUnitFact(projectRoot: string, taskId: string, factKey = 'task.workUnit'): FactRecord<WorkUnitFact> {
  const source = { sourceId: `task-capsule:${taskId}`, adapter: 'task-capsule' };
  const capsule = findTaskCapsule(projectRoot, taskId);
  if (!capsule) return missingFact(factKey, source);
  const taskMdPath = path.join(capsule.dir, 'TASK.md');
  if (!fs.existsSync(taskMdPath)) return missingFact(factKey, { ...source, path: path.relative(projectRoot, taskMdPath) });
  const content = fs.readFileSync(taskMdPath, 'utf8');
  const identityRows = parseMarkdownRowsUnderHeading(content, '## Identity');
  const titleRow = findMarkdownRowByCell(identityRows, 0, 'Title');
  const title = titleRow?.[1] ?? capsule.title;
  return presentFact(factKey, taskToWorkUnit({ id: taskId, title }), { ...source, path: path.relative(projectRoot, taskMdPath), selector: '## Identity' }, { authority: 'declared' });
}

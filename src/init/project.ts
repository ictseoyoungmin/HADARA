import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { resolveHadaraPaths } from '../core/paths';
import { parseInitProfile } from './profile';
import { createGeneratedScaffoldFiles } from './scaffold';
import type { InitAction, InitProjectOptions, InitReport } from './types';

export function initProject(projectRoot: string, profile = 'standard', options: InitProjectOptions = {}): InitReport {
  const normalizedProfile = parseInitProfile(profile);
  const paths = resolveHadaraPaths({ projectRoot });
  ensureDir(paths.projectDocsDir);
  ensureDir(paths.projectTasksDir);

  const actions: InitAction[] = [];
  for (const file of createGeneratedScaffoldFiles(normalizedProfile)) {
    const absolutePath = path.join(projectRoot, file.path);
    const existed = fs.existsSync(absolutePath);
    writeFileIfMissing(path.join(projectRoot, file.path), file.content);
    actions.push({
      action: 'init-doc',
      path: file.path,
      status: existed ? 'exists' : 'created',
      summary: existed ? `${file.path} already existed and was not overwritten.` : `${file.path} was created.`
    });
  }

  const report: InitReport = {
    schemaVersion: 'hadara.init.v1',
    command: 'init',
    ok: true,
    profile: normalizedProfile,
    actions,
    issues: []
  };
  if (!options.silent) {
    console.log(`[HADARA] Initialized project: ${projectRoot}`);
    console.log(`[HADARA] Init profile: ${normalizedProfile}`);
  }
  return report;
}

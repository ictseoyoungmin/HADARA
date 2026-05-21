import path from 'node:path';
import { detectHermesContext, exportHadaraContext, HermesDetection } from '../hermes/context-export';

export interface HermesDetectReport {
  schemaVersion: 'hadara.hermes.detect.v1';
  command: 'hermes.detect';
  ok: true;
  contextFiles: HermesDetection;
}

export interface HermesExportContextReport {
  schemaVersion: 'hadara.hermes.export-context.v1';
  command: 'hermes.export-context';
  ok: true;
  output: {
    path: string;
  };
}

export function createHermesDetectReport(projectRoot: string): HermesDetectReport {
  return {
    schemaVersion: 'hadara.hermes.detect.v1',
    command: 'hermes.detect',
    ok: true,
    contextFiles: detectHermesContext(projectRoot)
  };
}

export function createHermesExportContextReport(projectRoot: string): HermesExportContextReport {
  const outputPath = exportHadaraContext(projectRoot);
  return {
    schemaVersion: 'hadara.hermes.export-context.v1',
    command: 'hermes.export-context',
    ok: true,
    output: {
      path: toPortablePath(path.relative(projectRoot, outputPath))
    }
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}


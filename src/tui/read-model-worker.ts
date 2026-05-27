import { parentPort, workerData } from 'node:worker_threads';
import { createTuiReadModel, TuiReadModelOptions } from './read-model';
import { createTuiReadModelWithCache, TuiCacheRefreshMode } from './cache';

interface WorkerInput {
  projectRoot: string;
  refresh: TuiCacheRefreshMode;
  readOptions: TuiReadModelOptions;
  cache?: {
    enabled?: boolean;
    root?: string;
  };
}

function loadModel(input: WorkerInput) {
  if (input.cache?.enabled) {
    return createTuiReadModelWithCache(input.projectRoot, {
      ...input.readOptions,
      cache: {
        enabled: true,
        root: input.cache.root,
        refresh: input.refresh
      }
    }).model;
  }
  return createTuiReadModel(input.projectRoot, input.readOptions);
}

try {
  parentPort?.postMessage({ ok: true, model: loadModel(workerData as WorkerInput) });
} catch (error) {
  parentPort?.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) });
}

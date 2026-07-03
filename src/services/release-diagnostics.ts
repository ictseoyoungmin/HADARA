import type { ReleaseDryRunReport } from './release-dry-run';
import { startMonotonicTimer, type MonotonicTimer } from '../core/timing';

export function timeStage<T>(timings: ReleaseDryRunReport['diagnostics']['stageTimings'], stage: string, fn: () => T): T {
  const timer = startMonotonicTimer();
  try {
    return fn();
  } finally {
    timings.push({
      stage,
      durationMs: timer.elapsedMs(),
      status: 'passed',
      summary: `${stage} completed.`
    });
  }
}

export function applyStageStatuses(timings: ReleaseDryRunReport['diagnostics']['stageTimings'], releaseGateOk: boolean, checks: ReleaseDryRunReport['checks']): void {
  const evidenceOk = checks.filter((check) => check.code.endsWith('_EVIDENCE')).every((check) => check.status === 'passed');
  for (const timing of timings) {
    if (timing.stage === 'strict-release-gate' && !releaseGateOk) {
      timing.status = 'error';
      timing.summary = 'Strict release gate completed with blocking checks.';
    } else if (timing.stage === 'release-evidence-validation' && !evidenceOk) {
      timing.status = 'error';
      timing.summary = 'Release evidence validation completed with blocking checks.';
    }
  }
}

export function createDiagnostics(
  generatedAt: string,
  timer: MonotonicTimer,
  stageTimings: ReleaseDryRunReport['diagnostics']['stageTimings'],
  releaseTargetConfiguration: ReleaseDryRunReport['releaseTargetConfiguration']
): ReleaseDryRunReport['diagnostics'] {
  const thresholdMs = 5000;
  return {
    generatedAt,
    durationMs: timer.elapsedMs(),
    advisories: releaseTargetConfiguration.issues.map((issue) => ({
      area: 'release-target-configuration',
      severity: 'warning',
      code: issue.code,
      message: issue.message,
      blocking: false
    })),
    stageTimings,
    slowStageWarnings: stageTimings
      .filter((timing) => timing.durationMs >= thresholdMs)
      .map((timing) => ({
        stage: timing.stage,
        durationMs: timing.durationMs,
        thresholdMs,
        summary: `${timing.stage} took ${timing.durationMs}ms; inspect this stage before treating release dry-run latency as a packaging problem.`
      }))
  };
}

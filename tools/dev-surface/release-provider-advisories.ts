import type { ReleaseDryRunReport } from './release-dry-run';
import type { ReleaseEvidenceRecord } from './release-evidence';
import { validateReleaseEvidenceArtifact } from './release-evidence';

export function createProviderAdvisories(records: ReleaseEvidenceRecord[]): ReleaseDryRunReport['providerAdvisories'] {
  const pythonSmokeRecords = records
    .map((record) => ({ record, artifact: validateReleaseEvidenceArtifact(record) }))
    .filter(({ artifact }) => artifact.category === 'package-smoke' && artifact.providerEcosystem === 'python')
    .sort((a, b) => b.record.time.localeCompare(a.record.time));
  const latest = pythonSmokeRecords[0];
  if (!latest) {
    return [
      {
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'missing',
        blocking: false,
        summary: 'Python package smoke evidence is missing; this is advisory because npm remains the active primary release target.'
      }
    ];
  }

  const { record, artifact } = latest;
  const present =
    record.result === 'passed' &&
    record.visibility === 'public' &&
    artifact.exists === true &&
    artifact.schemaValid === true &&
    artifact.sourceOk === true &&
    artifact.mode === 'local';
  return [
    {
      provider: 'python',
      status: 'preview',
      smokeEvidence: present ? 'present' : 'stale',
      blocking: false,
      taskId: record.taskId,
      time: record.time,
      ...(record.evidencePath ? { evidencePath: record.evidencePath } : {}),
      summary: present
        ? 'Python package smoke evidence is present; this is advisory because npm remains the active primary release target.'
        : 'Python package smoke evidence is stale or not passed/source-ok; this is advisory because npm remains the active primary release target.'
    }
  ];
}

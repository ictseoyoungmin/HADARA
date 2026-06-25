import { createEvidenceListReport, EvidenceListIssue, EvidenceListRecord } from './evidence-list';

export interface EvidenceSummaryInput {
  taskId: string;
  limit?: number;
  includePrivate?: boolean;
}

export interface EvidenceSummaryRecord {
  id: string;
  time: string;
  category: EvidenceListRecord['category'];
  outcome: EvidenceListRecord['outcome'];
  visibility: EvidenceListRecord['visibility'];
  summary: string;
  tags: string[];
  sourceLine: number;
  idSource: EvidenceListRecord['idSource'];
  idStability: EvidenceListRecord['idStability'];
  persistedSchemaVersion: EvidenceListRecord['persistedSchemaVersion'];
}

export interface EvidenceSummaryReport {
  schemaVersion: 'hadara.evidence.summary.v1';
  command: 'evidence.summary';
  ok: boolean;
  readOnly: true;
  taskId: string;
  summary: {
    count: number;
    durableCount: number;
    unstableCount: number;
    privateIncluded: boolean;
    latestId: string | null;
    latestCloseEvidenceId: string | null;
  };
  records: EvidenceSummaryRecord[];
  latest: EvidenceSummaryRecord | null;
  latestCloseEvidence: EvidenceSummaryRecord | null;
  copyHints: {
    latestId: string | null;
    latestCloseEvidenceId: string | null;
    durableIds: string[];
  };
  issues: EvidenceListIssue[];
}

export function createEvidenceSummaryReport(projectRoot: string, input: EvidenceSummaryInput): EvidenceSummaryReport {
  const list = createEvidenceListReport(projectRoot, {
    taskId: input.taskId,
    limit: input.limit,
    includePrivate: input.includePrivate
  });
  const records = list.records.map(toSummaryRecord);
  const latest = latestByTime(records);
  const latestCloseEvidence = latestByTime(records.filter(isCloseEvidence));
  const durableIds = records.filter((record) => record.idStability === 'durable').map((record) => record.id);

  return {
    schemaVersion: 'hadara.evidence.summary.v1',
    command: 'evidence.summary',
    ok: list.ok,
    readOnly: true,
    taskId: input.taskId,
    summary: {
      count: records.length,
      durableCount: durableIds.length,
      unstableCount: records.length - durableIds.length,
      privateIncluded: input.includePrivate === true,
      latestId: latest?.id ?? null,
      latestCloseEvidenceId: latestCloseEvidence?.id ?? null
    },
    records,
    latest,
    latestCloseEvidence,
    copyHints: {
      latestId: latest?.id ?? null,
      latestCloseEvidenceId: latestCloseEvidence?.id ?? null,
      durableIds
    },
    issues: list.issues
  };
}

function toSummaryRecord(record: EvidenceListRecord): EvidenceSummaryRecord {
  return {
    id: record.id,
    time: record.time,
    category: record.category,
    outcome: record.outcome,
    visibility: record.visibility,
    summary: record.summary,
    tags: record.tags,
    sourceLine: record.sourceLine,
    idSource: record.idSource,
    idStability: record.idStability,
    persistedSchemaVersion: record.persistedSchemaVersion
  };
}

function latestByTime(records: EvidenceSummaryRecord[]): EvidenceSummaryRecord | null {
  if (records.length === 0) return null;
  return records.reduce((latest, record) => (record.time >= latest.time ? record : latest), records[0]);
}

function isCloseEvidence(record: EvidenceSummaryRecord): boolean {
  if (record.tags.includes('close-proof')) return true;
  if (record.category === 'audit' && /close/i.test(record.summary)) return true;
  return false;
}

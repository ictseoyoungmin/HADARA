import { parseMarkdownRows } from '../services/markdown-table';

export type AcceptanceStatus =
  | 'Met'
  | 'Not Met'
  | 'In Progress'
  | 'Pending'
  | 'TBD'
  | 'Deferred'
  | 'Blocked'
  | 'Partial'
  | 'Not Applicable'
  | 'Superseded'
  | 'Follow-up Created'
  | 'Accepted Risk'
  | 'Unknown';

export type AcceptanceOrigin =
  | 'original'
  | 'planned'
  | 'discovered'
  | 'reviewer-feedback'
  | 'generated'
  | 'migration';

export interface AcceptanceRow {
  id: string;
  criterion: string;
  origin: AcceptanceOrigin;
  required: boolean;
  deferrable: boolean;
  status: AcceptanceStatus;
  rawStatus: string;
  evidenceRefs: string[];
  decisionRefs: string[];
  riskRefs: string[];
  followUpRefs: string[];
}

export interface AcceptanceBlocker {
  row: AcceptanceRow;
  code:
    | 'ACCEPTANCE_REQUIRED_UNRESOLVED'
    | 'ACCEPTANCE_NONDEFERRABLE_DEFERRED'
    | 'ACCEPTANCE_DEFERRED_WITHOUT_DECISION'
    | 'ACCEPTANCE_FOLLOWUP_WITHOUT_FOLLOWUP'
    | 'ACCEPTANCE_ACCEPTED_RISK_WITHOUT_RISK_RECORD'
    | 'ACCEPTANCE_STATUS_UNKNOWN';
  message: string;
}

export interface AcceptanceReadinessAnalysis {
  rows: AcceptanceRow[];
  blockers: AcceptanceBlocker[];
  summary: {
    total: number;
    required: number;
    met: number;
    unresolvedRequired: number;
    deferred: number;
    followUps: number;
    acceptedRisks: number;
  };
}

export function analyzeAcceptanceReadiness(content: string): AcceptanceReadinessAnalysis {
  const rows = parseAcceptanceRows(content);
  const blockers = rows.flatMap(blockersForAcceptanceRow);
  return {
    rows,
    blockers,
    summary: {
      total: rows.length,
      required: rows.filter((row) => row.required).length,
      met: rows.filter((row) => row.status === 'Met').length,
      unresolvedRequired: blockers.filter((blocker) => blocker.code === 'ACCEPTANCE_REQUIRED_UNRESOLVED').length,
      deferred: rows.filter((row) => row.status === 'Deferred').length,
      followUps: rows.filter((row) => row.status === 'Follow-up Created').length,
      acceptedRisks: rows.filter((row) => row.status === 'Accepted Risk').length
    }
  };
}

export function parseAcceptanceRows(content: string): AcceptanceRow[] {
  const rows = parseMarkdownRows(content);
  const headerIndex = rows.findIndex((row) => headerIndexFor(row, 'id') >= 0 && (headerIndexFor(row, 'status') >= 0 || headerIndexFor(row, 'state') >= 0));
  const header = headerIndex >= 0 ? rows[headerIndex] : [];
  const dataRows = (headerIndex >= 0 ? rows.slice(headerIndex + 1) : rows).filter((cells) => /^AC-\d+$/i.test(cells[0] ?? ''));

  return dataRows.map((cells) => {
    const allText = cells.join(' ');
    const evidenceText = cellByHeader(cells, header, 'evidence') ?? '';
    const statusText = cellByHeaderAny(cells, header, ['status', 'state']) ?? cells[2] ?? '';
    const status = normalizeAcceptanceStatus(statusText);
    const decision = cellByHeader(cells, header, 'decision');
    return {
      id: cells[0] ?? '',
      criterion: cellByHeader(cells, header, 'criterion') ?? cells[1] ?? '',
      origin: normalizeAcceptanceOrigin(cellByHeader(cells, header, 'origin')),
      required: requiredFromDecision(decision, normalizeBooleanCell(cellByHeader(cells, header, 'required'), true)),
      deferrable: deferrableFromDecision(decision, normalizeBooleanCell(cellByHeader(cells, header, 'deferrable'), false)),
      status,
      rawStatus: statusText,
      evidenceRefs: extractRefs(evidenceText, /\bev:T-\d{4}:[a-f0-9]{24}\b/g),
      decisionRefs: extractRefs(allText, /\bD-[A-Za-z0-9._-]+\b/g),
      riskRefs: extractRefs(allText, /\bR-[A-Za-z0-9._-]+\b/g),
      followUpRefs: extractRefs(allText, /\b(?:T-\d{4}|DEBT-[A-Za-z0-9._-]+|GH-\d+)\b|hadara\s+task\s+create\s+["'`][^"'`]+["'`]/gi)
    };
  });
}

function blockersForAcceptanceRow(row: AcceptanceRow): AcceptanceBlocker[] {
  const blockers: AcceptanceBlocker[] = [];
  if (row.required && ['Not Met', 'In Progress', 'Pending', 'TBD', 'Blocked', 'Partial'].includes(row.status)) {
    blockers.push({
      row,
      code: 'ACCEPTANCE_REQUIRED_UNRESOLVED',
      message: `${row.id} is required but remains ${row.status}.`
    });
  }

  if (row.status === 'Unknown') {
    blockers.push({
      row,
      code: 'ACCEPTANCE_STATUS_UNKNOWN',
      message: `${row.id} has unknown acceptance status "${row.rawStatus}".`
    });
  }

  if (['Deferred', 'Follow-up Created', 'Accepted Risk'].includes(row.status)) {
    if (row.required && !row.deferrable) {
      blockers.push({
        row,
        code: 'ACCEPTANCE_NONDEFERRABLE_DEFERRED',
        message: `${row.id} is required and non-deferrable, so ${row.status} cannot close as Done.`
      });
    }
    if (row.decisionRefs.length === 0) {
      blockers.push({
        row,
        code: 'ACCEPTANCE_DEFERRED_WITHOUT_DECISION',
        message: `${row.id} is ${row.status} without a decision reference.`
      });
    }
  }

  if (row.status === 'Follow-up Created' && row.followUpRefs.length === 0) {
    blockers.push({
      row,
      code: 'ACCEPTANCE_FOLLOWUP_WITHOUT_FOLLOWUP',
      message: `${row.id} is Follow-up Created without a concrete follow-up reference.`
    });
  }

  if (row.status === 'Accepted Risk' && row.riskRefs.length === 0) {
    blockers.push({
      row,
      code: 'ACCEPTANCE_ACCEPTED_RISK_WITHOUT_RISK_RECORD',
      message: `${row.id} is Accepted Risk without a risk reference.`
    });
  }

  return blockers;
}

function cellByHeader(cells: string[], header: string[], name: string): string | undefined {
  const index = headerIndexFor(header, name);
  return index >= 0 ? cells[index] : undefined;
}

function cellByHeaderAny(cells: string[], header: string[], names: string[]): string | undefined {
  for (const name of names) {
    const value = cellByHeader(cells, header, name);
    if (value !== undefined) return value;
  }
  return undefined;
}

function headerIndexFor(header: string[], name: string): number {
  const expected = normalizeHeader(name);
  return header.findIndex((cell) => normalizeHeader(cell) === expected);
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeAcceptanceStatus(value: string): AcceptanceStatus {
  const normalized = value.trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  switch (normalized) {
    case 'met':
    case 'done':
    case 'complete':
    case 'completed':
      return 'Met';
    case 'not met':
      return 'Not Met';
    case 'in progress':
      return 'In Progress';
    case 'pending':
      return 'Pending';
    case 'tbd':
      return 'TBD';
    case 'deferred':
      return 'Deferred';
    case 'blocked':
      return 'Blocked';
    case 'partial':
      return 'Partial';
    case 'not applicable':
    case 'n/a':
    case 'na':
      return 'Not Applicable';
    case 'superseded':
      return 'Superseded';
    case 'follow up created':
    case 'followup created':
      return 'Follow-up Created';
    case 'accepted risk':
      return 'Accepted Risk';
    default:
      return 'Unknown';
  }
}

function normalizeAcceptanceOrigin(value?: string): AcceptanceOrigin {
  const normalized = (value ?? '').trim().toLowerCase().replace(/[_\s]+/g, '-');
  switch (normalized) {
    case 'planned':
      return 'planned';
    case 'discovered':
      return 'discovered';
    case 'reviewer-feedback':
      return 'reviewer-feedback';
    case 'generated':
      return 'generated';
    case 'migration':
      return 'migration';
    default:
      return 'original';
  }
}

function normalizeBooleanCell(value: string | undefined, defaultValue: boolean): boolean {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (['yes', 'y', 'true', '1', 'required'].includes(normalized)) return true;
  if (['no', 'n', 'false', '0', 'optional'].includes(normalized)) return false;
  return defaultValue;
}

function requiredFromDecision(value: string | undefined, fallback: boolean): boolean {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return fallback;
  return ['must', 'required'].includes(normalized);
}

function deferrableFromDecision(value: string | undefined, fallback: boolean): boolean {
  const normalized = (value ?? '').trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  if (!normalized) return fallback;
  return ['follow up', 'deferred', 'accepted risk', 'not applicable', 'superseded'].includes(normalized);
}

function extractRefs(value: string, pattern: RegExp): string[] {
  return [...new Set([...value.matchAll(pattern)].map((match) => match[0]))];
}

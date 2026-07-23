export interface OperationalDebtAggregate {
  total: number;
  open: number;
  tracked: number;
  mitigated: number;
  candidate: number;
  highOpen: number;
  bySeverity: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface OperationalDebtReport {
  schemaVersion: 'hadara.operational_debt.v1';
  command: 'operational-debt.report';
  ok: true;
  records: Array<{
    id: string;
    title: string;
    source: string;
    category: 'continuity' | 'validation' | 'scope-control' | 'complexity' | 'visibility' | 'environment';
    status: 'tracked' | 'mitigated' | 'candidate';
    severity: 'low' | 'medium' | 'high';
    targetCapability: string;
  }>;
  aggregate: OperationalDebtAggregate;
  capsuleSizeIndicators: Array<{
    taskId: string;
    capsule: string;
    fileCount: number;
    lineCount: number;
    byteCount: number;
    size: 'tiny' | 'standard' | 'large';
  }>;
  issues: Array<{
    severity: 'warning';
    code: string;
    message: string;
    path?: string;
  }>;
}

export interface ReleaseGateReport {
  schemaVersion: 'hadara.releaseGate.v1';
  command: 'release.gate';
  mode: 'advisory' | 'strict';
  ok: boolean;
  checks: Array<{
    code: string;
    name: string;
    status: 'passed' | 'warning' | 'error';
    summary: string;
  }>;
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
  }>;
}

export function createEmptyOperationalDebtAggregate(): OperationalDebtAggregate {
  return {
    total: 0,
    open: 0,
    tracked: 0,
    mitigated: 0,
    candidate: 0,
    highOpen: 0,
    bySeverity: { high: 0, medium: 0, low: 0 }
  };
}

export function createPlaceholderOperationalDebtReport(): OperationalDebtReport {
  return {
    schemaVersion: 'hadara.operational_debt.v1',
    command: 'operational-debt.report',
    ok: true,
    records: [],
    aggregate: createEmptyOperationalDebtAggregate(),
    capsuleSizeIndicators: [],
    issues: []
  };
}

export function createPlaceholderReleaseGateReport(): ReleaseGateReport {
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode: 'advisory',
    ok: true,
    checks: [],
    issues: []
  };
}

export function createDeferredReleaseGateReport(): ReleaseGateReport {
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode: 'advisory',
    ok: true,
    checks: [
      {
        code: 'TUI_FAST_RELEASE_GATE_DEFERRED',
        name: 'Deferred release-gate check',
        status: 'warning',
        summary: 'Release-gate debt scan is deferred in the TUI fast read model.'
      }
    ],
    issues: []
  };
}

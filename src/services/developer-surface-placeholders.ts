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

export interface DeveloperSurfaceAvailability {
  state: 'repo-local-only' | 'deferred';
  evaluated: false;
  owner: 'hadara-dev' | 'tui-fast-profile';
  summary: string;
}

export interface OperationalDebtReport {
  schemaVersion: 'hadara.operational_debt.v1';
  command: 'operational-debt.report';
  ok: boolean;
  availability: DeveloperSurfaceAvailability;
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
  availability: DeveloperSurfaceAvailability;
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

function createRepoLocalAvailability(summary: string): DeveloperSurfaceAvailability {
  return {
    state: 'repo-local-only',
    evaluated: false,
    owner: 'hadara-dev',
    summary
  };
}

function createDeferredAvailability(summary: string): DeveloperSurfaceAvailability {
  return {
    state: 'deferred',
    evaluated: false,
    owner: 'tui-fast-profile',
    summary
  };
}

export function createPlaceholderOperationalDebtReport(): OperationalDebtReport {
  return {
    schemaVersion: 'hadara.operational_debt.v1',
    command: 'operational-debt.report',
    ok: true,
    availability: createRepoLocalAvailability(
      'Operational debt is maintained through repo-local HADARA-dev tooling and is not evaluated by shipped status or TUI surfaces.'
    ),
    records: [],
    aggregate: createEmptyOperationalDebtAggregate(),
    capsuleSizeIndicators: [],
    issues: [
      {
        severity: 'warning',
        code: 'OPERATIONAL_DEBT_REPO_LOCAL_ONLY',
        message: 'Operational debt remains a repo-local HADARA-dev developer surface and is not evaluated here.'
      }
    ]
  };
}

export function createPlaceholderReleaseGateReport(): ReleaseGateReport {
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode: 'advisory',
    ok: true,
    availability: createRepoLocalAvailability(
      'Release gate evaluation remains a repo-local HADARA-dev surface and is not evaluated by shipped TUI/status placeholders.'
    ),
    checks: [
      {
        code: 'RELEASE_GATE_REPO_LOCAL_ONLY',
        name: 'Repo-local release gate',
        status: 'warning',
        summary: 'Release-gate evaluation now lives behind repo-local HADARA-dev tooling and is unavailable on this shipped surface.'
      }
    ],
    issues: [
      {
        severity: 'warning',
        code: 'RELEASE_GATE_REPO_LOCAL_ONLY',
        message: 'Release gate evaluation remains repo-local and was not run here.'
      }
    ]
  };
}

export function createDeferredReleaseGateReport(): ReleaseGateReport {
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode: 'advisory',
    ok: true,
    availability: createDeferredAvailability(
      'The fast TUI profile defers repo-local release-gate evaluation to avoid expensive advisory reads during navigation.'
    ),
    checks: [
      {
        code: 'TUI_FAST_RELEASE_GATE_DEFERRED',
        name: 'Deferred release-gate check',
        status: 'warning',
        summary: 'Release-gate debt scan is deferred in the TUI fast read model.'
      }
    ],
    issues: [
      {
        severity: 'warning',
        code: 'TUI_FAST_RELEASE_GATE_DEFERRED',
        message: 'Fast TUI mode deferred the repo-local release-gate surface.'
      }
    ]
  };
}

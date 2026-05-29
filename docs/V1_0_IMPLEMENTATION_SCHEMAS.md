# V1.0_IMPLEMENTATION_SCHEMAS

This document captures detailed implementation schemas and file-level notes extracted from `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md`, plus the unabridged TUI mockup parity / HADARA-native runtime design imported from `docs/specs/HADARA_TUI_Mockup_Parity_HADARA_Native_Runtime_Design.md`.

Use it as a reference when creating individual Task Capsules. Keep broad sequencing in `docs/V1_0_CAPSULE_BACKLOG.md`.

## Compatibility Fixture Expansion

Current implementation:

- `tests/fixtures/compatibility/hermes-readonly-flow.json`
- `tests/contract/hermes-compatibility-fixture.test.ts`

Future optional files:

These are expansion candidates, not current T-0066 acceptance requirements. Keep the existing `tests/fixtures/compatibility/` location unless a product-level runner needs a separate fixture directory.

```text
docs/COMPATIBILITY_FIXTURE.md
tests/fixtures/compatibility/hermes-readonly-flow.expected.json
src/compatibility/fixture-runner.ts
src/compatibility/hermes-like-agent.ts
```

Result schema:

```ts
export interface CompatibilityFixtureResult {
  schemaVersion: 'hadara.compatibility.result.v1';
  ok: boolean;
  fixture: string;
  steps: Array<{
    id: string;
    ok: boolean;
    surface: 'mcp' | 'cli';
    commandOrTool: string;
    issues: Array<{
      severity: 'error' | 'warning';
      code: string;
      message: string;
    }>;
  }>;
  conclusions: {
    nextRecommendedTaskId?: string;
    readOnlySurfaceUsable: boolean;
    cliFallbackRequired: boolean;
  };
  issues: Array<{
    severity: 'error' | 'warning';
    code: string;
    message: string;
  }>;
}
```

Acceptance notes:

- Keep write/execution-like MCP tools unavailable by default.
- Add CLI fallback fixture only after the current MCP fixture remains stable.
- Snapshot expected results only if they avoid brittle environment-specific fields.

## Service Parity Expansion

Current implementation:

- `src/services/project-read-model.ts`
- partial reuse in `src/mcp/tool-registry.ts`
- parity tests in `tests/contract/cli-mcp-service-parity.test.ts`

Target service boundary:

```text
src/services/
  task-service.ts
  handoff-service.ts
  project-state-service.ts
  evidence-service.ts
  policy-service.ts
  harness-service.ts
  context-export-service.ts
  operations-status-service.ts
```

Shared result shape:

```ts
export interface ServiceIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
}

export interface ServiceResult<T> {
  ok: boolean;
  data?: T;
  issues: ServiceIssue[];
}
```

Priority order:

1. Move `hadara.task.read` out of `src/mcp/tool-registry.ts`.
2. Add evidence list service before adding MCP/dashboard evidence surfaces.
3. Wrap policy preflight in a named service before provider adapter work.
4. Keep CLI and MCP transport envelopes separate from shared read models.

Completed increments:

- T-0080 moved task list/show/read report builders into `src/services/task-read-model.ts`.
- T-0081 moved policy check/evaluate report builders into `src/services/policy-service.ts`.
- T-0083 updated `task.read` embedded evidence data to reuse evidence-list normalization.
- T-0084 moved harness validate report access behind `src/services/harness-service.ts`.

Remaining consistency cleanup:

- Policy service parity is report-builder parity only. It is not yet the v1.0 single source of authorization for actor/surface-aware provider-originated actions.

## Terminal TUI Read Model Aggregation

Current reference mockups:

- `.mockup/tui/app.js`
- `.mockup/tui-final/src/app.js`
- `.mockup/tui-final/README.md`

The production TUI should not add a new schema in its first slice. It should compose existing schema-backed and shared read models into presentation state:

```text
src/tui/
  read-model.ts       # implemented by T-0100
  snapshot.ts         # implemented by T-0102
  renderer.ts         # future interactive/layout refinement
  constants.ts        # implemented by T-0103
  layout.ts           # implemented by T-0103
  markdown.ts         # implemented by T-0103
  state.ts            # implemented by T-0105
  terminal.ts         # implemented by T-0106
src/cli/
  tui.ts              # implemented by T-0107
```

Target aggregation inputs:

- `src/services/operations-status-service.ts`
- `src/services/task-read-model.ts`
- `src/services/evidence-list.ts`
- `src/services/active-run-state.ts`
- `src/services/operational-debt.ts`
- `src/services/tools-list.ts`
- `src/services/write-preflight.ts`

Implementation notes:

- Keep terminal presentation state separate from HADARA project state.
- Prefer direct TypeScript service calls over spawning the HADARA CLI inside production TUI code.
- Keep the mockup-style CLI subprocess adapter only for compatibility fixtures or development snapshots if needed.
- Snapshot output may have a TUI-specific test envelope, but it should be treated as a test artifact, not a stable external data contract.
- Any cache must live under ignored machine-local state such as `.hadara/local/tui/`.

Acceptance notes:

- T-0100 implemented aggregation only.
- T-0102 through T-0104 implemented deterministic no-color snapshots, mockup-style layout/Markdown helpers, and snapshot polish.
- T-0105 implemented pure navigation, search, refresh, task selection, detail tabs, scroll, and quit state transitions.
- T-0106 implemented injected-stream raw terminal shell behavior.
- T-0107 implemented the public read-only `hadara tui` command and snapshot smoke mode.
- Future TUI slices should preserve the read-only boundary while adding cache/performance, visual parity, mouse/resize, or compatibility-adapter behavior.
- Prove refresh does not call write commands, shell execution, provider adapters, MCP tools, release/package execution, evidence writes, or handoff updates.
- Do not add runtime TUI dependencies in the first integrated slice unless a dedicated capsule records the dependency decision and packaging impact.

## Active Run State

Current manifest schema:

```json
{
  "schemaVersion": "hadara.active_run.v1",
  "runId": "run_...",
  "taskId": "T-0068",
  "capsule": "tasks/T-0068-single-active-run-state",
  "status": "active",
  "startedAt": "2026-05-24T00:00:00.000Z",
  "updatedAt": "2026-05-24T00:00:00.000Z",
  "summary": "..."
}
```

Current projection schema:

```ts
export interface ActiveRunProjection {
  schemaVersion: 'hadara.active_run.projection.v1';
  command: 'active-run.projection';
  ok: true;
  path: '.hadara/local/state/active-run.json';
  activeRun: ActiveRunManifest | null;
  handoff: {
    fresh: boolean;
    staleReason: string | null;
  };
  resume: {
    taskId: string;
    capsule: string;
    nextAction: string;
  } | null;
  issues: Array<{
    severity: 'warning';
    code: 'ACTIVE_RUN_HANDOFF_STALE' | 'ACTIVE_RUN_TASK_NOT_FOUND' | 'ACTIVE_RUN_MANIFEST_INVALID' | string;
    message: string;
  }>;
}
```

Implemented read-only MCP tools:

```text
hadara.active.run.read
hadara.active.run.resume
```

Current CLI read surfaces:

```bash
hadara run-state show --json
hadara run-state resume --json
```

`hadara run-state resume --json` is read-only resume guidance. It does not update active-run state, execute commands, call providers, or resume an agent process.

Future CLI writes:

```bash
hadara run-state show --json
hadara run-state start --task T-00NN --agent <agent-name> --json
hadara run-state update --next "<next step>" --json
hadara run-state complete --task T-00NN --json
hadara run-state clear --json
```

Implementation notes:

- Keep active run state under `.hadara/local/state/`; it is local mutable state, not committed portable project evidence.
- All active-run read surfaces must degrade with warnings on malformed local state.
- Active-run resume guidance resolves the canonical Task Capsule path from `taskId`; if the local manifest `capsule` differs, read surfaces warn with `ACTIVE_RUN_CAPSULE_MISMATCH` and prefer the canonical path in `resume` and `resumePrompt.mustRead`.
- Do not introduce queue, worker lane, or multi-agent scheduling concepts.
- Schema fixtures exist for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` at `src/schemas/active-run-projection.schema.json` and `src/schemas/active-run-resume.schema.json`.

Future richer manifest target from the v1.0 plan:

The canonical implemented contract is `hadara.active_run.v1` at `.hadara/local/state/active-run.json`. Future richer manifests should extend that contract or document an explicit migration; do not silently switch to the older camelCase `hadara.activeRun.v1` draft.

```json
{
  "schemaVersion": "hadara.active_run.v1",
  "runId": "run_20260524_001",
  "status": "active",
  "taskId": "T-00NN",
  "capsule": "tasks/T-00NN-example",
  "startedAt": "2026-05-24T00:00:00.000Z",
  "updatedAt": "2026-05-24T00:00:00.000Z",
  "agent": {
    "kind": "external",
    "name": "claude-code",
    "sessionId": "optional-session-id"
  },
  "mode": {
    "permission": "assisted",
    "mcp": "read-only",
    "evidenceAttach": false
  },
  "resume": {
    "lastKnownStep": "Implement active run manifest writer",
    "nextRecommendedStep": "Add stale handoff detection test",
    "requiredCommands": [
      "npm run check",
      "hadara harness validate --task T-00NN --level done --json"
    ]
  },
  "locks": {
    "singleActiveRun": true,
    "queueEnabled": false,
    "multiAgent": false
  },
  "validation": {
    "lastHarnessValidation": null,
    "lastFullCheck": null
  },
  "issues": []
}
```

Future resume projection target:

The current implemented projection is `hadara.active_run.projection.v1` with a compact `resume` object. Future MCP tool names should use dot-separated noun/action segments: `hadara.active.run.read` for the read projection and `hadara.active.run.resume` for resume guidance. Keep schema versions snake_case; do not revive the older camelCase `hadara.activeRun.read` or standalone `hadara.resume.projection` drafts.

```json
{
  "schemaVersion": "hadara.resumeProjection.v1",
  "ok": true,
  "activeRun": {
    "runId": "run_20260524_001",
    "taskId": "T-00NN",
    "status": "active"
  },
  "resumePrompt": {
    "summary": "Continue T-00NN Example Task.",
    "mustRead": [
      "docs/AGENT_HANDOFF.md",
      "tasks/T-00NN-example/TASK.md",
      "tasks/T-00NN-example/HANDOFF.md"
    ],
    "nextActions": [
      "Inspect active-run schema tests.",
      "Implement stale handoff detection.",
      "Run npm run check."
    ],
    "constraints": [
      "Do not assume multi-agent queues.",
      "Do not use MCP write tools.",
      "Attach evidence before marking done."
    ]
  },
  "issues": []
}
```

Future stale handoff detection:

```text
active-run.updatedAt > AGENT_HANDOFF.md modifiedAt + threshold
active-run.taskId not mentioned in AGENT_HANDOFF.md
active-run.resume.nextRecommendedStep missing
last completed task == active task but active status != completed
```

## Operational Debt

Current report schema:

```ts
export interface OperationalDebtReport {
  schemaVersion: 'hadara.operational_debt.v1';
  command: 'operational-debt.report';
  ok: true;
  records: OperationalDebtRecord[];
  capsuleSizeIndicators: CapsuleSizeIndicator[];
  issues: Array<{
    severity: 'warning';
    code: string;
    message: string;
    path?: string;
  }>;
}
```

Future persisted record schema:

Current T-0069 records are static in `src/services/operational-debt.ts` and documented in `docs/OPERATIONAL_DEBT.md`; no `.hadara/state/debt.jsonl` store exists. Choose the portable/project-store boundary before adding persistence.

```json
{
  "schemaVersion": "hadara.operational_debt.record.v1",
  "id": "OD-0009",
  "status": "open",
  "severity": "medium",
  "category": "continuity",
  "title": "Handoff freshness is not structurally validated",
  "source": {
    "kind": "roadmap",
    "path": "docs/ROADMAP.md"
  },
  "impact": "External agents may resume stale work after compact/session replacement.",
  "recommendedFix": "Implement active-run stale handoff detection.",
  "linkedTasks": ["T-0068"],
  "createdAt": "2026-05-24T00:00:00.000Z",
  "updatedAt": "2026-05-24T00:00:00.000Z"
}
```

Future commands:

```bash
hadara debt list --json
hadara debt show OD-0001 --json
```

Release-gate rule:

- Open high-severity debt should at least warn.
- Blocking behavior should be introduced only after false-positive risk is low.

Target categories from the v1.0 plan:

```text
continuity
validation
security
complexity
documentation
compatibility
release
```

Future debt commands and aggregate requirements:

- T-0087 implemented `hadara debt list --json`.
- T-0087 implemented `hadara debt show OD-0001 --json`.
- T-0087 implemented read-only MCP `hadara.debt.list` and `hadara.debt.show`.
- T-0087 added `ops status --json` high/open debt counts.
- T-0087 added release-gate modes for open high-severity debt: `advisory` warns with `ok: true`, while `strict` reports an error with `ok: false`. Both modes remain read-only and do not execute release/package actions.

## Redaction Hardening

Current implementation:

- `src/core/redaction.ts`
- registry/report model with compatibility wrappers
- public evidence artifact rejection through `hasBlockingRedactionFinding(report, 'high')`
- `findings.count` is a per-pattern match count and may overlap across patterns when multiple detectors match the same input span
- blocking `EvidenceArtifactPolicyError` instances may carry an internal `redactionReport`; user-facing outputs must not echo raw report content unless intentionally reduced to safe fields such as pattern ids, severities, and counts
- non-blocking redaction findings are diagnostics only. Public artifact content is copied as-is when it passes the blocking threshold; it is not automatically rewritten unless a future sanitizing mode explicitly changes that policy.
- T-0089 added a safe public artifact policy report helper for internal observability; it exposes pattern ids, severities, counts, and byte counts only. Tests prove medium diagnostics do not block public artifact collection while high/critical findings still block.

Follow-up cleanup:

- Future security CLI or broader evidence inspection surfaces should consume only reduced policy metadata and continue excluding raw artifact text, redacted text, and private paths from user-facing output.

Target registry shape:

```ts
export interface RedactionPattern {
  id: string;
  description: string;
  regex: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  replacement: string;
  enabledByDefault: boolean;
}

export interface RedactionReport {
  schemaVersion: 'hadara.redaction.report.v1';
  ok: boolean;
  inputBytes: number;
  outputBytes: number;
  findings: Array<{
    patternId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    count: number;
  }>;
  redactedText?: string;
}
```

Required pattern families:

```text
AWS Access Key ID: AKIA[0-9A-Z]{16}
AWS Secret Access Key candidate
GitHub PAT: ghp_, github_pat_
GitLab token: glpat-
Google API key: AIza[0-9A-Za-z_-]{35}
Private key block: -----BEGIN .* PRIVATE KEY-----
SSH key: openssh-key-v1
.env style: KEY=value for sensitive keys
JWT: eyJ...
Azure connection string
npm token: npm_...
```

Acceptance notes:

- High/critical public artifact findings reject public evidence.
- Summary text may be stored redacted.
- Replacement must work for patterns with and without capture groups.

Suggested CLI:

```bash
hadara security scan-artifact <path> --json
hadara security redact <path> --json
```

## Private Evidence Manifest

Current implementation:

- `visibility: private` evidence skips public artifact copy.
- Private evidence with a readable project-boundary source artifact writes raw bytes only to the ignored private portable store under `.hadara/local/portable/data/private-evidence`.
- `src/evidence/private-manifest.ts` records `hadara.privateEvidence.v1` manifests with SHA-256 hashes, byte counts, retention metadata, and explicit deferred encryption metadata.
- Private evidence manifest writes are audited to the private portable audit store.
- External absolute private source paths can still produce sanitized committed evidence metadata, but they do not create raw private portable-store copies or manifests unless a future explicit override policy is added.

Target manifest schema:

```json
{
  "schemaVersion": "hadara.privateEvidence.v1",
  "taskId": "T-00NN",
  "evidenceId": "ev_20260524_001",
  "kind": "command-log",
  "summary": "Private command output stored outside project repository.",
  "result": "passed",
  "storage": {
    "kind": "portable-store",
    "relativePath": "data/private-evidence/T-00NN/ev_20260524_001.txt",
    "encrypted": false,
    "hash": "sha256:..."
  },
  "createdAt": "2026-05-24T00:00:00.000Z",
  "retention": {
    "policy": "local-only",
    "includeInContextExport": false
  }
}
```

Minimum v1.0 requirements:

- private evidence manifest exists;
- hash is recorded;
- private evidence is excluded from context export;
- public and private artifacts remain separated;
- private evidence writes are audited;
- encryption is either implemented or explicitly deferred with manifest metadata.

Completed increment:

- T-0091 added private portable-store manifests, SHA-256 hashes, retention/deferred-encryption metadata, private audit events, and tests proving committed Task Capsule files plus context export exclude private evidence content, private source paths, and private store paths.
- T-0094 limited private evidence source artifact copying to project-boundary files by default and added the `hadara.privateEvidence.v1` schema fixture.

## Evidence List Read Model

MCP/CLI report schema:

```json
{
  "schemaVersion": "hadara.evidence.list.v1",
  "command": "evidence.list",
  "ok": true,
  "taskId": "T-00NN",
  "count": 1,
  "records": [
    {
      "schemaVersion": "hadara.evidence.v1",
      "time": "2026-05-24T00:00:00.000Z",
      "taskId": "T-00NN",
      "kind": "test-log",
      "summary": "Docker npm run check passed.",
      "result": "passed",
      "visibility": "public",
      "evidencePath": "artifacts/test-log/..."
    }
  ],
  "issues": []
}
```

Input options:

```json
{
  "taskId": "T-00NN",
  "limit": 50,
  "includePrivate": false
}
```

Degraded-read rules:

- Invalid JSONL lines should create warning issues, not crash list reports.
- Private evidence should not expose private artifact contents.
- `includePrivate` should reveal metadata only until private evidence policy is complete.

## MCP V1 Read Tools

Current and candidate default read-only tools:

```text
hadara.evidence.list
hadara.context.export
hadara.tools.list
hadara.active.run.read
hadara.active.run.resume
hadara.debt.list
```

`hadara.context.export` must return a memory payload. It must not write `.hadara/context/HADARA_CONTEXT.md`.

`hadara.context.export` input schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "format": {
      "type": "string",
      "enum": ["markdown", "json"],
      "default": "markdown"
    },
    "summaryOnly": {
      "type": "boolean",
      "default": false
    }
  }
}
```

`hadara.context.export` output schema:

```json
{
  "schemaVersion": "hadara.context.export.v1",
  "command": "context.export",
  "ok": true,
  "format": "markdown",
  "mode": "memory",
  "content": "# HADARA_CONTEXT...",
  "contextPath": null,
  "wouldWritePath": ".hadara/context/HADARA_CONTEXT.md",
  "issues": []
}
```

Read-only implementation options:

1. Read an already exported context file without generating it.
2. Return context as a memory payload without writing a project file.
3. Keep file generation CLI-only through `hadara hermes export-context`.

The recommended MCP behavior is option 2.

`hadara.tools.list` report:

```json
{
  "schemaVersion": "hadara.tools.list.v1",
  "command": "tools.list",
  "ok": true,
  "surfaces": {
    "cli": [
      {
        "name": "hadara task list --json",
        "category": "read",
        "stable": true,
        "readOnly": true,
        "enabledByDefault": true,
        "availability": "default",
        "risk": "low",
        "schemaVersion": "hadara.task.list.v1"
      },
      {
        "name": "hadara evidence collect --task <task-id> ... --json",
        "category": "write",
        "stable": true,
        "readOnly": false,
        "enabledByDefault": true,
        "availability": "default",
        "risk": "medium",
        "schemaVersion": "hadara.evidence.collect.v1"
      }
    ],
    "mcp": [
      {
        "name": "hadara.task.list",
        "category": "read",
        "stable": true,
        "readOnly": true,
        "enabledByDefault": true,
        "availability": "default",
        "risk": "low"
      },
      {
        "name": "hadara.evidence.attach",
        "category": "write",
        "stable": true,
        "readOnly": false,
        "enabledByDefault": false,
        "availability": "opt-in",
        "risk": "medium",
        "requiresApproval": true,
        "schemaVersion": "hadara.evidence.collect.v1"
      }
    ]
  },
  "disabled": [
    {
      "name": "mcp.shell.execute",
      "category": "execute",
      "availability": "disabled",
      "risk": "high",
      "reason": "Out of scope for v1.0."
    }
  ],
  "issues": []
}
```

Implemented notes:

- `hadara.tools.list.v1` is shared by `hadara tools list --json` and read-only MCP `hadara.tools.list`.
- The report is generated from `src/services/capability-registry.ts`, a neutral registry used by both the tools-list read model and MCP tool schema generation.
- The report includes read and write-capable CLI commands from the current CLI help surface, default read MCP tools, the opt-in `hadara.evidence.attach` write surface, and disabled shell/provider/release/broad-write MCP surfaces.
- `availability` is an enum: `default`, `opt-in`, `disabled`, or `deferred`; `enabledByDefault` remains as a compatibility boolean.
- It is a discovery report only; it does not enable disabled surfaces.

## Policy Matrix Refactor

Current implementation:

- `src/policy/tokenizer.ts` contains shell tokenization.
- `src/policy/presets.ts` contains exact safe command presets with risk metadata.
- `src/policy/command-risk.ts` classifies shell commands as read/test/build/write/network/destructive/release.
- `src/policy/permission-matrix.ts` maps permission mode plus command risk to the current allow/ask/deny decisions.
- `src/policy/policy.ts` remains the compatibility facade for current callers.
- `src/policy/preflight.ts` wraps policy decisions in `hadara.policy.preflight.v1`.
- `src/services/policy-service.ts` provides shared policy check/evaluate report builders for CLI/MCP parity.

Current limitations:

- PolicyService is not yet the single source of authorization for provider-originated `ActionIntent` or `ToolRequest` values.
- Policy decisions do not yet record `policy_version`, actor, surface, or structured authorization audit events.
- CLI target-command parsing still relies on simple option stripping; future work should support a `--` delimiter so command arguments like `--mode` are not confused with HADARA CLI options.
- The current matrix blocks release-risk commands outside release mode, requires explicit approval for release-risk commands in release mode, and approval-gates network-risk commands in auto/trusted mode. Future actor/surface-aware authorization may further tighten write categories.

Target module split:

```text
src/policy/tokenizer.ts
src/policy/command-risk.ts
src/policy/permission-matrix.ts
src/policy/policy.ts
src/policy/preflight.ts
src/policy/presets.ts
```

Completed increment:

- T-0090 split policy internals into the target modules while keeping existing public exports compatible; review follow-up blocked release-risk commands outside release mode, approval-gated auto/trusted network risk, and made strict release-gate CLI failures set exit code 6.

Target types:

```ts
export type PermissionMode = 'readonly' | 'assisted' | 'trusted' | 'auto' | 'release';

export type CommandRisk = 'read' | 'test' | 'build' | 'write' | 'network' | 'destructive' | 'release';

export interface PermissionRule {
  mode: PermissionMode;
  risk: CommandRisk;
  defaultAction: 'allow' | 'ask' | 'deny';
  reason: string;
}
```

Example matrix:

| Mode | read | test | build | write | network | destructive | release |
|---|---|---|---|---|---|---|---|
| readonly | allow* | deny | deny | deny | deny | deny | deny |
| assisted | allow/ask | ask | ask | ask | ask | deny | ask |
| trusted | allow | allow | allow | ask | ask | deny | ask |
| auto | allow | allow | allow | allow | ask | deny | ask |
| release | allow | allow | allow | deny | deny | deny | ask/allow specific |

`readonly` currently denies actual shell execution. A future slice must decide whether readonly shell evaluation and actual shell execution are separated.

Safe command preset schema:

```json
{
  "schemaVersion": "hadara.policy.safeCommands.v1",
  "commands": [
    {
      "id": "npm-run-check",
      "tokens": ["npm", "run", "check"],
      "risk": "test",
      "platform": "any"
    },
    {
      "id": "pytest",
      "tokens": ["pytest"],
      "risk": "test",
      "platform": "any"
    },
    {
      "id": "python-pytest-module",
      "tokens": ["python", "-m", "pytest"],
      "risk": "test",
      "platform": "any"
    },
    {
      "id": "pnpm-test",
      "tokens": ["pnpm", "test"],
      "risk": "test",
      "platform": "any"
    },
    {
      "id": "cargo-test",
      "tokens": ["cargo", "test"],
      "risk": "test",
      "platform": "any"
    },
    {
      "id": "go-test",
      "tokens": ["go", "test", "./..."],
      "risk": "test",
      "platform": "any"
    }
  ]
}
```

Acceptance notes:

- Safe command exact matching must remain.
- Commands with chained operators must not be classified as safe.
- Deny patterns need bypass regression tests.
- Document that the shell parser is not a full POSIX or PowerShell parser.

## Schema Layer

Current implementation:

- `docs/SCHEMAS.md`
- `src/schemas/schema-index.json`
- `src/core/schema.ts`
- `src/schemas/evidence-list.schema.json`
- `src/schemas/context-export.schema.json`
- `src/schemas/tools-list.schema.json`
- `src/schemas/active-run-projection.schema.json`
- `src/schemas/active-run-resume.schema.json`
- `src/schemas/private-evidence.schema.json`
- `src/schemas/release-gate.schema.json`
- `tests/unit/schema-runtime.test.ts`
- `tests/unit/schema-fixtures.test.ts`

T-0079 was planning and fixture registration only. T-0092 added limited runtime validation for active-run projection/resume reports. Broad schema validation and release gates remain future work.

Strictness plan:

- `fixture`: documentation and implementation guidance; additive properties allowed.
- `contract`: external-agent compatibility checks; core fields strict while documented extension fields remain possible.
- `releaseGate`: pre-release validation; required fields, enums, and unknown-field handling must be explicit.

The current schema fixtures are `fixture` level. Active-run projection/resume use them for runtime checks, but they should not block releases until a later capsule introduces strictness-aware release-gate policy.

Active-run projection and resume fixtures now have runtime validation because they read mutable local project state from `.hadara/local/state/active-run.json`.

Candidate files:

```text
src/core/schema.ts
src/schemas/ops-status.schema.json
src/schemas/task-list.schema.json
src/schemas/task-read.schema.json
src/schemas/evidence.schema.json
src/schemas/evidence-list.schema.json
src/schemas/harness-validate.schema.json
src/schemas/active-run.schema.json
src/schemas/active-run-projection.schema.json
src/schemas/active-run-resume.schema.json
src/schemas/compatibility-fixture.schema.json
docs/SCHEMAS.md
```

Runtime API:

```ts
export interface SchemaValidationResult {
  ok: boolean;
  schemaId: string;
  issues: Array<{
    path: string;
    code: string;
    message: string;
  }>;
}

export function validateSchema(schemaId: string, value: unknown): SchemaValidationResult;
export function loadSchema(schemaId: string): unknown;
```

Release-gate candidates:

```text
hadara status --json
hadara ops status --json
hadara task list --json
hadara task show <task-id> --json
hadara evidence collect --json
hadara harness validate --json
MCP tools/call payload text
```

## Logger / Audit

Current implementation:

- `src/core/audit.ts` exists.
- `src/core/events.ts` defines `hadara.event.v1` normalization, redaction, and JSONL-safe serialization helpers.
- `src/core/audit.ts` preserves existing audit JSONL compatibility fields and embeds a nested structured event.
- `src/schemas/event.schema.json` is registered as a fixture for `hadara.event.v1`.
- General debug log persistence remains deferred.

Candidate files:

```text
src/core/logger.ts
src/core/events.ts
src/core/audit.ts
```

Event schema:

```json
{
  "schemaVersion": "hadara.event.v1",
  "time": "2026-05-24T00:00:00.000Z",
  "level": "info",
  "eventType": "harness.validate.completed",
  "actor": "cli",
  "taskId": "T-00NN",
  "summary": "Done-level validation passed.",
  "payload": {
    "ok": true,
    "level": "done"
  }
}
```

Logging policy:

- stdout: user-facing result only;
- stderr: human-readable warning/error;
- audit JSONL: write attempts, policy decisions, evidence attach;
- debug log: optional and disabled by default.

## Dashboard Read API

Candidate local routes:

```text
GET /api/status
GET /api/tasks
GET /api/tasks/:taskId
GET /api/evidence?taskId=T-00NN
GET /api/active-run
GET /api/debt
```

Rules:

- no shell execution
- no MCP writes
- no task mutation
- no persistence from browser state
- preserve no-store/no-sniff/CSP headers

Recommended staged path:

```text
v0.3: static fixture-backed dashboard
v0.4: dashboard serve exposes /status.sample.json only
v0.5: dashboard serve exposes /api/status from createOpsStatusReport()
v0.6: dashboard reads activeRun/resume/debt/evidence read models
v1.0: static/local dashboard with clear read/write boundary
```

## Provider Adapter Preparation

Provider config schema:

```json
{
  "schemaVersion": "hadara.provider.config.v1",
  "providers": [
    {
      "id": "openai-compatible-local",
      "kind": "openai-compatible",
      "enabled": false,
      "baseUrlEnv": "HADARA_OPENAI_BASE_URL",
      "apiKeyEnv": "HADARA_OPENAI_API_KEY",
      "model": "local-model",
      "capabilities": {
        "toolCalling": false,
        "streaming": true,
        "vision": false
      }
    }
  ],
  "defaultProvider": null
}
```

Provider call report:

```json
{
  "schemaVersion": "hadara.provider.call.v1",
  "provider": "scripted",
  "model": "scripted-model",
  "ok": true,
  "input": {
    "messages": 2,
    "approxTokens": 120
  },
  "output": {
    "finishReason": "stop",
    "approxTokens": 40
  },
  "issues": []
}
```

Current T-0096 status:

- `hadara.provider.config.v1` and `hadara.provider.call.v1` are registered schema fixtures.
- Provider preparation helpers deny unknown config input fields, reject stored secret values, and assert schema-valid outputs before returning.
- Provider call reports summarize counts, approximate tokens, finish reason, and redacted issues without prompt or response content.

Policy rule:

- Provider adapters may not directly execute FileWrite, Shell, Git, Test, Release, Network, or Evidence mutation actions.
- Provider-originated actions must become `ActionIntent` or `ToolRequest` values and pass through the shared PolicyService.
- CLI policy preflight and MCP `hadara.policy.evaluate` must return decisions from the same PolicyService.
- Every allow/ask/deny decision should record actor, surface, policy_version, mode, risk, reason, and timestamp.

Deferred provider-originated ActionIntent contract sketch:

```json
{
  "schemaVersion": "hadara.provider.actionIntent.v1",
  "provider": "openai-compatible-local",
  "model": "local-model",
  "intentId": "intent_2026-05-25T00-00-00Z_abcd1234",
  "action": {
    "kind": "shell",
    "summary": "Run focused tests",
    "command": "npm test -- tests/unit/example.test.ts"
  },
  "origin": {
    "providerCallId": "call_2026-05-25T00-00-00Z_abcd1234",
    "taskId": "T-0096"
  },
  "policy": {
    "required": true,
    "decision": null
  },
  "issues": []
}
```

ActionIntent constraints:

- ActionIntent records are proposals only; they do not execute shell, write files, call providers, mutate evidence, or dispatch MCP writes.
- Provider-originated shell/file/git/test/release/network/evidence actions must be normalized into an ActionIntent and then evaluated by the shared policy service before any future executor can act.
- Actual provider adapters remain explicit opt-in and policy-gated. No adapter should be enabled by default.
- Provider call audit integration is a future step and should record redacted provider call reports plus ActionIntent ids, not prompt/response content or secret values.

## CLI Write Boundary

Principle:

- v1.0 write behavior remains CLI-owned.
- MCP write remains limited to opt-in evidence attach.
- Broad MCP writes remain out of scope.

CLI write commands:

```text
hadara task create
hadara evidence collect
hadara handoff update
hadara run-state start/update/complete
hadara debt add/update
```

Write preflight schema:

```json
{
  "schemaVersion": "hadara.write.preflight.v1",
  "ok": true,
  "command": "task.create",
  "risk": "low",
  "requiresApproval": false,
  "workspaceBoundary": "project",
  "writes": [
    "tasks/T-00NN-example",
    "docs/TASK_BOARD.md"
  ],
  "issues": []
}
```

Acceptance notes:

- Every write command should be able to compute expected write paths before writing.
- Higher-risk writes require approval in assisted mode.
- Write results are audited.
- Related read models update after the write.

## Release Gate

Release gate command sequence:

```bash
npm ci
npm run check
npm run test:contract
npm run test:harness
node dist/cli/main.js doctor --json
node dist/cli/main.js ops status --json
node dist/cli/main.js mcp serve
```

Release checklist schema:

```json
{
  "schemaVersion": "hadara.releaseGate.v1",
  "version": "1.0.0",
  "ok": true,
  "checks": [
    {
      "name": "npm run check",
      "status": "passed"
    },
    {
      "name": "CLI JSON schemas",
      "status": "passed"
    },
    {
      "name": "MCP read-only compatibility fixture",
      "status": "passed"
    },
    {
      "name": "No high severity operational debt",
      "status": "passed"
    }
  ],
  "issues": []
}
```

## V1.0 Acceptance Checklist

Functional:

- New projects can run `hadara init --profile governed`.
- Task creation/read/validation works.
- Evidence append and evidence list work.
- Handoff update and handoff read work.
- `ops status --json` includes active run, debt, MCP mode, and validation baseline.
- MCP read-only tools maintain CLI JSON parity.
- Compatibility fixture passes.
- Active run resume projection is available.
- Done-level harness validation is included in the release gate.
- Release-gate mode is explicit: `advisory` keeps high-open debt warning-only, while `strict` blocks with `ok: false`.

Security:

- Public evidence artifact secret scan is hardened.
- Binary public artifact rejection remains.
- Private evidence manifest exists.
- MCP default mode remains read-only.
- MCP write is limited to opt-in evidence attach.
- Shell execution/provider calls are default off.
- Write attempts are audited.

Quality:

- `npm run check` passes.
- Unit/contract/harness test separation remains.
- CLI/MCP parity tests exist.
- JSON schema validation tests exist.
- Dashboard read model smoke tests exist.
- Windows/WSL path boundary regressions remain.

Product:

- README or docs clearly state what HADARA is and is not.
- Single active agent/session constraint is explicit.
- v1.0 quickstart exists.
- Known limitations are documented.
- Release checklist exists.

## TUI Mockup Parity / HADARA-Native Runtime Design

This section is an unabridged import of `docs/specs/HADARA_TUI_Mockup_Parity_HADARA_Native_Runtime_Design.md` so the TUI design is available in the main v1.0 implementation planning reference without summarized-away or omitted requirements. Keep the marker-delimited body byte-for-byte aligned with the source spec body unless a later capsule intentionally updates both.

<!-- BEGIN HADARA_TUI_NATIVE_RUNTIME_DESIGN_UNABRIDGED -->
# HADARA TUI Mockup Parity with HADARA-Native Runtime Design

> 목적: 사용자가 보는 TUI 경험은 `.mockup/tui/app.js` 또는 `.mockup/tui-final`의 완성형 목업과 거의 같게 만들되, 내부 구현은 HADARA의 read-model/service/cache/policy boundary에 맞게 재구성한다.

---

## 0. Executive Summary

HADARA TUI는 목업을 단순 복붙해서 넣는 기능이 아니다. 목업은 **UX reference / interaction reference / visual reference**이고, production 구현은 HADARA의 구조적 원칙을 따라야 한다.

핵심 원칙은 다음과 같다.

```text
Mockup parity at UX layer.
HADARA-native runtime at architecture layer.
```

즉, 사용자는 다음처럼 느껴야 한다.

```text
- 목업과 거의 같은 terminal work console
- Overview / Tasks / Detail / Help
- TASK / PLAN / DECISIONS / ACCEPTANCE / EVIDENCE / HANDOFF / FILES / RISKS / TESTS 문서 탭
- search / refresh / task select / detail open / scroll
- status bar / log / loading / theme / mouse feel
- SSH/WSL/Docker terminal에서 바로 쓰는 local operations console
```

하지만 내부는 다음처럼 동작해야 한다.

```text
- shared read-model service 기반
- file-system scan 최소화
- tab switch/search/scroll은 memory state만 변경
- selected task detail만 lazy refresh
- cache는 .hadara/local/tui/ 아래 ignored local state
- cache는 evidence/source-of-truth가 아님
- shell/provider/MCP/write/release 실행 없음
- TUI command는 read-only surface
```

---

## 1. Required Mockup Code Reading

TUI parity 또는 cache/performance 작업을 수행하는 agent는 작업 전에 반드시 목업 코드를 직접 열람해야 한다.

### 1.1 Required mockup files

```text
.mockup/tui/app.js
.mockup/tui-final/src/app.js
.mockup/tui-final/README.md
```

현재 대화에서 검토한 대표 목업 파일은 `app.js`이며, 다음 영역을 반드시 읽어야 한다.

### 1.2 Required mockup functions / regions to inspect

#### Data loading and source mode

```text
SOURCE
PROJECT_ROOT
HADARA_CLI
loadData()
readFixture()
resolveCli()
collectCli()
collectCliFast()
loadDataAsync()
collectCliAsync()
collectCliFastAsync()
normalizeModel()
```

확인할 것:

```text
- fixture mode와 cli mode가 어떻게 분기되는지
- CLI subprocess를 어떤 명령으로 호출하는지
- status/tasks/task-detail/evidence/active-run/resume/debt/release/tools/write-preflight를 어떻게 모으는지
- production에서는 CLI subprocess를 default path로 쓰면 안 되는 이유
```

#### Cache and fast refresh

```text
STATE_DIR
STATE_FILE
loadStateCache()
saveStateCache()
reloadData()
reloadDataAsync()
refreshSelectedTaskDetailAsync()
fastRefresh()
fastRefreshAsync()
mergeFastUpdate()
```

확인할 것:

```text
- 목업은 .state/final-read-model-state.json에 cache를 저장한다
- full refresh와 fast refresh가 구분된다
- fast refresh는 status/tasks/active/resume 중심으로 diff를 계산한다
- selected detail refresh는 task detail/evidence만 별도로 갱신한다
```

Production HADARA에서는 `.state`를 그대로 쓰지 않는다. 반드시 다음 위치로 옮긴다.

```text
.hadara/local/tui/
```

#### Rendering and visual feel

```text
THEMES
theme
ansiFg()
ansiBg()
fg()
bg()
bold()
badge()
kindRole()
statusRole()
card()
columns()
renderHeader()
panelOverview()
panelTasks()
panelDetail()
panelHelp()
renderStatusBar()
renderFrame()
createSnapshotJson()
```

확인할 것:

```text
- HADARA Obsidian theme 색상 감각
- status badge / card / column layout
- Work Console header
- task list row format
- detail document viewer
- status bar command hint + log
- snapshot JSON envelope 구조
```

#### Interaction state

```text
state
PANELS
NUMBER_TABS
DOCS
handleKey()
handleMouse()
action()
move()
switchPanel()
filteredTaskRows()
selectFilteredTask()
normalizeTaskOffset()
resolvePanel()
resolveDocIndex()
isQuitInput()
```

확인할 것:

```text
- keyboard-first control
- panel switching
- search activation and escape/backspace behavior
- task selection and enter-to-detail behavior
- document tab key mapping
- mouse hitbox concept
- quit aliases including q, Ctrl-C, Korean ㅂ
```

#### Terminal lifecycle

```text
render()
cleanup()
killActiveChildren()
clearActiveTimers()
trackTimer()
installShutdownHandlers()
```

확인할 것:

```text
- raw terminal rendering and cleanup
- active child process cleanup
- timers cleanup
- mouse mode disable
- cursor restore
```

Production HADARA에서는 child process cleanup은 default path에서 필요 없어야 한다. CLI subprocess adapter를 별도 compatibility mode로 둔 경우에만 필요하다.

---

## 2. What Current HADARA Already Has

현재 main 기준으로 TUI는 다음 계층까지 구현되어 있다.

```text
src/tui/
  read-model.ts        # T-0100
  constants.ts         # T-0103
  layout.ts            # T-0103
  markdown.ts          # T-0103
  snapshot.ts          # T-0102/T-0103/T-0104
  state.ts             # T-0105
  terminal.ts          # T-0106

src/cli/
  tui.ts               # T-0107

CLI:
  hadara tui
  hadara tui --snapshot
```

현재 구현의 성격:

```text
- production-safe TUI kernel
- shared services direct use
- read-only terminal work console
- no cache persistence yet
- no mouse support yet
- no color/theme parity yet
- no auto/fast refresh yet
```

현재 구현은 목업보다 덜 화려하지만, 좋은 방향으로 분해되어 있다.

```text
목업 = 완성형 UX prototype
현재 구현 = production-safe TUI kernel
```

---

## 3. Why Not Copy the Mockup Directly?

목업은 단일 파일 안에 너무 많은 책임을 갖는다.

```text
- data source 선택
- CLI subprocess 호출
- cache 저장
- async refresh
- fast refresh diff
- terminal rendering
- ANSI theme
- key handling
- mouse hitbox
- process cleanup
- snapshot JSON
```

Production HADARA에서는 이 구조를 그대로 옮기면 안 된다.

문제점:

```text
1. CLI subprocess가 default data path가 되면 service parity 원칙이 약해진다.
2. .state cache 위치가 HADARA portable/local boundary와 맞지 않는다.
3. refresh loop와 terminal runtime이 read-model state와 강하게 결합된다.
4. cache가 source-of-truth처럼 오해될 수 있다.
5. 1000+ Task Capsule에서 full reload 중심 구조는 UX를 망친다.
6. child_process 기반 data adapter는 shell/provider/MCP boundary와 혼동될 수 있다.
```

따라서 목업은 다음처럼 흡수해야 한다.

```text
visual concept        -> snapshot/renderer/theme/layout
keyboard interaction  -> state reducer
terminal lifecycle    -> terminal shell
cache/fast refresh    -> .hadara/local/tui cache service
CLI source adapter    -> optional compatibility adapter, default off
```

---

## 4. Target Production Architecture

```text
hadara tui
   ↓
src/cli/tui.ts
   ↓
src/tui/terminal.ts
   ↓
src/tui/state.ts
   ↓
src/tui/snapshot.ts / future renderer.ts
   ↓
src/tui/read-model.ts
   ↓
shared HADARA services
   ↓
docs/ tasks/ .hadara/local/portable
```

### 4.1 Service-backed data

Production TUI should use direct TypeScript services first.

```text
createOpsStatusReport()
createTaskListReport()
createTaskReadReport()
createEvidenceListReport()
safeCreateActiveRunProjection()
createActiveRunResumeReport()
createOperationalDebtReport()
createReleaseGateReport()
createToolsListReport()
createWritePreflightReport()
```

CLI subprocess adapter is allowed only as:

```text
- fixture compatibility mode
- smoke/test fallback
- explicit --source cli mode if later accepted
```

It must not be the default production data path.

### 4.2 Read-only runtime

The TUI must not do:

```text
- task creation/mutation
- task status changes
- evidence writes
- artifact copies
- handoff updates
- shell execution
- provider calls
- MCP calls
- release/package execution
- dashboard/server startup
```

### 4.3 Cache as local acceleration only

Cache may exist, but only under ignored local state.

```text
.hadara/local/tui/
```

Cache must not be:

```text
- committed
- exported in context
- attached as evidence
- treated as source-of-truth
```

---

## 5. Performance Requirement for 1000+ Task Capsules

For 1000+ Task Capsules, the TUI must avoid full reload on ordinary UI actions.

### 5.1 Required behavior

```text
Tab switch:
  no file read
  no cache read
  no read-model aggregation
  only state + render

Task search:
  no file read
  no cache read
  memory task summary filtering only

Task scroll:
  local state only

Document scroll:
  loaded selected task document only

Panel switch:
  local state only

Task detail open:
  lazy load selected task detail/evidence only if not already loaded

Manual refresh:
  incremental refresh preferred

Auto refresh:
  optional, disabled by default, incremental only
```

### 5.2 Anti-patterns

```text
- createTuiReadModel() on every panel switch
- scanning tasks/ on every search key
- reading all Task Capsule docs on task list render
- parsing all evidence.jsonl on every refresh
- writing cache on every keypress
```

---

## 6. TUI Cache Design

### 6.1 Cache path

```text
.hadara/local/tui/
  task-index.json
  read-model-cache.json
  selected-task-cache/
  doc-cache/
  perf/
```

### 6.2 Cache schema draft

```json
{
  "schemaVersion": "hadara.tui.cache.v1",
  "projectRoot": "/workspace",
  "generatedAt": "2026-05-26T00:00:00.000Z",
  "taskIndex": [
    {
      "id": "T-0107",
      "title": "TUI Public CLI Entry Point",
      "status": "Done",
      "capsule": "tasks/T-0107-tui-public-cli-entry-point",
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "sha256:..."
    }
  ]
}
```

### 6.3 Cache invalidation

Use cheap invalidation first.

```text
- docs/TASK_BOARD.md mtime/hash
- tasks/ directory mtime
- selected Task Capsule file mtime/hash
- selected evidence.jsonl mtime/hash
- .hadara/local/state/active-run.json mtime
- docs/AGENT_HANDOFF.md mtime/hash
```

### 6.4 Refresh modes

```text
full:
  cold start or cache invalid

fast:
  task summary index + active-run + handoff/status signals

detail:
  selected task documents + selected evidence only

none:
  tab/search/scroll/panel state transitions
```

### 6.5 Cache failure behavior

```text
malformed cache:
  ignore and rebuild

cache write failure:
  warning only, TUI remains usable

cache read failure:
  fallback to direct read services

cache root outside allowed path:
  reject
```

---

## 7. Mockup Parity Roadmap

### T-0108 TUI Refresh Completion and CLI JSON Hardening

Purpose: fix correctness gaps before cache/performance work.

Scope:

```text
- confirm refresh-complete and detail-refresh-complete reducer branches
- add direct tests for flag clearing
- non-TTY + --json returns structured error
- process listener cleanup for hadara tui
- snapshot JSON smoke remains stable
```

Acceptance:

```text
- refreshRequested clears after refresh-complete
- detailRefreshRequested clears after detail-refresh-complete
- hadara tui --json without TTY returns JSON error envelope
- SIGINT listener cleanup does not accumulate in tests
- no project writes
```

### T-0109 TUI Local Cache and Incremental Refresh

Purpose: make TUI scale to 1000+ capsules.

Scope:

```text
- src/tui/cache.ts
- .hadara/local/tui/ cache root
- task summary index
- selected task detail/doc cache
- mtime/hash invalidation
- refresh modes: full/fast/detail
- cache policy docs
- 1000 capsule fixture benchmark
```

Acceptance:

```text
- tab switch reads zero files
- search reads zero files
- scroll reads zero files
- selected detail refresh reads selected task only
- cache writes only under .hadara/local/tui/
- context export excludes TUI cache
- 1000-capsule benchmark evidence recorded
```

### T-0110 TUI Visual Parity Pass

Purpose: make production TUI feel like the mockup.

Status: implemented by T-0110 as a read-only visual/interaction parity slice.

Scope:

```text
- HADARA Obsidian theme
- high-contrast theme
- no-color mode preserved
- status bar/log line
- loading frame
- richer overview current/previous cards
- task rows with status badges
- detail viewer polish
- internal snapshot theme/color metadata
```

Acceptance:

```text
- color mode resembles mockup
- no-color mode remains deterministic
- theme can be disabled
- snapshot text remains stable in test mode
- no write/shell/provider/MCP behavior
```

T-0110 notes:

```text
- Interactive TUI defaults to the HADARA theme.
- Snapshot smoke mode remains no-color by default; `--color --theme hadara|contrast` enables ANSI snapshots explicitly.
- CLI snapshot JSON keeps the existing compatibility envelope; an external snapshot JSON v2 contract remains deferred until a dedicated schema/compatibility capsule needs it.
```

### T-0111 TUI Mouse and Resize Support

Purpose: add optional terminal ergonomics.

Scope:

```text
- hitbox model
- click panel/task/doc tab
- resize handling
- mouse disabled by default or opt-in if necessary
- no project/cache writes from mouse actions
```

Acceptance:

```text
- mouse click state transitions are pure
- resize triggers redraw only
- no file mutation
```

### T-0112 TUI Compatibility CLI Adapter

Purpose: provide mockup-like `--source cli` compatibility without making it default.

Scope:

```text
- optional source adapter
- CLI subprocess bounded by timeout/maxBuffer
- disabled by default
- no shell execution beyond HADARA CLI itself
- not used by production default
```

Acceptance:

```text
- default TUI uses shared services
- --source cli works for compatibility smoke
- subprocess failures degrade to warnings
- no source-of-truth drift
```

---

## 8. Detailed Module Plan

### 8.1 `src/tui/cache.ts`

```ts
export interface TuiCacheOptions {
  projectRoot: string;
  cacheRoot?: string;
  enabled?: boolean;
}

export interface TuiTaskIndexEntry {
  id: string;
  title: string;
  status: string;
  capsule: string;
  mtimeMs: number;
  size: number;
  hash?: string;
}

export interface TuiCacheRecord {
  schemaVersion: 'hadara.tui.cache.v1';
  projectRoot: string;
  generatedAt: string;
  taskIndex: TuiTaskIndexEntry[];
}

export function resolveTuiCacheRoot(projectRoot: string): string;
export function readTuiCache(options: TuiCacheOptions): TuiCacheRecord | null;
export function writeTuiCache(options: TuiCacheOptions, record: TuiCacheRecord): void;
export function buildTaskIndex(projectRoot: string): TuiTaskIndexEntry[];
export function refreshTaskIndex(projectRoot: string, previous: TuiTaskIndexEntry[]): TuiTaskIndexEntry[];
```

### 8.2 `src/tui/read-model.ts`

Extend options:

```ts
export interface TuiReadModelOptions {
  selectedTaskId?: string;
  evidenceLimit?: number;
  includePrivateEvidence?: boolean;
  writePreviewTitle?: string;
  cache?: {
    enabled?: boolean;
    mode?: 'off' | 'read' | 'write' | 'read-write';
    refresh?: 'full' | 'fast' | 'detail';
  };
}
```

### 8.3 `src/tui/theme.ts`

```ts
export type TuiThemeName = 'hadara' | 'contrast' | 'none';

export interface TuiTheme {
  name: string;
  canvas: string;
  panel: string;
  panel2: string;
  border: string;
  text: string;
  text2: string;
  muted: string;
  dim: string;
  gold: string;
  gold2: string;
  teal: string;
  teal2: string;
  pass: string;
  warn: string;
  fail: string;
  violet: string;
  white: string;
  black: string;
}
```

### 8.4 `src/tui/mouse.ts`

```ts
export interface TuiHitbox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  action: 'panel' | 'task' | 'document';
  payload: string | number;
}

export function decodeMouseInput(sequence: string): TuiMouseEvent[];
export function resolveHitbox(hitboxes: TuiHitbox[], x: number, y: number): TuiHitbox | null;
```

---

## 9. CLI Behavior

### 9.1 Current commands

```bash
hadara tui
hadara tui --snapshot
hadara tui --snapshot --json
hadara tui --snapshot --compact --width 86 --height 24
```

### 9.2 Future options

```bash
hadara tui --theme hadara
hadara tui --theme contrast
hadara tui --no-color
hadara tui --cache
hadara tui --no-cache
hadara tui --refresh-ms 15000
hadara tui --source service
hadara tui --source cli
```

Default should remain:

```text
source = service
cache = read-write only after T-0109
theme = hadara for TTY, no-color for snapshot tests unless specified
auto refresh = off unless specified
```

---

## 10. Testing Strategy

### 10.1 Unit tests

```text
tests/unit/tui-state.test.ts
tests/unit/tui-snapshot.test.ts
tests/unit/tui-markdown.test.ts
tests/unit/tui-terminal.test.ts
tests/unit/tui-cli.test.ts
tests/unit/tui-cache.test.ts
tests/unit/tui-theme.test.ts
tests/unit/tui-mouse.test.ts
```

### 10.2 Performance fixture

```text
tests/fixtures/tui-large-project.ts
```

Generate:

```text
- 1000 Task Capsules
- minimal TASK.md
- minimal PLAN.md
- minimal evidence.jsonl
- TASK_BOARD.md with all rows
```

Record:

```json
{
  "taskCount": 1000,
  "coldLoadMs": 1200,
  "cachedLoadMs": 120,
  "tabSwitchMs": 1,
  "searchMs": 8,
  "detailRefreshMs": 15
}
```

Initial thresholds should be advisory. Later release gate can enforce them.

### 10.3 Boundary tests

For every TUI slice:

```text
- no Task Capsule mutation
- no evidence writes
- no handoff writes
- no shell execution
- no provider calls
- no MCP calls
- no release/package execution
```

For cache slices:

```text
allowed write:
  .hadara/local/tui/**

forbidden writes:
  docs/**
  tasks/**
  .hadara/context/**
  committed evidence files
```

---

## 11. Operator UX Target

The final TUI should feel like:

```text
HADARA Work Console
- fast startup
- status-rich overview
- quick task search
- selected Task Capsule detail
- document tabs
- evidence visibility
- active-run awareness
- release/debt signals
- read-only safety visible in UI
```

Mockup-like feel:

```text
- Obsidian dark tone
- gold/teal semantic highlights
- card-based terminal layout
- readable status bar
- clear keyboard hints
- live-ish refresh log
- smooth enough for SSH/WSL/Docker terminals
```

HADARA-native internals:

```text
- direct service calls
- local ignored cache
- source-of-truth separation
- no implicit writes
- deterministic testability
- degraded read-model warnings
- safe CLI boundaries
```

---

## 12. Non-Goals

Unless a later Task Capsule explicitly expands scope, TUI must not include:

```text
- task creation from TUI
- task status mutation from TUI
- acceptance checkbox editing
- evidence attachment from TUI
- handoff editing
- provider calls
- MCP calls
- shell execution
- release/package execution
- committed cache
- context export of TUI cache
- multi-agent control
```

---

## 13. Implementation Checklist for Agents

Before implementing any TUI parity slice:

```text
1. Read docs/design/TUI_DESIGN_NOTES.md
2. Read current src/tui modules
3. Read the mockup app.js areas relevant to the slice
4. Identify whether the feature belongs to:
   - read-model
   - cache
   - state
   - renderer
   - terminal
   - CLI
   - compatibility adapter
5. Preserve read-only boundary
6. Add focused tests
7. Add no-write regression
8. Run full Docker check
9. Run done-level harness validation
10. Update Task Board, Project State, Handoff, and Evidence
```

---

## 14. Final Direction

The desired destination is:

```text
The user feels:
  “This is the finished mockup running inside HADARA.”

The code behaves:
  “This is a HADARA-native, service-backed, read-only, cache-optimized terminal work console.”
```

This is the correct compromise:

```text
Copy the experience.
Do not copy the architecture.
Port the feel.
Rebuild the runtime.
Cache locally.
Trust only HADARA source-of-truth.
```
<!-- END HADARA_TUI_NATIVE_RUNTIME_DESIGN_UNABRIDGED -->

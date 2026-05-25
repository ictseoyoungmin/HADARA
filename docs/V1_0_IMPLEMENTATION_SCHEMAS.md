# V1.0_IMPLEMENTATION_SCHEMAS

This document captures detailed implementation schemas and file-level notes extracted from `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md`.

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

Policy rule:

- Provider adapters may not directly execute FileWrite, Shell, Git, Test, Release, Network, or Evidence mutation actions.
- Provider-originated actions must become `ActionIntent` or `ToolRequest` values and pass through the shared PolicyService.
- CLI policy preflight and MCP `hadara.policy.evaluate` must return decisions from the same PolicyService.
- Every allow/ask/deny decision should record actor, surface, policy_version, mode, risk, reason, and timestamp.

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

- New projects can run `hadara init --profile hadara-protocol`.
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

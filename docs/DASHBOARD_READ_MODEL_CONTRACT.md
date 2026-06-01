# DASHBOARD_READ_MODEL_CONTRACT

This document defines how a HADARA dashboard consumes `hadara.ops.status.v1`.

T-0055 introduced this contract for dashboard data consumption. Later dashboard slices may consume it without changing the contract.

## Data Source

Primary source:

```bash
hadara status --json
```

Equivalent source:

```bash
hadara ops status --json
```

Sample fixture:

- `docs/design/fixtures/hadara.ops.status.sample.json`

The fixture is static sample data and may not match the repository's current state. Dashboards should treat `fixtureMeta.notLiveData: true` as non-live provenance.

Planned v1.0 local dashboard read APIs are tracked in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. They are not part of the current static dashboard contract until their Task Capsules complete.

Selected-task detail work should use `hadara.task.workbench.v1` from `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` rather than parsing Task Capsule Markdown directly. The operations home remains backed by `hadara.ops.status.v1`; the workbench report is for a focused task detail/readiness panel.

Visual reference:

- `docs/design/mockups/HADARA_web_ui_v0.1_comfort_dark.html`

The comfort dark mockup is the preferred visual baseline for the dashboard shell. It defines layout direction, visual hierarchy, palette, card grouping, and navigation feel. It does not define schema, live integration, write behavior, MCP behavior, or persisted dashboard state. The read model is authoritative for dashboard data fields.

## Operations Home Mapping

| Dashboard area | Field path | Empty behavior | Degraded behavior |
|---|---|---|---|
| Topbar project phase | `project.phase` | Show `unknown`. | Show with degraded status accent if `health` is `degraded`. |
| Topbar branch | `project.branch` | Show `unknown`. | No special treatment unless issues mention source state. |
| Health indicator | `health` | Show `unknown` only if field is absent. | Show `degraded`; expose warning count from `issues`. |
| Task metric: Done | `tasks.counts.done` | Show `0`. | Show normally; warnings belong in health panel. |
| Task metric: Draft | `tasks.counts.draft` | Show `0`. | Show normally. |
| Task metric: Partial | `tasks.counts.partial` | Show `0`. | Show normally. |
| Task metric: Superseded | `tasks.counts.superseded` | Show `0`. | Show normally. |
| Task metric: In progress | `tasks.counts.inProgress` | Show `0`. | Show normally. |
| Task metric: Unknown | `tasks.counts.unknown` | Show `0`. | Highlight only when greater than zero. |
| Last completed cards | `tasks.lastCompleted[]` | Show an empty state. | Show any available cards and a degraded notice if handoff is missing. |
| Next recommended work | `tasks.nextRecommended` | Show `No recommendation available`. | Show available value or degraded empty state. |
| Current state panel | `handoff.currentState[]` | Show `No current state found`. | Show warning if `AGENT_HANDOFF_MISSING` exists. |
| Known problems panel | `handoff.knownProblems[]` | Show `No known problems listed`. | Show warning if `AGENT_HANDOFF_MISSING` exists. |
| Validation full check | `validation.latestFullCheck` | Show `No full check recorded`. | Show warning if `VALIDATION_BASELINE_MISSING` exists. |
| Validation done-level check | `validation.latestDoneLevelValidation` | Show `No done-level validation recorded`. | Show warning if `VALIDATION_BASELINE_MISSING` exists. |
| MCP default mode | `mcp.defaultMode` | Show `unknown`. | No live process warning; this is configured state only. |
| MCP evidence attach guard | `mcp.evidenceAttach` | Show guard values as unavailable. | No live process warning; this is configured state only. |
| Issues panel | `issues[]` | Hide or show `No issues`. | Show warning issue code and message. |

## Status Semantics

| Value | Color role | Meaning |
|---|---|---|
| `health: "ok"` | success | Report generated with complete source state. |
| `health: "degraded"` | warning | Report generated, but one or more source documents or validation baseline details are missing. |
| `health: "error"` | danger | Reserved for future structured report-generation failures; the current CLI rarely emits it. |
| `issues[].severity: "warning"` | warning | Dashboard should remain usable and show partial data. |
| `issues[].severity: "error"` | danger | Reserved for future hard failures. |

Suggested color roles are semantic only. Actual palette and component styling belong to a later dashboard implementation slice.

## Mockup Reference Mapping

Use the comfort dark mockup to guide placement only:

- topbar/sidebar hierarchy maps to project, branch, and health fields
- metric cards map to `tasks.counts`
- task cards map to `tasks.lastCompleted` and `tasks.nextRecommended`
- evidence/validation cards map to `validation`
- handoff panels map to `handoff.currentState`, `handoff.knownProblems`, and `handoff.nextRecommendedStep`
- operational notices map to `issues`

## Non-Goals For This Contract

- Requiring a dashboard implementation. A separate static reference dashboard may consume this contract without changing it.
- React or Vite UI.
- Live MCP stream connection.
- Current MCP process discovery.
- Provider/run/queue UI.
- Persisting dashboard state.

## Local Read API Routes

T-0097 added local read-only routes behind `hadara dashboard serve`:

```text
GET /api/status
GET /api/tasks
GET /api/evidence?taskId=T-00NN
GET /api/active-run
GET /api/debt
```

These routes must not execute shell commands, call providers, mutate tasks, perform MCP writes, or persist browser state.

A future selected-task route may expose `hadara.task.workbench.v1`, but it must remain read-only and should reuse `createTaskWorkbenchReport` rather than building a dashboard-only task parser.

Future Dashboard evidence panels should consume shared evidence semantic read models rather than interpreting raw evidence records in browser code. The intended Phase 4 sequence is: keep `hadara.evidence.v1` persisted records valid, add normalized proof semantics in shared services, expose semantic summary/issues through existing read surfaces, and only then bind Dashboard selected-task proof badges or evidence timeline tone. Evidence v2 writer and migration work must remain a separate follow-up from Dashboard rendering.

## Selected-Task Evidence Semantics

Dashboard selected-task panels must not parse `evidence.jsonl`, `EVIDENCE.md`, command summaries, or artifact paths to infer proof strength. They should use the shared read surfaces below.

| Purpose | Source | Contract |
|---|---|---|
| Selected task identity/readiness | `hadara task status --task <id> --json` | `hadara.task.workbench.v1` from `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`. |
| Evidence semantic summary | `hadara evidence lint --task <id> --json` | `summary.semantics` from `hadara.evidence.lint.v1`. |
| Evidence semantic issues | `hadara evidence lint --task <id> --json` and task protocol doctor | `issues[]` entries whose codes begin with `TASK_DONE_` or evidence semantic release/private-only codes. |

Dashboard proof badges should derive from semantic fields and issue codes only:

| Proof status | Required signal | Dashboard behavior |
|---|---|---|
| `sufficient` | `summary.semantics.byStrength["substantive-positive"] > 0` and no semantic error issue. | Show completed proof state. |
| `weak` | `TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE` or `TASK_DONE_WITH_ONLY_WEAK_EVIDENCE`. | Show blocking proof insufficiency. |
| `failed` | `TASK_DONE_WITH_FAILED_EVIDENCE`. | Show unresolved failed evidence. |
| `blocked` | `TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE`. | Show blocked proof needing explanation. |
| `private-only` | `TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE`. | Show warning; do not expose private paths. |
| `unknown` | No records or semantic summary unavailable. | Show neutral unknown state. |

Evidence rows may show legacy `kind`, `result`, time, visibility, and redacted summaries from read-only reports, but color/tone and badge meaning must come from semantic strength, category, outcome, and issue codes. Private evidence must not reveal raw private paths or private store locations.

This contract does not require a Dashboard UI implementation, new browser route, evidence writer migration, MCP write, release/package execution, or strict release-gate enforcement.

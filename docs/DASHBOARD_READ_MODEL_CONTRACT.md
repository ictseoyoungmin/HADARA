# DASHBOARD_READ_MODEL_CONTRACT

This document defines how a HADARA dashboard consumes HADARA read models, starting with `hadara.ops.status.v1`.

T-0055 introduced this contract for dashboard data consumption. Later dashboard slices may consume it without changing the contract.

Phase 5 dashboard work should move the static/sample-backed dashboard toward a live read-only operator console. The dashboard remains an observation surface: it can read existing APIs, show source provenance, and present copyable commands, but it must not execute workflow actions or mutate project state.

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
GET /api/evidence-lint?taskId=T-00NN
GET /api/active-run
GET /api/debt
GET /api/timeline
GET /api/timeline?taskId=T-00NN
GET /api/dashboard/bootstrap
GET /api/dashboard/bootstrap?selectedTaskId=T-00NN
```

These routes must not execute shell commands, call providers, mutate tasks, perform MCP writes, or persist browser state.

Phase 5 may add these read-only routes:

```text
GET /api/task-workbench?taskId=T-00NN
GET /api/release-gate?mode=<mode>
```

Any new dashboard route must remain a read model over existing services. It must not append evidence, run validation, run package/release commands, update Task Capsules, update handoff, update Task Board, call providers, invoke MCP writes, or expose raw private paths.

A future selected-task route may expose `hadara.task.workbench.v1`, but it must remain read-only and should reuse `createTaskWorkbenchReport` rather than building a dashboard-only task parser.

Future Dashboard evidence panels should consume shared evidence semantic read models rather than interpreting raw evidence records in browser code. The intended Phase 4 sequence is: keep `hadara.evidence.v1` persisted records valid, add normalized proof semantics in shared services, expose semantic summary/issues through existing read surfaces, and only then bind Dashboard selected-task proof badges or evidence timeline tone. Evidence v2 writer and migration work must remain a separate follow-up from Dashboard rendering.

## Phase 5 Live Read Binding

The first Phase 5 dashboard slice should bind the static shell to live status data conservatively:

1. Try `GET /api/status`.
2. If unavailable, fall back to the checked-in fixture.
3. If the fixture is unavailable or invalid, fall back to inline JSON.
4. Render source provenance visibly.

The runtime state wrapper should make provenance explicit:

```ts
type DashboardRuntimeSourceKind =
  | "live-api"
  | "fixture-fallback"
  | "inline-fallback"
  | "degraded";

interface DashboardRuntimeState<T> {
  data: T;
  source: {
    kind: DashboardRuntimeSourceKind;
    label: string;
    fetchedAt?: string;
    issue?: string;
  };
}
```

For T-0193, refresh is manual only. The control label should be `Refresh Status`, and the implementation must only:

- read `GET /api/status`
- fall back to the fixture
- fall back to inline JSON
- update source provenance

The refresh control must not appear to run checks, synchronize project state, update tasks, refresh evidence by executing validation, or perform remediation. Dashboard actions should be limited to "read again" and "copy command" semantics.

## Phase 5 Operator Console Sequence

Phase 5 should proceed in read-model-first slices:

| Slice | Scope | Boundary |
|---|---|---|
| T-0193 Dashboard Live Read Binding | Bind `/api/status` with fixture/inline fallback and visible provenance. | No polling, no selected-task evidence lens, no writes. |
| T-0194 Dashboard Operator Console Layout | Rework the shell into an operator console for current state, active/next work, gates, and next actions. | Layout only over existing read models; no new execution behavior. |
| T-0195 Selected Task Evidence Lens | Show selected-task readiness and proof status through workbench/evidence semantic read models. | No raw evidence meaning parsing; private-only remains an auditability warning. |
| T-0196 Dashboard Timeline Read Model | Add a deterministic read model for selected-task timeline/history. | No SSE, polling, live stream, or mutation behavior. |

Polling refresh, SSE timelines, telemetry/OTel trace bridges, multi-agent lanes, provider execution, remediation actions, and dashboard-triggered task mutation are deferred beyond the Phase 5 core sequence.

## Phase 5.5 Production Readiness

Phase 5.5 should make the served Dashboard feel production-grade without changing its authority model. The Dashboard remains an Agentic Development Governance Console backed by HADARA read models, not frontend inference or browser-persisted project snapshots.

The first screen should use a single aggregate bootstrap read:

```text
GET /api/dashboard/bootstrap
GET /api/dashboard/bootstrap?selectedTaskId=T-00NN
GET /api/dashboard/bootstrap?cache=bypass
```

T-0197 implements the bootstrap report as `hadara.dashboard.bootstrap.v1`. It includes operations status, task count/last-completed/next-work summary, timeline overview, active-run and debt summaries where available, optional compact selected-task proof, source metadata, cache metadata, and issues. It must not include full evidence lists, raw artifacts, private raw paths, or deep selected-task payloads. T-0201 adds route-level process-memory TTL cache behavior for the served bootstrap API; direct service construction may still report `status: "disabled"` when not served through the dashboard API.

Selected-task detail should move to a single aggregate read:

```text
GET /api/dashboard/task-detail?taskId=T-00NN
GET /api/dashboard/task-detail?taskId=T-00NN&cache=bypass
```

T-0199 implements the detail report as `hadara.dashboard.task_detail.v1`. It composes `hadara.task.workbench.v1`, `hadara.evidence.lint.v1`, sanitized `hadara.evidence.list.v1`, and `hadara.dashboard.timeline.v1`. Proof status must be derived from semantic issue codes and semantic summary data only, with `private-only` treated as an auditability warning rather than a Done blocker. The frontend selected-task Evidence Lens should use this route instead of fanning out across workbench, evidence lint, evidence list, and timeline routes.

T-0201 adds a process-memory TTL cache for served dashboard aggregate reads. Cache metadata reports `hit`, `miss`, `stale`, `bypass`, or `disabled`, plus key, TTL, generated time, and expiry when relevant. T-0206 scopes aggregate cache keys by a redacted project fingerprint such as `dashboard:sha256:<12hex>:bootstrap`, so multiple project roots in one Node process do not share bootstrap/detail/timeline entries. The cache stays process-memory only: it is not a database, file watcher, committed artifact, `.hadara/local` state, context-export input, evidence source, or browser project-state store. `?cache=bypass` recomputes a fresh read and does not overwrite the existing cached entry.

Browser-facing aggregate sources include a redacted project reference:

```json
{
  "projectRootRedacted": true,
  "project": {
    "kind": "project-root",
    "pathRedacted": true,
    "fingerprint": "sha256:<12hex>"
  }
}
```

The legacy `source.projectRoot` field remains during the v1 compatibility window. New dashboard consumers should use `source.project.fingerprint` and `pathRedacted` instead of displaying or keying behavior on a raw absolute path.

Cache status metadata can be inspected without exposing cached report bodies:

```text
GET /api/dashboard/cache/status
```

This route is read-only and metadata-only; it reports keys and timestamps, not cached values or private raw paths.

T-0198 makes frontend loading progressive for the first screen:

```text
shell
bootstrap-loading
bootstrap-ready
detail-loading
detail-ready
degraded
```

The shell should render immediately. Refresh must mean "read again"; it must keep the previous successful in-memory view visible while a refresh is in flight or degraded. Dashboard code must not persist project state in `localStorage`, `sessionStorage`, IndexedDB, cookies, or equivalent browser storage. T-0199 moves selected-task detail fan-out behind `/api/dashboard/task-detail`.

T-0202 makes load phase observable in the served dashboard (`shell`, `bootstrap-loading`, `bootstrap-ready`, `status-fallback-ready`, `degraded`) and limits the browser debug surface to read-only snapshot helpers. The dashboard performance budget is advisory and documented in `docs/DASHBOARD_PERFORMANCE_BUDGET.md`; unit tests should check behavior and boundaries, not wall-clock timings.

T-0203 adds optional polling only after aggregate reads, cache metadata, and degraded UX are stable. Polling is memory-only, off by default, operator-toggleable, based on repeated read-only refreshes, pauses while the document is hidden, and backs off on degraded reads. The `window.HadaraDashboard.togglePolling` debug helper is allowed because it only schedules the same read-only refresh path and remains memory-only. It must not introduce browser project-state persistence, SSE/WebSocket streaming, shell execution, provider calls, MCP writes, task/evidence/handoff mutation, release/package execution, auto-remediation, or multi-agent concurrency claims.

## Dashboard Timeline

`hadara.dashboard.timeline.v1` is the deterministic read model for the dashboard Workstream panel:

```text
GET /api/timeline
GET /api/timeline?taskId=<task-id>
```

Timeline reports are generated from existing read models and are not persisted. Every event must carry `readOnly: true`, deterministic `order`, safe title/summary metadata, and no private raw paths. T-0196 timeline support is not polling, SSE, websocket, telemetry bridge, or live trace streaming.

T-0200 hardens evidence timeline identity. Evidence events should use normalized evidence `id` when available and expose audit metadata:

| Field | Meaning |
|---|---|
| `evidenceId` | Normalized evidence read-model id, such as a legacy line-fallback id. |
| `evidenceFingerprint` | Content fingerprint for the normalized evidence record. |
| `evidenceSourceLine` | Actual `evidence.jsonl` source line when available. |
| `evidenceIdSource` | `persisted`, `content-fingerprint`, or `line-fallback`. |
| `evidenceIdStability` | `durable`, `stable-unless-edited`, or `unstable-on-reorder`. |

Dashboard consumers must not treat `legacy:*` ids with `unstable-on-reorder` as durable persisted identity. Fallback display ids such as `artifact-N` are fallback-only and should not be shown as durable evidence ids.

## Selected-Task Evidence Semantics

Dashboard selected-task panels must not parse `evidence.jsonl`, `EVIDENCE.md`, command summaries, or artifact paths to infer proof strength. They should use the shared read surfaces below.

| Purpose | Source | Contract |
|---|---|---|
| Selected task identity/readiness | `hadara task status --task <id> --json` | `hadara.task.workbench.v1` from `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`. |
| Evidence semantic summary | `GET /api/evidence-lint?taskId=<id>` / `hadara evidence lint --task <id> --json` | `summary.semantics` from `hadara.evidence.lint.v1`. |
| Evidence semantic issues | `GET /api/evidence-lint?taskId=<id>`, `hadara evidence lint --task <id> --json`, and task protocol doctor | `issues[]` entries whose codes begin with `TASK_DONE_` or evidence semantic release/private-only codes. |

Dashboard proof badges should derive from semantic fields and issue codes only:

| Proof status | Required signal | Dashboard behavior |
|---|---|---|
| `sufficient` | `summary.semantics.byStrength["substantive-positive"] > 0` and no semantic error issue. | Show completed proof state. |
| `weak` | `TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE` or `TASK_DONE_WITH_ONLY_WEAK_EVIDENCE`. | Show blocking proof insufficiency. |
| `failed` | `TASK_DONE_WITH_FAILED_EVIDENCE`. | Show unresolved failed evidence. |
| `blocked` | `TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE`. | Show blocked proof needing explanation. |
| `private-only` | `TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE`. | Show auditability warning, not a Done blocker; do not expose private paths. |
| `unknown` | No records or semantic summary unavailable. | Show neutral unknown state. |

Evidence rows may show legacy `kind`, `result`, time, visibility, and redacted summaries from read-only reports, but color/tone and badge meaning must come from semantic strength, category, outcome, and issue codes. Private evidence must not reveal raw private paths or private store locations.

If normalized evidence records expose `idSource`, `idStability`, `sourceLine`, and `fingerprint`, dashboard consumers may display those fields as audit metadata. They must not treat generated `legacy:*` ids or line-fallback identity as durable identity across reorder/delete/migration operations.

## Release Gate Display Semantics

Dashboard release readiness displays must preserve the current distinction between release gate checks and release dry-run checks:

| Surface | Required meaning |
|---|---|
| Release gate | Existence, schema validity, source/category/mode match, and strict release proof candidate selection. |
| Release dry-run | Release gate candidate selection plus freshness, package version, git commit, and manifest hash checks. |

The dashboard should label these as different proof strengths instead of collapsing them into a single generic "release ok" state.

This contract does not require a Dashboard UI implementation, new browser route, evidence writer migration, MCP write, release/package execution, or dashboard-triggered strict release-gate enforcement.

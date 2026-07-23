# ROADMAP

## Current Baseline: v0.4.3 Local-first Evidence Control Plane

Published and consumer-recycled `hadara@0.4.3` consolidates the 0.4.2 baseline around structured current state, semantic currentness, measured workflow friction, and fast session resume.

The immediate roadmap is consolidation rather than capability expansion. HADARA's product boundary is portable current state and evidence integrity across human and agent sessions; a full controller, default real-provider runtime, cloud queue, broad write-capable MCP, and a separate browser dashboard surface remain outside the current release line.

## Current Release Sequence

| Release | Product Question | Planned Evidence | Boundary |
|---|---|---|---|
| v0.4.3 | Can one local project stay current, resumable, and measurable without command growth? | Structured current-state canon; managed Markdown projections; docs-doctor currentness verdict; seven-metric basic/standard/governed workflow matrix; installed-package release smoke. | No new public command and no controller/provider/runtime expansion. |
| v0.4.4 | Does the evidence-control workflow hold outside HADARA's own repository and authors? | Three external repositories of different shapes; 20–30 real capsules per repository; workers or agents without HADARA-developer intervention; wrong next-work and removed-command/version drift tracked as zero-tolerance defects. | External validation and usability fixes only; advanced commands must remain unnecessary for ordinary work. |

The normal success path remains `task status` → real validation/evidence → guarded `task finalize`. v0.4.4 should measure where basic, standard, and governed users leave that path, and how often they ignore or correct CLI recommendations, before any capability expansion is reconsidered.

The versioned sections below preserve the capability tracks that led to the current baseline; they are historical planning context, not current release sequencing.

## Historical Freeze: v0.3 Operations Layer

### Goal

External agents can read HADARA project state, task capsules, handoff, evidence, policy decisions, and harness validation results through stable CLI JSON and read-only MCP surfaces.

### In Scope

- Single active agent/session model.
- CLI JSON contracts.
- Read-only MCP tool surface.
- Task Capsule validation.
- Evidence index validation.
- Handoff continuity.
- Policy evaluate / preflight.
- Context export with MCP usage instructions.
- Compatibility fixture for Hermes-like external agent flow.
- Terminal TUI design alignment as a read-only local work-console candidate.

### Out of Scope

- Multi-agent concurrent execution.
- MCP write tools.
- MCP shell execution.
- MCP release/package execution.
- Real provider execution as the default path.
- Live MCP dashboard stream.
- Cloud worker/queue system.

### Current Status

Most v0.3 foundations exist: Task Capsules, evidence indexing, done-level harness validation, CLI JSON read surfaces, read-only MCP tools, policy evaluation/preflight, and Operations Status JSON. The historical browser dashboard work is retained only as history; the current product boundary keeps TUI as the remaining UI surface.

T-0066 through T-0070 moved several v0.3/v0.4/v0.5 ideas from design into implementation: the Hermes-like compatibility fixture exists, project/handoff read-model parity has started, single active run state exists, operational debt tracking exists, and operations state robustness now degrades local-state failures into warnings.

Remaining work is now v1.0 hardening rather than v0.3 proof of concept: redaction hardening, evidence list/read models, broader service parity, active-run CLI/MCP surfaces, operational debt release gates, schema validation, provider adapter contracts, and release/packaging.

T-0099 adds TUI design alignment before production TUI work. The TUI is planned as a read-only terminal work console over existing read models, not a write surface or dashboard replacement.

Detailed capsule candidates live in `docs/V1_0_CAPSULE_BACKLOG.md`. Detailed schemas and implementation notes live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. Release/install/package-smoke sequencing is tracked in `docs/DEVELOPMENT_SLICES.md` and `docs/V1_0_CAPSULE_BACKLOG.md`; a workspace-local ignored supporting plan may exist under `docs/specs/` for agents.

Init scaffold Phase 1 is complete through T-0151: generic/profile-aware init docs are table-framed, optional integrations are explicit opt-ins, follow-up maintenance commands exist for doctor/upgrade/Required Reading/integration enablement, profile metadata drift is diagnosed, Required Reading registration is stricter, integration guidance writes are rollback-aware, and runtime local/private stores are no longer eagerly created by `hadara init`.

Project Protocol Consistency Phase 2 reached its product baseline in T-0160 and its strict-plan hardening follow-ups are complete through T-0164. This layer is separate from init: it keeps living project docs, Task Capsules, evidence, handoff, validation records, profile metadata, and Required Reading registration mutually consistent after real work begins. The implemented command boundary is read-first `hadara protocol doctor --json`, task/docs/profile/all scoped checks, additive doctor remediation hints for existing safe-auto fixes, profile drift remediation guidance, dry-run-first `hadara protocol remediate --fix` safe remediation commands, shared generated-table helpers, and dry-run-first `hadara task upgrade-scaffold --task <id> --json [--execute]` for non-destructive capsule scaffold upgrades.

Phase 3 Task Operator Console work is complete through T-0177. The phase built and hardened a read-oriented `hadara task status --task <id> --json` workbench projection over existing task, evidence, protocol, ready, close, and audit sources, while preserving the current no-broad-write posture. The source plan is `docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md`.

Before Phase 4 read-surface/operator UI work, Phase 3.5 focuses on operator workflow hardening: runtime CLI origin diagnostics, Docker sync-build scripting, bounded task finish/status sync, task next recommendations, schema stability classification, and focused test command UX. These capsules reduce execution-environment confusion and repetitive completion bookkeeping before TUI/MCP selected-task surfaces consume the workbench projection more heavily.

Phase 4 should begin with evidence proof semantics, not separate browser rendering or an evidence writer migration. The first Phase 4 evidence slice should keep `hadara.evidence.v1` persisted records valid, add a normalized semantic read model, classify evidence strength, summarize proof meaning, and reuse one analyzer across evidence lint, task protocol doctor, done-level harness validation, and future TUI selected-task views. Evidence v2 writer work, `EVIDENCE.md` frame migration, init scaffold changes, mass evidence migration, MCP write expansion, and strict release-gate enforcement are separate follow-up slices. A workspace-local ignored supporting spec may exist at `docs/archive/specs/evidence/EVIDENCE_PHASE4_REFACTOR_PLAN.md`; this committed roadmap records the GitHub-visible boundary.

Phase 5 should turn the existing served static dashboard into a live read-only HADARA Operator Console. The public boundary is tracked in `docs/DASHBOARD_READ_MODEL_CONTRACT.md`; a workspace-local ignored supporting spec may exist at `docs/archive/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md`. The intended sequence is live `/api/status` binding with fixture/inline fallback and visible provenance, then operator-console layout, selected-task evidence lens, and deterministic timeline read model. Dashboard actions must remain "read again" or "copy command" only: `Refresh Status` may re-read `/api/status` and update source provenance, but it must not run checks, synchronize tasks, append evidence, remediate project state, call providers, invoke MCP writes, or execute package/release commands.

Phase 5 is complete through T-0196 and Phase 5.5 Dashboard production-readiness is complete through T-0204, with T-0206 follow-up hardening for project-isolated cache keys, redacted project source references, and sidebar view switching. The local operator console now has aggregate bootstrap and selected-task detail read models, progressive frontend loading, process-memory TTL cache metadata, degraded refresh behavior that keeps the last in-memory successful view, timeline identity hardening, optional memory-only polling after cache/detail behavior is stable, and a final production-readiness boundary audit in `docs/DASHBOARD_PRODUCTION_READINESS_REVIEW.md`. The Dashboard boundary remains read-only: no shell execution, provider calls, MCP writes, evidence/task/handoff mutation, release/package execution, database, file watcher, committed cache, browser project-state storage, default SSE/WebSocket stream, auto-remediation, or multi-agent concurrency claim. Browser-facing aggregate reports now include redacted project fingerprints; legacy `source.projectRoot` remains a v1 compatibility field pending a future contract revision.

Phase 5.7 dashboard projection/read-model hardening and TUI shared-read-model alignment are now sufficient for current operator observation needs. Dashboard and TUI UI work is paused after T-0232. Do not continue polishing dashboards or terminal UI unless a concrete operator blocker appears. Deferred UI/performance items are dashboard streaming task scan, dashboard projection freshness manifests, TUI fast/full mode contract documentation, deeper tab-by-tab TUI productization, and visual/detail polish only after core workflows progress.

Phase 6 should focus on Operator Workflow Compression & Multi-Agent Compatibility. The intended order is common actor/run/plan/idempotency metadata first, then task lifecycle next-action metadata, task complete dry-run, close evidence idempotency/supersedes, handoff suggestion, Docker validation wrapper, task capsule templates, and release dry-run service decomposition. The phase is not a full multi-agent runtime and must not add early `task complete --execute`, hidden shared-doc writes, publish automation, or scheduler behavior. The local ignored Phase 6 agent-UX spec under `docs/archive/specs/agent-ux/` is explicit required reading in this workspace, while remaining intentionally uncommitted.

The previous core evidence/release readiness emphasis has been completed through T-0252: Evidence v2 writer and migration support, task finish/ready/close/audit hardening, task upgrade/remediation dry-run guards, and release/package readiness hardening are now in place. The next roadmap emphasis is Phase 6 workflow compression, starting with T-0253 Multi-Agent Command Context Contract so later convenience commands share actor/run/plan/idempotency metadata instead of retrofitting provenance after writes exist.

Stable `hadara@0.3.0` is published and consumer-recycled. The next roadmap emphasis is Phase 8 / `0.3.1` state governance: canonical status token policy, document ownership/write-boundary governance, task handoff close-state clarity, installed-package findings cleanup, read-only state consistency projection, and advisory verification gates. The program is staged under `docs/archive/specs/0.3.1/`; the first rc1 implementation sequence is staged under `docs/archive/specs/0.3.1/rc1/`.

Future documentation-routing refactor: define a lifecycle for Required Reading spec registration so completed implementation specs can move out of active routing and into historical/reference discovery without being deleted. The follow-up is recorded in `docs/REQUIRED_READING_LIFECYCLE_FOLLOWUP.md` and should be handled as a separate phase, not as a detour before the next `0.3.2` Evidence v2 task.

## v0.4 Single-Agent Run State

Track the active task/run explicitly so agents do not infer current work only from the last visible capsule or compact handoff.

Candidate scope:

- Single active run manifest.
- Stale handoff detection against active run state.
- Resume projection for the active task/run.
- CLI run-state commands.
- Read-only MCP `hadara.active.run.read` and `hadara.active.run.resume` tools.
- No queue, worker lane, or concurrent multi-agent execution.

Status: foundational implementation exists; CLI/MCP surface completion remains.

## v0.5 CLI/MCP Service Parity

Move duplicated CLI/MCP read logic into shared services and read models so external surfaces stay consistent.

Candidate scope:

- Shared project state read model.
- Shared task list/read service.
- Shared handoff read service.
- Shared policy and harness response adapters.
- Shared evidence list and context export read models.
- CLI/MCP parity regressions.

Status: project/handoff parity exists; task read, evidence, policy, harness, context export, and status service boundaries remain.

## v0.6 Safe CLI Write Boundary

Keep write behavior CLI-owned and policy/evidence-gated before any broader automation.

Candidate scope:

- Clear separation between read models and write commands.
- Structured write preflight decisions.
- Stronger acceptance/evidence completion guards.
- Private evidence manifest.
- Operational debt gate integration.
- No MCP file-write, shell, task mutation, or release/package execution.

## v0.7 Provider Adapter Preparation

Prepare real provider adapter contracts only after the operations layer is stable.

Candidate scope:

- Provider schema and adapter contract.
- Secrets-excluded contract tests.
- Explicit provider fallback behavior.
- No real provider execution as a default path.
- Provider-originated actions normalized into policy-gated intents before any execution.

## v0.8 Release/Packaging Track

Make HADARA easier to install and validate without weakening the local evidence model.

Candidate scope:

- Packaging layout.
- CI/release checks.
- Portable store migration checks.
- CLI distribution smoke tests.
- Release checklist report.
- Remote CI observation after local Docker validation. Current baseline: GitHub Actions CI on `main` has been observed successfully, while local Docker validation remains the primary reproducible evidence.

## v0.9 Terminal Work Console

Provide a local terminal UI for operators who want current HADARA state visible without leaving the terminal.

Candidate scope:

- TypeScript + Node standard terminal rendering first; no runtime TUI framework dependency unless a later capsule justifies it.
- Read-model aggregation from existing services for status, tasks, selected task detail, evidence, active-run, debt, release gate, tools, and write-preflight preview.
- Overview, Tasks, Detail, and Help panels based on `.mockup/tui-final`.
- Deterministic snapshot mode for tests and evidence.
- Keyboard-first navigation, search, refresh, clean shutdown, and optional mouse selection.
- No shell execution, provider calls, MCP calls, evidence writes, task mutation, handoff updates, release/package execution, or committed UI state.

Status: production TUI work has progressed through projection-first shared read models, `/mnt/f` snapshot startup improvements, lazy CLI loading, and Overview/Detail Markdown table cleanup through T-0232. The TUI is paused as a read-only operator observation surface; future TUI work should be limited to concrete operator blockers or documented core workflow needs.

## v1.0 Candidate

HADARA becomes a portable, evidence-backed agentic development workbench suitable for long-running single-project development.

Candidate scope:

- Stable Task Capsule lifecycle.
- Stable CLI JSON and read-only MCP operations surfaces.
- Read-only terminal TUI with clear read/write boundaries.
- Documented provider adapter path.
- Operational debt gates connected to product risk.
- Runtime schema validation for core JSON reports.
- Evidence list/read model and private evidence manifest.
- Project Protocol Consistency Layer for Task Capsule frames, cross-document doctor checks, profile drift guidance, and safe dry-run-first remediation.

## Operational Debt Track

HADARA development must track operational pain points discovered while dogfooding HADARA itself. These are not ordinary bugs; they indicate weaknesses in HADARA's continuity, validation, or scope-control model.

Structured records live in `docs/OPERATIONAL_DEBT.md`.

### Current Operational Debt

- Capsule size is not yet measured or controlled.
- Large capsule changes are not surfaced as risk signals.
- AGENTS/HANDOFF can overfit to the last completed capsule and miss the broader roadmap.
- `ACCEPTANCE.md` can be checked prematurely without sufficient implementation evidence.
- LOC/complexity growth is not yet connected to task risk.
- Handoff freshness is not yet structurally validated against roadmap state.
- Long files can accumulate too many functions before refactoring pressure is visible.

### Target Capabilities

- Capsule size indicator.
- Changed LOC / touched files / complexity utility.
- Roadmap-aware handoff validation.
- Premature acceptance guard.
- Stale handoff detection.
- Active run state summary.

# ROADMAP

## Current Freeze: v0.3 Operations Layer

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
- Static Operations Dashboard backed by status JSON / fixture.
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

Most v0.3 foundations exist: Task Capsules, evidence indexing, done-level harness validation, CLI JSON read surfaces, read-only MCP tools, policy evaluation/preflight, Operations Status JSON, and the static sample-backed dashboard server.

T-0066 through T-0070 moved several v0.3/v0.4/v0.5 ideas from design into implementation: the Hermes-like compatibility fixture exists, project/handoff read-model parity has started, single active run state exists, operational debt tracking exists, and operations state robustness now degrades local-state failures into warnings.

Remaining work is now v1.0 hardening rather than v0.3 proof of concept: redaction hardening, evidence list/read models, broader service parity, active-run CLI/MCP surfaces, operational debt release gates, schema validation, dashboard read APIs, provider adapter contracts, and release/packaging.

T-0099 adds TUI design alignment before production TUI work. The TUI is planned as a read-only terminal work console over existing read models, not a write surface or dashboard replacement.

Detailed capsule candidates live in `docs/V1_0_CAPSULE_BACKLOG.md`. Detailed schemas and implementation notes live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. Release/install/package-smoke sequencing lives in `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md`.

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

Provide a local terminal UI for operators who want current HADARA state visible without opening the browser dashboard.

Candidate scope:

- TypeScript + Node standard terminal rendering first; no runtime TUI framework dependency unless a later capsule justifies it.
- Read-model aggregation from existing services for status, tasks, selected task detail, evidence, active-run, debt, release gate, tools, and write-preflight preview.
- Overview, Tasks, Detail, and Help panels based on `.mockup/tui-final`.
- Deterministic snapshot mode for tests and evidence.
- Keyboard-first navigation, search, refresh, clean shutdown, and optional mouse selection.
- No shell execution, provider calls, MCP calls, evidence writes, task mutation, handoff updates, release/package execution, or committed UI state.

Status: design alignment is complete in T-0099; production implementation remains deferred.

## v1.0 Candidate

HADARA becomes a portable, evidence-backed agentic development workbench suitable for long-running single-project development.

Candidate scope:

- Stable Task Capsule lifecycle.
- Stable CLI JSON and read-only MCP operations surfaces.
- Static or product-served operations dashboard with clear read/write boundaries.
- Read-only terminal TUI with clear read/write boundaries.
- Documented provider adapter path.
- Operational debt gates connected to product risk.
- Runtime schema validation for core JSON reports.
- Evidence list/read model and private evidence manifest.

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

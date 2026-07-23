# TUI Design Notes

## Current Reference

- `.mockup/tui/app.js`
- `.mockup/tui-final/src/app.js`
- `.mockup/tui-final/README.md`

These files are mockups and reference implementations only. They do not define production command behavior until a main Task Capsule implements the TUI under `src/`.

## Intent

The HADARA TUI is a local terminal work console for an operator who wants to keep current project state visible while an agent works. It should be fast to open, usable over SSH/WSL/Docker terminals, and focused on the current Task Capsule without any separate browser surface.

Initial product shape:

- Overview: current work, previous work, project health, active run summary, release/debt signals, and recent issues.
- Tasks: searchable task list with status, capsule, and recency.
- Detail: selected Task Capsule documents rendered read-only, starting with `TASK.md`, `PLAN.md`, `DECISIONS.md`, `ACCEPTANCE.md`, `EVIDENCE.md`, `HANDOFF.md`, `FILES.md`, `RISKS.md`, and `TESTS.md`.
- Help: operator controls, refresh status, and read-only boundary reminders.

The TUI should make the most important HADARA continuity signals visible without requiring a browser window or manual file scanning.

## Data Sources

Production TUI data should come from existing shared read models where possible:

- `createOpsStatusReport()` for project health, phase, task counts, active-run summary, debt aggregates, and degraded-state issues.
- Task read-model services for task lists and selected Task Capsule detail.
- Evidence list service for selected-task evidence.
- Active-run projection/resume services for current work and resume guidance.
- Operational debt and release-gate read reports for risk indicators.
- Tools list and write-preflight reports only as read-only capability and expected-write previews.

The mockup currently shells out to built HADARA CLI JSON commands in `--source cli` mode and falls back to fixture data. That is acceptable for mockup validation. The production TUI should prefer direct TypeScript service calls to avoid subprocess latency and to keep CLI transport concerns separate from presentation. A CLI-subprocess adapter can remain as a compatibility or snapshot fixture path.

## Technology Choice

Start with TypeScript and Node standard terminal control:

- no React/Ink/Blessed dependency in the first integrated slice;
- internal modules for read-model aggregation, state, rendering, terminal input, and snapshot output;
- ANSI rendering with graceful no-color mode;
- deterministic snapshot mode for tests and evidence;
- keyboard-first navigation with optional mouse support.

This is intentionally conservative. The existing mockup proves the needed behavior can run with Node alone, and the main repository currently has no runtime UI dependencies. A future capsule may evaluate Ink or another TUI framework if the handcrafted renderer becomes harder to maintain than the dependency risk, but the first production slice should not make packaging or version compatibility harder.

TypeScript is allowed and preferred for the integrated version because the rest of HADARA already builds through `tsc`, shares strict types, and exposes read-model services in `src/services/`.

## Interaction Model

The initial integrated TUI should support:

- number keys or tab-like controls for Overview, Tasks, Detail, and Help;
- arrow keys/PageUp/PageDown for list and document movement;
- `/` task search across task id, title, and status;
- Enter to open the selected task detail;
- `r` to refresh read models;
- `q` or Ctrl-C to quit cleanly;
- snapshot mode with explicit width/height and JSON output for automated checks;
- optional mouse click support that only changes local selection or panel state.

The TUI must be readable at common terminal sizes. Wide layouts may use a side navigation and multi-column cards; narrow layouts should collapse into compact tabs and single-column sections.

## Boundary

Initial TUI implementation must remain read-only:

- no task creation, mutation, status changes, or acceptance checkbox changes;
- no evidence writes or artifact copies;
- no handoff updates;
- no shell execution;
- no provider calls;
- no MCP calls from the TUI;
- no release/package execution;
- no browser or server startup requirement.

If the TUI uses a cache, it must be machine-local and ignored, such as `.hadara/local/tui/` or another documented ignored local path. Committed Task Capsule files remain the evidence source of truth; cache files are not evidence unless deliberately attached through normal evidence commands.

## Development Slices

Recommended production slices:

1. TUI design alignment: document mockup learnings, boundaries, and roadmap placement. This is T-0099.
2. TUI read-model aggregator: build a typed service that combines status, tasks, selected task detail, evidence, active-run, debt, release gate, tools, and write-preflight preview data without rendering.
3. TUI snapshot renderer: render Overview/Tasks/Detail/Help to deterministic text and JSON snapshots without interactive input.
4. TUI interactive shell: add keyboard navigation, refresh, search, clean shutdown, and optional mouse selection.
5. TUI CLI entry point: expose the integrated TUI through a documented command after tests prove it preserves read-only boundaries.

## Validation

Minimum validation for the first integrated implementation:

- unit tests for read-model aggregation and degraded-source warnings;
- snapshot tests for fixture and live-service data at narrow and wide terminal sizes;
- no-color snapshot test for CI readability;
- interaction tests for key handling as pure state transitions;
- boundary test proving refresh and navigation do not call write commands, shell execution, provider adapters, or MCP tools;
- Docker `npm run check`;
- Task Capsule draft/done harness validation with evidence records.

Manual terminal smoke can be recorded as additional evidence, but it should not be the only proof.

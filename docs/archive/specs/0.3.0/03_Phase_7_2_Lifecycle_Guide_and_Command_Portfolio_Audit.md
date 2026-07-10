# Phase 7.2 — Lifecycle Guide and Command Portfolio Audit

## Status

Planned implementation specification.

## Problem

HADARA already has a meaningful task lifecycle, but similar-looking commands can be misused unless their roles are explicit.

Examples:

| Confusable Commands | Required Distinction |
|---|---|
| `task ready` vs `harness validate` | Primary readiness gate vs direct diagnostic validation. |
| `task complete` vs `task finish` | Read-only workflow compressor vs bounded status bookkeeping writer. |
| `task close` vs `task audit-close` | Append close proof vs verify already-recorded close proof. |
| `proof status` vs `ci gate` | Task proof read model vs aggregated advisory/strict gate. |
| `handoff suggest` vs `handoff update` | Read-only coordinator suggestion vs shared-doc write. |
| `release gate` vs `task ready` | Project release readiness vs capsule readiness. |

Phase 7.2 turns these distinctions into a canonical lifecycle guide and command portfolio audit.

## Goal

Create a lifecycle guide that agents can follow without reading every command, and create a portfolio audit that records why overlapping commands exist.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Physically remove commands | Compatibility windows are required. Phase 7.2 may mark aliases/deprecation candidates but must not break existing commands. |
| Change command semantics | This phase documents and projects existing semantics unless a small metadata addition is required. |
| Implement document registry | Phase 7.3. |
| Implement session start packets | Should wait until command and document registries are both available. |

## Inputs

Required reading before implementation:

```text
docs/TASK_WORKFLOW_COMMANDS.md
docs/COMMAND_SURFACE.md
src/cli/command-registry.ts
src/schemas/task-complete-flow.schema.json
src/schemas/task-finish.schema.json
src/schemas/task-ready.schema.json
src/schemas/task-close.schema.json
src/schemas/task-audit-close.schema.json
```

## Files to Add or Change

```text
docs/LIFECYCLE_GUIDE.md
docs/COMMAND_PORTFOLIO_AUDIT.md
docs/TASK_WORKFLOW_COMMANDS.md
src/cli/help.ts
src/cli/commands.ts or lifecycle-guide service file
src/schemas/lifecycle-guide.schema.json
src/schemas/command-portfolio-audit.schema.json
src/schemas/schema-index.json
tests/unit/lifecycle-guide.test.ts
tests/unit/command-portfolio-audit.test.ts
```

## Canonical Lifecycle Model

Define lifecycle stages as stable vocabulary:

| Stage | Meaning | Primary Command |
|---|---|---|
| discover | Find current/next work. | `task next` |
| create | Create a capsule if needed. | `task create` |
| inspect | Read current task state. | `task status` |
| work | Make project changes within scope. | project-specific |
| evidence | Record validation evidence. | `evidence add-command` |
| finish | Sync bounded task status bookkeeping. | `task finish` |
| ready | Check done-level readiness. | `task ready` |
| close | Append close proof after readiness passes. | `task close --execute` |
| audit | Verify close proof. | `task audit-close` |
| handoff | Suggest or update next handoff state. | `handoff suggest` / `handoff update` |

## Lifecycle Guide Report

`hadara help lifecycle --json` should return `hadara.lifecycle.guide.v1`:

```json
{
  "schemaVersion": "hadara.lifecycle.guide.v1",
  "command": "help.lifecycle",
  "ok": true,
  "primaryPath": [
    {
      "stage": "discover",
      "commandId": "task.next",
      "command": "hadara task next --json",
      "requiredness": "primary",
      "writeBoundary": "read-only",
      "when": "At session start or after completing a task."
    },
    {
      "stage": "evidence",
      "commandId": "evidence.add-command",
      "command": "hadara evidence add-command --task T-XXXX --summary \"...\" --result passed --json",
      "requiredness": "primary",
      "writeBoundary": "evidence-append",
      "when": "After running project validation or recording relevant work proof."
    }
  ],
  "diagnostics": [
    {
      "commandId": "harness.validate",
      "useWhen": "task ready reports format or done-level blockers"
    },
    {
      "commandId": "proof.explain",
      "useWhen": "proof status is stale, weak, or confusing"
    }
  ],
  "advanced": [
    { "family": "release-package", "useWhen": "release capsule only" },
    { "family": "dev-validation", "useWhen": "HADARA-dev validation only" }
  ],
  "issues": []
}
```

## Binding Consolidation Decisions

Phase 7.2 must turn the Phase 7.1 canonical/alias metadata into an explicit portfolio audit.

At minimum, decide and document the following:

| Current Surface | Decision | Canonical Surface |
|---|---|---|
| `doctor`, `init doctor`, `protocol doctor` | Consolidate conceptually under `doctor` family. Existing commands remain aliases/projections. | `doctor --scope init|protocol|docs|profile|all`, `doctor --task T-XXXX` if implemented or planned. |
| `status`, `ops status`, `run-state show/resume` | Keep `status` as project status; demote `ops status` and `run-state*` from primary help. | `status`, `task status`, `proof status`. |
| `task show`, `task status`, `task complete` | Make `task status` the canonical inspection surface; keep `task complete` read-only guide/non-primary. | `task status --view summary|full|guide` or registry-equivalent projection. |
| `task ready`, `harness validate`, `proof status`, `evidence lint` | Keep `task ready` primary; others diagnostic. | `task ready --level done`. |
| `evidence collect`, `evidence add-command` | Keep `add-command` primary for command-log evidence now; plan future `evidence add`. | `evidence add-command`, future `evidence add`. |
| `proof status`, `proof explain` | Prefer `proof status --explain`; keep `proof explain` alias if useful. | `proof status`. |
| `policy check-shell`, `policy preflight-shell`, `write preflight` | Consolidate around `policy preflight`. | `policy preflight`. |
| `package smoke`, `smoke clean-checkout`, `smoke run` | Consolidate family shape under `smoke`. | `smoke core`, `smoke package`, `smoke clean-checkout` as future/canonical naming. |
| `task upgrade-scaffold`, `protocol remediate` | Consolidate under remediation family. | `protocol remediate --fix task-scaffold`. |
| `release *` | Keep release commands separate but hidden from primary lifecycle. | `help release`. |
| `dev docker-check`, `run*`, `dashboard`, `tui`, `mcp`, `hermes`, `install` | Advanced/dev/UI/integration surfaces. | family-specific help only. |

Do not add runtime deprecation warnings until the audit is accepted and documented.

## Portfolio Audit Document

Create `docs/COMMAND_PORTFOLIO_AUDIT.md` with this structure:

```md
# COMMAND_PORTFOLIO_AUDIT

## Purpose

## Primary Lifecycle Commands

| Stage | Command ID | Role | Write Boundary | Why Primary |
|---|---|---|---|---|

## Diagnostic Commands

| Command ID | Looks Similar To | Diagnostic Role | Not Primary Because |
|---|---|---|---|

## Project/Release/Dev/UI/Integration Commands

| Family | Command IDs | Use Boundary | Hidden From Primary Lifecycle Because |
|---|---|---|---|

## Non-Overlap Decisions

| Decision | Commands | Rule | Evidence |
|---|---|---|---|

## Deprecation Candidates

| Command ID | Reason | Decision | Follow-up |
|---|---|---|---|
```

Do not add deprecation warnings unless the phase task makes an explicit accepted decision.

## Non-Overlap Rules to Encode

At minimum, document these rules:

| Rule | Required Text |
|---|---|
| `task status` | Report generation success is not readiness. Readiness lives in readiness/proof fields and `task ready`. |
| `task complete` | Read-only workflow compressor; it must not execute lifecycle steps. |
| `task finish` | May update only bounded task status bookkeeping unless future managed sections explicitly expand it. |
| `task ready` | Read-only readiness preflight; it does not append close proof. |
| `harness validate` | Diagnostic command; use when primary lifecycle reports blockers. |
| `task close` | Appends close evidence only; does not update Project State, Handoff, or broad docs. |
| `task audit-close` | Read-only verification after close. |
| `proof status/explain` | Diagnostic read models; they do not replace close/audit. |
| `ci gate` | Aggregated local/project gate; not a capsule lifecycle substitute. |
| `release *` | Release capsule/operator surfaces; never part of ordinary task lifecycle. |
| `dev docker-check` | HADARA-dev validation wrapper; external-subprocess boundary. |

## Help Output Changes

`hadara help lifecycle` text mode should show:

```text
Primary capsule lifecycle:
  1 discover  hadara task next --json
  2 create    hadara task create "..." --json
  3 inspect   hadara task status --task T-XXXX --json
  4 evidence  hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
  5 finish    hadara task finish --task T-XXXX --json
              hadara task finish --task T-XXXX --execute --json
  6 ready     hadara task ready --task T-XXXX --level done --json
  7 close     hadara task close --task T-XXXX --json
              hadara task close --task T-XXXX --execute --json
  8 audit     hadara task audit-close --task T-XXXX --json
  9 handoff   hadara handoff suggest --task T-XXXX --json

Diagnostics when blocked:
  evidence lint, proof status/explain, protocol doctor, harness validate, ci gate

Advanced:
  release/package, dev docker-check, dashboard/tui, integrations, run harness
```

## Optional Additive Metadata

If useful, add `lifecycleGuide` metadata to `task complete --json`, not to every command.

Example additive field:

```json
{
  "lifecycleGuide": {
    "currentStage": "ready",
    "primaryNextCommandId": "task.ready",
    "diagnosticCommandIds": ["harness.validate", "proof.explain"],
    "helpCommand": "hadara help lifecycle"
  }
}
```

Do not break existing `hadara.task.complete_flow.v1` consumers. If the schema cannot accept this additively, register a new schema id.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.2-1 | `docs/LIFECYCLE_GUIDE.md` exists and matches registry vocabulary. |
| AC-7.2-2 | `docs/COMMAND_PORTFOLIO_AUDIT.md` exists and documents non-overlap decisions. |
| AC-7.2-3 | `hadara help lifecycle --json` returns `hadara.lifecycle.guide.v1`. |
| AC-7.2-4 | Diagnostic commands are explicitly excluded from required primary lifecycle. |
| AC-7.2-5 | Release/dev/UI/integration commands are hidden from primary lifecycle help but discoverable through family help/commands JSON. |
| AC-7.2-6 | `TASK_WORKFLOW_COMMANDS.md`, help lifecycle, and registry lifecycle stages agree. |
| AC-7.2-7 | Tests cover at least five confusable command pairs. |
| AC-7.2-8 | `COMMAND_PORTFOLIO_AUDIT.md` records canonical, alias, diagnostic, advanced, dev-only, and release-only decisions. |
| AC-7.2-9 | Default help and lifecycle help exclude non-canonical compatibility aliases from the primary path. |

## Validation

```bash
npm run test:focused -- tests/unit/lifecycle-guide.test.ts tests/unit/command-portfolio-audit.test.ts tests/unit/help.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help lifecycle
node dist/cli/main.js help lifecycle --json
node dist/cli/main.js commands --requiredness primary --json
```

# OPERATIONS_STATUS_CONTRACT

This document defines the HADARA operations status JSON contract for dashboards and external agents.

## Command

Primary command:

```bash
hadara status --json
```

Default `hadara status --json` is the fast operator snapshot. It reads compact project state, handoff next-step, validation baseline, active-run projection, and Task Board status counts, while intentionally skipping broad operational-debt, known-problem, capsule-status, and state-consistency scans.

Use the explicit variants when a consumer needs a heavier or smaller contract:

```bash
hadara status --detail full --json
hadara status --summary-json
hadara status --state-only --json
```

`--detail full` preserves the complete `hadara.ops.status.v1` operations payload, including debt, known problems, capsule status counts, and state-consistency advisory. `--summary-json` emits `hadara.ops.statusSummary.v1`. `--state-only --json` emits `hadara.ops.statusState.v1` and is the public state-consistency replacement after `state.verify` removal.

The old `hadara ops status --json` alias now returns a structured removed-command redirect to `hadara status --json`.

Text output is intentionally minimal. External agents and dashboards should use JSON mode.

## Schema

Schema version: `hadara.ops.status.v1`

Example:

```json
{
  "schemaVersion": "hadara.ops.status.v1",
  "command": "ops.status",
  "fixtureMeta": {
    "kind": "sample",
    "notLiveData": true,
    "note": "Static sample data for dashboard design; it may not match the repository's current state."
  },
  "ok": true,
  "health": "ok",
  "project": {
    "branch": "main",
    "phase": "bootstrap-development"
  },
  "tasks": {
    "counts": {
      "done": 52,
      "draft": 0,
      "partial": 1,
      "superseded": 1,
      "inProgress": 0,
      "unknown": 0
    },
    "rawStatusCounts": {
      "Done": 52,
      "Partial": 1,
      "Superseded": 1
    },
    "normalizedStatusCounts": {
      "done": 52,
      "partial": 1,
      "superseded": 1
    },
    "lastCompleted": ["T-0050", "T-0051", "T-0052"],
    "nextRecommended": "T-0053 Operations Status JSON"
  },
  "handoff": {
    "currentState": [],
    "knownProblems": [],
    "nextRecommendedStep": []
  },
  "validation": {
    "latestFullCheck": "Docker npm ci && npm run check passed with 27 test files and 142 tests",
    "latestDoneLevelValidation": "T-0052 ok"
  },
  "activeRun": {
    "schemaVersion": "hadara.active_run.projection.v1",
    "command": "active-run.projection",
    "ok": true,
    "path": ".hadara/local/state/active-run.json",
    "activeRun": null,
    "handoff": {
      "fresh": true,
      "staleReason": null
    },
    "resume": null,
    "issues": []
  },
  "mcp": {
    "defaultMode": "read-only",
    "evidenceAttach": {
      "enabledByDefault": false,
      "requiresFlag": "--enable-evidence-attach",
      "requiresApproval": true,
      "audited": true
    }
  },
  "issues": []
}
```

## Field Rules

- `schemaVersion`, `command`, and `ok` are stable fields.
- `ok` means the status report was generated. It does not mean the project state is complete.
- `health` is the dashboard-facing operational state: `ok`, `degraded`, or `error`.
- `project.branch` is read from the local Git metadata when available; otherwise it is `unknown`.
- `project.phase` is derived from `docs/PROJECT_STATE.md`; explicit `Phase: ...` markers or a simple `## Current Phase` value are preferred.
- `tasks.counts` keeps stable dashboard-facing keys: `done`, `draft`, `partial`, `superseded`, `inProgress`, and `unknown`.
- Default fast status counts tasks from `docs/TASK_BOARD.md`. Full-detail status counts from Task Capsule metadata.
- `tasks.rawStatusCounts` preserves original source status labels for diagnostics.
- `tasks.normalizedStatusCounts` preserves normalized source status values for programmatic diagnostics.
- `tasks.lastCompleted` is derived from `docs/AGENT_HANDOFF.md` when that document exists.
- `tasks.nextRecommended` prefers current Task Board work in this order: `In Progress`, then `Draft`. It then falls back to the handoff next-step section. `Partial` rows are used only when no handoff recommendation exists, because old partial rows can represent historical residual work rather than the next active capsule.
- `handoff.*` arrays are compact excerpts from `docs/AGENT_HANDOFF.md` when that document exists; default fast status omits `knownProblems`, while full-detail status includes it.
- `validation.*` fields are compact latest validation summaries from `docs/AGENT_HANDOFF.md`, falling back to `docs/VALIDATION_HISTORY.md` when needed. Projects whose init profile does not generate those docs do not receive a missing-baseline warning until a validation source is present or registered.
- `activeRun` is a read projection of `.hadara/local/state/active-run.json`; it is local project state and must not imply queues, worker lanes, or concurrent multi-agent execution.
- `activeRun.handoff.fresh` is false when an active run exists but `docs/AGENT_HANDOFF.md` does not mention the active task id.
- `mcp.evidenceAttach` documents configured operational guard state. It is not live MCP server process inspection.
- `issues` may include warnings when expected source documents are missing or validation baseline details are unavailable. Expected documents are profile/registry-aware: `docs/AGENT_HANDOFF.md` is required for governed and HADARA-dev projects, or when the docs registry explicitly lists it; `docs/DEVELOPMENT_SLICES.md` is required only when the project registry/profile expects it. Warning-only reports keep `ok: true` and set `health: "degraded"` so dashboards can render degraded snapshots.
- Future evidence/debt/dashboard read models should follow the T-0070 robustness rule: local mutable state or malformed optional indexes should degrade with structured warnings instead of crashing the whole read report.

## Summary and State-Only Variants

`hadara.ops.statusSummary.v1` keeps only health, project, task counts, last completed, next recommendation, validation, optional state consistency, and issues. It is intended for shell automation that does not need dashboard panels.

`hadara.ops.statusState.v1` contains only:

```json
{
  "schemaVersion": "hadara.ops.statusState.v1",
  "command": "status.state",
  "ok": true,
  "stateConsistency": {}
}
```

Use `--state-issue-limit <n>` with `--state-only` or `--detail full` when a consumer needs bounded state advisory output.

## Health Semantics

| Health | Meaning |
|---|---|
| `ok` | Report was generated and no issues were found. |
| `degraded` | Report was generated, but one or more warning issues indicate incomplete source state. |
| `error` | Reserved for future report-generation failures that still return a structured status report; the current CLI rarely emits it. |

## Warning Issue Codes

| Code | Meaning |
|---|---|
| `PROJECT_STATE_MISSING` | `docs/PROJECT_STATE.md` was not found. |
| `AGENT_HANDOFF_MISSING` | `docs/AGENT_HANDOFF.md` was expected by the project profile or docs registry but was not found. |
| `TASK_BOARD_MISSING` | `docs/TASK_BOARD.md` was not found. |
| `DEVELOPMENT_SLICES_MISSING` | `docs/DEVELOPMENT_SLICES.md` was expected by the project profile or docs registry but was not found. |
| `VALIDATION_BASELINE_MISSING` | No latest validation baseline was found even though a validation source was present or expected. |

## MCP Runtime Boundary

The `mcp` object is a configured capability snapshot. T-0054 does not inspect:

- current server process status
- live read-only versus evidence attach-enabled process state
- latest MCP smoke result beyond documented validation summaries
- latest MCP audit event

## Non-Goals

- Dashboard rendering.
- Live streaming status.
- Provider calls.
- Shell execution.
- MCP write expansion.

## Planned V1.0 Extensions

The v1.0 technical plan expects Operations Status or adjacent read models to eventually include:

- evidence list summaries;
- operational debt aggregate counts;
- richer active-run resume projections;
- release-gate validation summaries;
- schema-validation status for core JSON surfaces.

Detailed target schemas live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

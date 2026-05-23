# OPERATIONS_STATUS_CONTRACT

This document defines the HADARA operations status JSON contract for dashboards and external agents.

## Command

Primary command:

```bash
hadara status --json
```

Alias:

```bash
hadara ops status --json
```

Text output is intentionally minimal in T-0053. External agents and dashboards should use JSON mode.

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
- `tasks.rawStatusCounts` preserves original source status labels for diagnostics.
- `tasks.normalizedStatusCounts` preserves normalized source status values for programmatic diagnostics.
- `tasks.lastCompleted` is derived from `docs/AGENT_HANDOFF.md`.
- `tasks.nextRecommended` is derived from the handoff next-step section when available.
- `handoff.*` arrays are compact excerpts from `docs/AGENT_HANDOFF.md`.
- `validation.*` fields are compact latest validation summaries from `docs/AGENT_HANDOFF.md`, falling back to `docs/VALIDATION_HISTORY.md` when needed.
- `mcp.evidenceAttach` documents configured operational guard state. It is not live MCP server process inspection.
- `issues` may include warnings when source documents are missing or validation baseline details are unavailable. Warning-only reports keep `ok: true` and set `health: "degraded"` so dashboards can render degraded snapshots.

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
| `AGENT_HANDOFF_MISSING` | `docs/AGENT_HANDOFF.md` was not found. |
| `TASK_BOARD_MISSING` | `docs/TASK_BOARD.md` was not found. |
| `DEVELOPMENT_SLICES_MISSING` | `docs/DEVELOPMENT_SLICES.md` was not found. |
| `VALIDATION_BASELINE_MISSING` | No latest validation baseline was found in handoff or validation history. |

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

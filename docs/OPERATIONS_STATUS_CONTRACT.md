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
  "ok": true,
  "project": {
    "branch": "main",
    "phase": "bootstrap-development"
  },
  "tasks": {
    "counts": {
      "done": 52,
      "draft": 0,
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
- `project.branch` is read from the local Git metadata when available; otherwise it is `unknown`.
- `project.phase` is derived from `docs/PROJECT_STATE.md`.
- `tasks.counts` is derived from Task Capsule status values.
- `tasks.lastCompleted` is derived from `docs/AGENT_HANDOFF.md`.
- `tasks.nextRecommended` is derived from the handoff next-step section when available.
- `handoff.*` arrays are compact excerpts from `docs/AGENT_HANDOFF.md`.
- `validation.*` fields are compact latest validation summaries from `docs/AGENT_HANDOFF.md`.
- `mcp.evidenceAttach` documents the current operational guard state.

## Non-Goals

- Dashboard rendering.
- Live streaming status.
- Provider calls.
- Shell execution.
- MCP write expansion.

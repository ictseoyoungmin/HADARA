# Phase 8.5 - State Verify and Advisory Gates

## Status

Planned implementation specification.

## Problem

A state projection is useful only if workers see it at the right time.

If the projection is hidden behind an obscure command, agents may still close tasks with nearby stale state. If it blocks too early, historical drift can make normal work noisy.

## Goal

Surface state consistency projection through existing advisory and readiness paths in a worker-friendly way, without adding automatic repair or broad write behavior.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Strict CI failure for all historical drift by default. | Rollout should be advisory first. |
| Auto-remediation. | Repair needs separate dry-run-first specs. |
| Broad registry rewrite. | Registration cleanup is handled by docs governance tasks. |
| Release publish gating change. | Release gates should consume state projection only after explicit release-readiness work. |

## Integration Options

| Surface | Initial Behavior |
|---|---|
| `hadara status --json` | Add compact state consistency summary and issue count. |
| `hadara protocol doctor --json` | Add state-consistency area with warnings/errors. |
| `hadara ci gate --mode advisory --json` | Include projection issues as advisory checks. |
| `hadara ci gate --mode strict --json` | Defer strict blocking until rollout criteria are met. |
| `hadara task ready --level done --json` | May include task-local drift checks from Phase 8.2. |

## Advisory Severity Policy

| Issue Class | Advisory Severity | Strict Behavior in rc1 |
|---|---|---|
| Missing latest task in Project State or Handoff | warning | warning |
| Task Board row missing for active task | error | error |
| Missing task capsule path | error | error |
| Stale close proof for latest completed task | warning | warning |
| Done task handoff pending-close wording | warning | warning or task-local error if in active task ready |
| Done task PLAN In Progress row | error for task-local ready | warning in global projection |
| Completed 0.3.0 docs still active Required Reading | warning | warning |

## JSON Contract Additions

Existing reports should use additive fields.

Example:

```json
{
  "stateConsistency": {
    "schemaVersion": "hadara.stateProjection.v1",
    "stateConsistency": "warning",
    "issueCount": 2,
    "issues": [
      {
        "severity": "warning",
        "code": "STATE_HANDOFF_STATUS_DRIFT",
        "paths": ["tasks/T-0317.../HANDOFF.md"],
        "fixHint": "Persist TaskStatus only; read CloseState from audit/proof/state read models."
      }
    ]
  }
}
```

## Worker Ergonomics

Reports should distinguish:

```text
Must fix before closing this task
Should fix before handing off
Historical warning only
```

Avoid long prose. Provide:

```text
code
severity
paths
fixHint
next command when available
```

## Tests

Recommended focused tests:

```bash
npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/status-json.test.ts tests/unit/protocol-consistency.test.ts tests/unit/ci-gate.test.ts tests/unit/task-ready.test.ts
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | State projection is visible from at least one common read-only operator surface. |
| AC-2 | Advisory CI can report state consistency without hidden writes. |
| AC-3 | Task-local done readiness can block high-confidence close-source drift. |
| AC-4 | Historical/global drift stays warning-only unless explicitly configured. |
| AC-5 | All issues include code, severity, path, and fix hint. |

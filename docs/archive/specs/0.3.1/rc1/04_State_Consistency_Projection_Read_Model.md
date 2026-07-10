# rc1 Capsule 4 - State Consistency Projection Read Model

## Capsule Goal

Implement the first read-only state consistency projection over existing HADARA artifacts.

## Scope

| In Scope | Notes |
|---|---|
| Add a service that extracts state from Task Board, task capsules, Project State, Agent Handoff, docs registry, release readiness, and evidence. | Read-only only. |
| Emit `hadara.stateProjection.v1` or an equivalent additive report. | Stable enough for later consumers. |
| Detect latest task mismatch, active task mismatch, missing capsule, stale close proof, stale handoff wording, and plan drift. | Focus on high-value dogfood drift. |
| Provide path and fixHint for every issue. | Worker-friendly output. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic repair. | Future dry-run-first task. |
| Context graph. | Later Phase 8+ work. |
| CI strict blocking. | Capsule 5. |
| Historical migration. | Separate task. |

## Files Likely to Change

```text
src/services/state-projection.ts
src/cli/status.ts or protocol doctor adapter
src/schemas/schema-index.json
docs/SCHEMAS.md
tests/unit/state-projection.test.ts
tests/unit/status-json.test.ts
```

## Tests

```bash
npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/status-json.test.ts
npm run dev:docker-sync-build
git diff --check
```

## Done Criteria

| ID | Criterion |
|---|---|
| DC-1 | Projection is read-only. |
| DC-2 | Projection includes source paths and extracted values. |
| DC-3 | Known drift fixtures produce expected issue codes. |
| DC-4 | Clean fixture reports consistent. |
| DC-5 | Missing optional sources degrade with warnings, not crashes. |

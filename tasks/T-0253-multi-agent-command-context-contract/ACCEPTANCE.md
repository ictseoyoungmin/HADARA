# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Common actor context type and schema exist. | Done | `src/core/actor-context.ts`; `src/schemas/actor-context.schema.json`; focused tests. |
| AC-2 | Common plan context type and schema exist. | Done | `src/core/plan-context.ts`; `src/schemas/plan-context.schema.json`; focused tests. |
| AC-3 | Common next action type and schema exist. | Done | `src/core/next-action.ts`; `src/schemas/next-action.schema.json`; focused tests. |
| AC-4 | Missing actor values default to `unknown` / `local` / `operator` / `null`. | Done | `resolveHadaraActorContext()` focused test. |
| AC-5 | Defaulting emits `HADARA_ACTOR_CONTEXT_DEFAULTED`. | Done | `actor-context.test.ts`. |
| AC-6 | Existing command behavior is unchanged. | Done | Full Docker validation passed; no existing command handlers changed. |
| AC-7 | Docker validation passes. | Done | Docker focused test passed 3 files / 27 tests; Docker sync-build passed 93 files / 632 tests. |
| AC-8 | Evidence is attached and handoff/state docs are updated. | Done | Evidence records attached; Project State, Agent Handoff, Development Slices, and capsule handoff updated. |

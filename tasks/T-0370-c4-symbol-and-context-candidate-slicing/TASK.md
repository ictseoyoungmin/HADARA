# T-0370 C4 Symbol and Context Candidate Slicing

## Metadata

| Field | Value |
|---|---|
| ID | T-0370 |
| Title | C4 Symbol and Context Candidate Slicing |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Complete the remaining C4 slice read strategies. | Add read-only `--symbol` and `--task --candidate` handling on top of the T-0369 C4 core, while preserving C6 speed boundaries and single-file raw text output. |

## Scope

| In Scope | Reason |
|---|---|
| Symbol-neighborhood slicing | Resolve exported symbols through the deterministic C2 code index and return bounded original-text neighborhoods without broad output. |
| Context-pack candidate slicing | Resolve a C3 `sliceCandidates[]` id for a task and delegate to the candidate's strategy/path. |
| Contract/schema alignment | Add `context-candidate` and missing symbol/candidate issue codes to `hadara.contextSlice.v1`. |
| CLI/options/registry docs | Expose `--symbol`, `--task`, and `--candidate` through `hadara context slice` and command metadata. |
| Tests/evidence/docs | Cover symbol success/not-found, candidate success/not-found, schema validation, and read-only behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Persistent slice cache | C4 returns exact source text; no persistent slice cache is introduced by default. |
| Parser-backed exact symbol body ranges | Current C2 symbols only provide declaration line; use bounded neighborhoods unless future C2 stores precise end lines. |
| New graph/cache write surfaces | This task may read graph/pack/index outputs but must not add implicit cache writes. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-19 | In Progress | Scoped remaining C4 symbol and context-pack candidate slice strategies after T-0369 core closure. | TASK/PLAN/ACCEPTANCE/FILES updates |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->

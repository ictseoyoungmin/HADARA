# T-0304 Workflow Documentation Timing and Concurrency Guidance

## Metadata

| Field | Value |
|---|---|
| ID | T-0304 |
| Title | Workflow Documentation Timing and Concurrency Guidance |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Make documentation timing and write coordination explicit. | Root and generated workflow docs tell agents to update docs incrementally, parallelize read-only work, and serialize HADARA writes. |

## Scope

| In Scope | Reason |
|---|---|
| Root workflow docs | Update AGENTS, SOP, and task workflow command docs with incremental documentation timing and read-parallel/write-serialized guidance. |
| Generated scaffold docs | Update `src/cli/init.ts` templates so new projects receive the same guidance. |
| Regression tests | Cover root and generated docs wording. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| CLI behavior changes | This capsule is docs/template guidance only. |
| Task Board preservation behavior | Reserved for T-0305. |
| Required-reading tier command output | Reserved for T-0308. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-12 | Draft | Initial task scaffold. | `hadara task create`. |
| 2026-06-12 | Active | Implementing T-0304 documentation timing and concurrency guidance. | This capsule. |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->

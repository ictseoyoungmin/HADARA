# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs, workflow docs, C6 specs, and performance baseline. | Done | Session reads |
| 2 | Inspect current code-index extraction and cache warm/write path. | Done | `src/context/code-index.ts`; `src/context/context-cache-store.ts` |
| 3 | Add per-file code-index cache/reuse mechanics for explicit warm execute. | Done | `ev:T-0377:0dc1b0f01e0f4902aebe2b82` |
| 4 | Preserve read-command no-write behavior and stale/corrupt fallback semantics. | Done | `ev:T-0377:0dc1b0f01e0f4902aebe2b82`; `ev:T-0377:811d2af2ef5142b4be235cc2` |
| 5 | Add focused tests for unchanged-file reuse, changed-file recompute, corrupt per-file fallback, and include-code read behavior. | Done | `ev:T-0377:0dc1b0f01e0f4902aebe2b82` |
| 6 | Run Docker focused/full validation, refresh `dist`, run built CLI smokes, record evidence, update shared docs, finish/close/audit, and commit. | Done | `ev:T-0377:d6bf4440e99f41938bef26e7`; `ev:T-0377:96876f787b9c4600a3b65f28`; finish executed |

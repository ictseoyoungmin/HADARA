# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs, task workflow docs, C6 specs, performance baseline, and active capsule docs. | Done | Session reads |
| 2 | Inspect current context graph, cache warm/store, source manifest, and context pack implementations. | Done | Implementation review |
| 3 | Add graph-core shard write/read support without making read commands write. | Done | `ev:T-0374:860bb8bc1a8845eb8fd03eb8` |
| 4 | Add context pack warm path over fresh graph-core cache with explicit fallback metadata. | Done | `ev:T-0374:1500f663db95403ea409838c` |
| 5 | Add focused regression tests and built CLI smokes. | Done | `ev:T-0374:860bb8bc1a8845eb8fd03eb8`, `ev:T-0374:1500f663db95403ea409838c` |
| 6 | Attach evidence, finish capsule docs, update shared state, and run lifecycle close. | Done | `ev:T-0374:86aabccd90cc46b3875731f7` |

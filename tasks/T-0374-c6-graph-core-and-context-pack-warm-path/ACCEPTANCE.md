# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `context cache warm --execute` can write a graph-core shard derived from fresh non-code graph/state sources. | Met | `ev:T-0374:860bb8bc1a8845eb8fd03eb8`, `ev:T-0374:1500f663db95403ea409838c` |
| AC-2 | `context graph --json` can read a fresh graph-core shard without recomputing live extractor output, while preserving read-only behavior. | Met | `ev:T-0374:860bb8bc1a8845eb8fd03eb8`, `ev:T-0374:1500f663db95403ea409838c` |
| AC-3 | `context pack --task <id> --json` can consume the fresh graph-core shard instead of rebuilding the live graph, with cache metadata and stale/missing fallback reporting. | Met | `ev:T-0374:860bb8bc1a8845eb8fd03eb8`, `ev:T-0374:1500f663db95403ea409838c` |
| AC-4 | Focused tests cover cache hit, fallback adjacency, and no-write read command behavior. | Met | `ev:T-0374:860bb8bc1a8845eb8fd03eb8` |
| AC-5 | Evidence is attached and handoff/shared state docs are updated before finish/close. | Met | `ev:T-0374:86aabccd90cc46b3875731f7` |

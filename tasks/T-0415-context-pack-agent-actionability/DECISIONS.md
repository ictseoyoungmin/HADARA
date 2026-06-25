# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `agentActions` to `hadara.contextPack.v1` instead of changing existing `readFirst`/`sliceCandidates` semantics. | Accepted | Existing consumers can keep using the old buckets, while agents get a direct prioritized command surface. | ev:T-0415:6c8f98833d5549ea84a7bcdd |
| D-2 | Keep every generated action read-only. | Accepted | Context pack is a read model; raw reads still go through `context slice` and validation suggestions remain non-mutating read checks. | ev:T-0415:0c6e6ab98080440ea5a11fd3 |
| D-3 | Improve ranking with task-local/source-specific bonuses rather than replacing the graph scorer. | Accepted | This keeps scope bounded and preserves existing graph relevance while reducing broad-doc-first friction observed during HADARA-dev use. | ev:T-0415:6c8f98833d5549ea84a7bcdd |

# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Verify Markdown/source diff whitespace. | Yes | Passed | `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| `rg -n "Speed-First Decision Summary|Graphify Comparison and Lessons|Warm Cache Optimizations|Required Existing Code Changes|C6.3 Cache Warm Command" docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | Verify the spec contains the requested C6/Graphify/cache-warm guidance. | Yes | Passed | `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| `rg -n "Cache warm command, phase 1|Cache warm command shard phases" docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | Verify worker plan C6 sequence matches the hardened spec. | Yes | Passed | `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| npm test | Runtime test suite. | No | Not Run | Documentation-only change. |
| npm run check | Full repository check. | No | Not Run | Documentation-only change; no code or schema behavior changed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | Not applicable; no security boundary changed. |
| Integration smoke | No | Only if integration surface changes. | Not Run | Not applicable; no integration surface changed. |

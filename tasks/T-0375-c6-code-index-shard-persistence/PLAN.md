# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs, task workflow docs, C2/C6 specs, architecture, security, and validation baseline. | Done | Session reads |
| 2 | Inspect current code index, code graph extractor, cache warm/store, context graph orchestration, and tests. | Done | Implementation review |
| 3 | Add code-index shard record helpers and warm execute integration. | Done | ev:T-0375:b292024f4a504e08b624f834 |
| 4 | Route `context graph --include-code` through a fresh code-index shard without read-command writes. | Done | ev:T-0375:b292024f4a504e08b624f834 |
| 5 | Add focused regression tests and built CLI smokes. | Done | ev:T-0375:b292024f4a504e08b624f834; ev:T-0375:a4f37048f61b4709b68d8550 |
| 6 | Attach evidence and update capsule/shared close-source docs before lifecycle finish/close. | Done | ev:T-0375:cf8bf56ec33d4847be643074 |

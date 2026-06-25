# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Context pack emits additive read-only `agentActions` with prioritized commands and structured args where available. | Met | ev:T-0415:6c8f98833d5549ea84a7bcdd, ev:T-0415:0c6e6ab98080440ea5a11fd3 |
| AC-2 | Task-local and source-specific context ranking/reasons are more concrete while preserving existing raw slice boundary metadata. | Met | ev:T-0415:6c8f98833d5549ea84a7bcdd |
| AC-3 | Schema, CLI JSON contract, and schema docs are updated for the additive contract. | Met | ev:T-0415:6c8f98833d5549ea84a7bcdd |
| AC-4 | Focused tests and built CLI smoke validate the changed behavior without cache/write mutation. | Met | ev:T-0415:6c8f98833d5549ea84a7bcdd, ev:T-0415:0c6e6ab98080440ea5a11fd3, ev:T-0415:06c1d66f50b445389b6b4c20 |
| AC-5 | Evidence, handoff, and shared state docs are updated before finalize. | Met | ev:T-0415:6c8f98833d5549ea84a7bcdd, ev:T-0415:0c6e6ab98080440ea5a11fd3 |

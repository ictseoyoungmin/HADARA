# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `context cache warm --execute` can write a schema-valid code-index shard under `.hadara/local/cache/context/code-index.json`. | Met | ev:T-0375:b292024f4a504e08b624f834 |
| AC-2 | `context graph --include-code --json` can consume a fresh code-index shard read-only and report cache metadata showing code-index reuse. | Met | ev:T-0375:b292024f4a504e08b624f834 |
| AC-3 | Missing/stale/corrupt/schema-mismatched code-index shard states fall back to live extraction without read-command writes. | Met | ev:T-0375:b292024f4a504e08b624f834 |
| AC-4 | Focused tests cover warm write, fresh hit, stale fallback, and no-write read behavior. | Met | ev:T-0375:b292024f4a504e08b624f834 |
| AC-5 | Docker validation, built CLI smoke, evidence, shared docs, and close-source docs are complete before lifecycle finish/close. | Met | ev:T-0375:cf8bf56ec33d4847be643074; ev:T-0375:a4f37048f61b4709b68d8550 |

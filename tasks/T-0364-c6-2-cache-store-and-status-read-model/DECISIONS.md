# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `context cache status --json` before `context cache warm --execute`. | Accepted | Status is read-only and lets agents see freshness/miss/corrupt information without introducing a new local cache write command in the same slice. | T-0364 scope |
| D-2 | Implement generic cache record/store helpers now, but exercise writes only in unit tests. | Accepted | Future warm commands need atomic write/read primitives; public write semantics should remain a separate reviewed capsule. | T-0364 scope |

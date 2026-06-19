# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `context cache warm --json` emits schema-valid dry-run report and does not write cache files. | Met | `ev:T-0366:4f6faf93c8a545c3bd703eef` |
| AC-2 | `context cache warm --execute --json` writes schema-valid source-manifest cache atomically under `.hadara/local/cache/context/source-manifest.json`. | Met | `ev:T-0366:4f6faf93c8a545c3bd703eef` |
| AC-3 | After execute, `context cache status --json` reports a fresh hit when sources are unchanged. | Met | `ev:T-0366:4f6faf93c8a545c3bd703eef` |
| AC-4 | Corrupt or stale existing source-manifest cache is reported and execute repairs/refreshes it. | Met | `ev:T-0366:bb820cfa71dd40659552eb35` |
| AC-5 | Command registry, CLI JSON contract, command surface docs, schema docs, schema index/runtime registration, and focused tests are updated. | Met | `ev:T-0366:bb820cfa71dd40659552eb35` |
| AC-6 | Docker validation and built CLI smokes are recorded as evidence. | Met | `ev:T-0366:bb820cfa71dd40659552eb35`; `ev:T-0366:35afe89a67644c92b2434ef6`; `ev:T-0366:4f6faf93c8a545c3bd703eef` |

# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara session start --json` returns `hadara.sessionStart.v1` by composing context pack/state/proof guidance without writes. | Met | `ev:T-0378:dd42b8f8ded34d988a2090a1` |
| AC-2 | The report includes bounded lifecycle commands, current-state summary, context pack, known problems, cache/degraded metadata, and issues. | Met | `ev:T-0378:dd42b8f8ded34d988a2090a1` |
| AC-3 | Schema, command registry, service/CLI tests, and built CLI smoke cover the new surface. | Met | `ev:T-0378:b3e1cc3b1b6d44b4a68c9bf0`, `ev:T-0378:2c321128b97c4efda50ee1ba`, `ev:T-0378:dd42b8f8ded34d988a2090a1` |
| AC-4 | Evidence is attached and shared state/handoff docs reflect T-0378. | Met | `ev:T-0378:59772865b91049d6b79fa3ce`; shared docs updated before finish/close. |

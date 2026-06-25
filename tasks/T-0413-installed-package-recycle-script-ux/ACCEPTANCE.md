# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara package recycle --json` emits a dry-run-first installed-package recycle plan without registry/install execution. | Met | ev:T-0413:db037677d84640d39722a7c7 |
| AC-2 | Execute implementation is explicit and reduced: registry metadata, isolated install, installed CLI lifecycle/init/task/context/session smokes, cleanup, no publish/release mutation. | Met | ev:T-0413:db037677d84640d39722a7c7 |
| AC-3 | Schema, command registry, tools projection, docs, and focused tests cover the new surface. | Met | ev:T-0413:db037677d84640d39722a7c7 |
| AC-4 | Validation evidence is attached and capsule/shared handoff docs are updated before finalize. | Met | ev:T-0413:db037677d84640d39722a7c7 |

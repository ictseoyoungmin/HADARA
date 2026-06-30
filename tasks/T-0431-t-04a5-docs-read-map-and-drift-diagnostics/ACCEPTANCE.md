# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara docs read-map --task T-XXXX --json` returns read-first, read-if-needed, do-not-read, and drift-warning buckets. | Done | `ev:T-0431:a81383c6d7894693a45a95ed` |
| AC-2 | Read-map entries expose derived read tier, authority, and edit policy metadata axes. | Done | `tests/unit/docs-registry.test.ts` |
| AC-3 | `hadara docs inbox --json` reports registry/unregistered-spec attention items. | Done | `ev:T-0431:a81383c6d7894693a45a95ed` |
| AC-4 | Schemas, command registry entries, focused tests, and built CLI smokes passed. | Done | `ev:T-0431:a81383c6d7894693a45a95ed` |

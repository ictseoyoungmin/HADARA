# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `docs register` registry-first and avoid default prose/projection writes. | Accepted | The 0.4 design makes `.hadara/docs-registry.json` canonical and prevents duplicate instructions across AGENTS/context/workflow docs. | `ev:T-0430:1933b10f80184f8abb9540cb` |
| D-2 | Default new registered docs to linked-only reference docs. | Accepted | Registering a document should not automatically expand default required reading. | `tests/unit/docs-registry.test.ts` |

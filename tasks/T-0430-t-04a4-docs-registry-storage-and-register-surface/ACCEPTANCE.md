# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara docs register` supports dry-run and execute reports over `.hadara/docs-registry.json`. | Done | `ev:T-0430:1933b10f80184f8abb9540cb` |
| AC-2 | Registration does not mutate AGENTS, HADARA_CONTEXT, HADARA_WORKFLOW, or optional `docs/DOC_REGISTRY.md` projection by default. | Done | `tests/unit/docs-registry.test.ts` |
| AC-3 | Command registry and schema fixtures include `docs.register` / `hadara.docs.register.v1`. | Done | `ev:T-0430:1933b10f80184f8abb9540cb` |
| AC-4 | Focused validation and built CLI smoke are recorded as canonical evidence. | Done | `ev:T-0430:1933b10f80184f8abb9540cb` |

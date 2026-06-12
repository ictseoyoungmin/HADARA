# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `project-context` as a docs registry kind for `.hadara/context/HADARA_CONTEXT.md`. | Accepted | The context anchor has different ownership and routing semantics than protocol docs or project-state docs. | `src/services/docs-registry.ts`; docs registry focused test. |
| D-2 | `init` creates context for all profiles, while project migration creates it only when missing. | Accepted | Fresh projects need doctor-clean startup; existing projects must not lose local context customization. | Init and protocol migration tests. |
| D-3 | Task-scoped protocol migration does not touch project context. | Accepted | Task migration must remain task-local and evidence-preserving. | Protocol migration task-scope test. |

# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Scope `AGENTS.md` as repo-level protocol and SOP as project-level protocol. | Accepted | Avoid false canonical conflict while keeping both docs canonical in their respective scope. | `src/services/docs-registry.ts`, docs doctor tests |
| D-2 | Treat unqualified capsule filenames in Required Reading text as task-capsule docs, not project docs. | Accepted | Generated SOP references `TASK.md`, `EVIDENCE.md`, and similar capsule-local files; docs doctor should focus on project document drift. | `src/services/docs-registry.ts`, docs doctor tests |
| D-3 | Keep Phase 7.3 docs commands read-only. | Accepted | Managed patching and archive execution are explicitly deferred to later Phase 7 slices. | `src/cli/docs.ts` |

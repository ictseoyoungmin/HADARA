# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Shared atomic text writes reject project-root escapes through parent traversal or absolute outside paths before temp file creation. | Done | `src/core/fs.ts`; `tests/unit/core-fs.test.ts`; focused tests passed. |
| AC-2 | Existing protocol migration and docs mark atomic write callers remain covered. | Done | Docker focused tests passed for `protocol-migration` and `docs-mark`; full sync-build passed. |
| AC-3 | rc.2 post-publish recycle planning is renumbered to T-0312. | Done | rc.2 spec, Development Slices, Project State, Agent Handoff. |
| AC-4 | Evidence is attached. | Done | `command:T-0311:focused-tests`, `command:T-0311:docker-sync-build`, `command:T-0311:diff-check`. |
| AC-5 | Handoff is updated. | Done | Task and project handoff updated before close. |

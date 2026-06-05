# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep sequential task IDs and add bounded local retry instead of changing ID format. | Accepted | T-0265 explicitly excludes random ID migration and global allocators. | `src/task/task-capsule.ts` |
| D-2 | Use `fs.mkdirSync(dir)` without recursive mode as the task directory collision check. | Accepted | It creates a clear EEXIST boundary after candidate selection. | `src/task/task-capsule.ts`, `tests/unit/task-create.test.ts` |
| D-3 | Omit undefined `template` from no-template create reports. | Accepted | New no-template collision tests exposed schema validation drift; omitting undefined restores valid JSON shape. | `src/task/task-create.ts`, `tests/unit/task-create.test.ts` |

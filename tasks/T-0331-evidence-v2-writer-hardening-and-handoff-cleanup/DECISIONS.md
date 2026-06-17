# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Reject result/outcome contradictions instead of silently preferring either field. | Accepted | Legacy Markdown result and v2 semantic outcome are both proof surfaces; accepting disagreement would make evidence interpretation ambiguous. | User review and focused CLI tests |
| D-2 | Allow exact resolution markers only from passed or recorded evidence. | Accepted | Passed evidence represents validation success; recorded evidence can document decision/audit resolution; failed, blocked, unknown, and not-applicable records must not resolve failures. | Focused semantic/lint tests |
| D-3 | Align evidence writer task-dir discovery with `TASK.md`-bearing Task Capsule discovery. | Accepted | T-0325 established that task-like leftovers without `TASK.md` are not real capsules. | Focused writer/task-capsule tests |

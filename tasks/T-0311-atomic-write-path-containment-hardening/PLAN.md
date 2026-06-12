# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required current-state, workflow, security, active capsule, and rc.2 planning docs. | Done | Session reads recorded in context. |
| 2 | Add containment validation to shared atomic text write path resolution. | Done | `src/core/fs.ts` |
| 3 | Add focused regression tests for normal writes, `..` traversal, and absolute path rejection. | Done | `tests/unit/core-fs.test.ts` |
| 4 | Update rc.2 planning/state docs so post-publish recycle moves to T-0312. | Done | rc.2 spec, Development Slices, Project State, Agent Handoff |
| 5 | Run focused Docker validation/build plus lightweight workspace checks. | Done | T-0311 evidence records |
| 6 | Attach evidence and prepare lifecycle closeout. | Done | Evidence records attached; finish/ready/close/audit commands follow. |

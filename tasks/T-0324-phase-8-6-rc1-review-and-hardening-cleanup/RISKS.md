# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Empty local task-like directories can be mistaken for real capsules. | State projection and protocol diagnostics can report phantom Task Board drift. | Medium | `listTaskCapsules` and `findTaskCapsule` now require `TASK.md`; regression added. | Mitigated |
| Ignoring `TASK.md`-less dirs could hide intentionally started partial capsules. | Operators might miss a malformed manually-created task dir. | Low | HADARA task capsules are created through `task create`; `nextTaskId` still avoids local dir collisions, and malformed manual dirs need explicit remediation. | Accepted |
| Current repo state verification before close reports stale latest close proof. | Advisory output can look unresolved while T-0324 is open. | Medium | Treat as expected until T-0324 lifecycle close; rerun `state verify` after close if needed. | Accepted |
| `0.3.1-rc1` release readiness is not proven by this capsule. | Operators could overstate package readiness. | Low | Release readiness, version bump, artifact refresh, publish, and installed-package recycle are explicitly out of scope. | Accepted |

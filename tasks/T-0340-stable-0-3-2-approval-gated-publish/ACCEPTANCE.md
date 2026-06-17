# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Stable `hadara@0.3.2` publish path is prepared from T-0339 decision evidence. | Partial | Source/readiness prepared; Docker check, package smoke, clean-checkout smoke, and strict gate passed; release artifact refresh remains blocked by dirty worktree. |
| AC-2 | Publish mutation is executed only after explicit operator approval/authentication. | Pending | No publish mutation executed. |
| AC-3 | If publish executes, `npm view hadara@0.3.2 version` returns `0.3.2`. | Pending | Registry verification evidence. |
| AC-4 | If publish executes, npm dist-tags keep stable `0.3.2` on `latest`. | Pending | Dist-tag verification evidence. |
| AC-5 | Evidence is attached and handoff is updated. | Partial | T-0340 evidence attached through `ev:T-0340:d364684c5ab6459498683f5c`; handoff updated with current blocker. |

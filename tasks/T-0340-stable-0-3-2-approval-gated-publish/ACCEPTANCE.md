# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Stable `hadara@0.3.2` publish path is prepared from T-0339 decision evidence. | Done | Source/readiness prepared; Docker check, package smoke, clean-checkout smoke, strict gate, release artifact, release dry-run, publish dry-run, and direct npm tarball dry-run passed. |
| AC-2 | Publish mutation is executed only after explicit operator approval/authentication. | Done | Operator completed npm auth/approval during helper execute; publish evidence `ev:T-0340:8e7dc68139594113a63ade0f`. |
| AC-3 | If publish executes, `npm view hadara@0.3.2 version` returns `0.3.2`. | Done | Registry verification returned `0.3.2`; evidence `ev:T-0340:8e7dc68139594113a63ade0f`. |
| AC-4 | If publish executes, npm dist-tags keep stable `0.3.2` on `latest`. | Done | Dist-tags verified `latest=0.3.2` and `next=0.3.2-rc.0`; evidence `ev:T-0340:8e7dc68139594113a63ade0f`. |
| AC-5 | Evidence is attached and handoff is updated. | Done | T-0340 evidence attached through `ev:T-0340:8e7dc68139594113a63ade0f`; handoff updated for publish completion. |

# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | npm registry checks confirm `hadara@0.3.0-rc.1` version/time/dist-tags and package metadata fields. | Done | `artifacts/recycle/recycle-report.txt`, `artifacts/recycle/recycle-key-artifacts.tgz`. |
| AC-2 | Clean temp workspace validates npx and global install smoke for the published package. | Done | `artifacts/recycle/recycle-report.txt`. |
| AC-3 | Installed CLI runs `help`, `help lifecycle`, `commands --json`, docs list/doctor/required-reading, and fresh init basic/standard/governed. | Done | `artifacts/recycle/recycle-report.txt`, `artifacts/recycle/step-status.tsv`; fresh init succeeds, immediate doctor exits 7 due missing context file and is recorded as friction. |
| AC-4 | Protocol migration dry-run/execute and task lifecycle create/status/evidence/finish/ready/close/audit pass on a generated project. | Done | `artifacts/recycle/step-status.tsv`, `artifacts/recycle/dogfood-success-rerun-task-log.tsv`. |
| AC-5 | Ten small HADARA workflow capsules are run in a dogfooding project and bug/friction findings are recorded. | Done | `artifacts/recycle/FINDINGS.md`, `artifacts/recycle/dogfood-success-rerun-task-log.tsv`. |
| AC-6 | Capsule evidence, state docs, handoff, ready/close/audit, and commit are complete. | Done | T-0302 evidence and close/audit workflow. |

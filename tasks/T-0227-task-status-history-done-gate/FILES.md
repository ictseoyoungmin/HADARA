# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-finish.ts` | Modify | Append Done Status History row during bounded task finish sync. | Done |
| `src/harness/validate.ts` | Modify | Reject done-level capsules whose Status History does not end with Done. | Done |
| `src/services/markdown-table.ts` | Modify | Export heading-line based section readers for shared use. | Done |
| `src/task/task-capsule.ts` | Modify | Use shared section reader for scaffold placeholder detection. | Done |
| `src/task/task-upgrade-scaffold.ts` | Modify | Use shared heading-including section reader for canonical scaffold sections. | Done |
| `src/services/evidence-lint.ts` | Modify | Use shared section reader for task status extraction. | Done |
| `src/services/protocol-profile.ts` | Modify | Use shared section reader for required-reading extraction. | Done |
| `src/services/protocol-consistency.ts` | Modify | Use shared section reader for docs/task section checks. | Done |
| `src/services/project-read-model.ts` | Modify | Use shared section reader for project/handoff extractSection. | Done |
| `src/services/protocol-remediation.ts` | Modify | Use shared section reader when falling back to `## Status` body. | Done |
| `tests/unit/task-finish.test.ts` | Modify | Cover finish history append and history-only repair. | Done |
| `tests/harness/harness-validate.test.ts` | Modify | Cover done-level Status History gate and completed fixture shape. | Done |
| `tests/unit/markdown-table.test.ts` | Modify | Cover inline heading text not being treated as a real section heading. | Done |
| `tasks/T-0226-dashboard-refresh-responsiveness-measurement/TASK.md` | Modify | Repair the real capsule that exposed the missing Done history row. | Done |

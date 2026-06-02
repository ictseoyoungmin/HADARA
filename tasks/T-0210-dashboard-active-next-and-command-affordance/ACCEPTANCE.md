# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Active/next is the primary focal block. | Done | focal-card dominates the main column; visual home capture. |
| AC-2 | The next-recommended command is copy-only and never executes. | Done | CopyButton uses clipboard; "dashboard does not execute it" wording; source scan. |
| AC-3 | The idle/empty case is a designed state. | Done | ActiveNext idle copy + EmptyState. |
| AC-4 | Reads from bootstrap only. | Done | No additional fetch in ActiveNext. |

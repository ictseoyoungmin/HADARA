# Decisions

| ID | Decision | Reason |
|---|---|---|
| D-1 | Add `release closeout --version --task --json` as a read-only release-package command. | Matches the 0.3.4 spec and keeps closeout planning separate from publish mutation. |
| D-2 | Classify surfaces by expected version/task signals rather than trying to rewrite documents. | Gives agents a concrete checklist while preserving human-authored release docs. |
| D-3 | Include suggested fragments but no execute mode. | First capsule should reduce inference without creating another shared-doc writer. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|

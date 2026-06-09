# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and rc3 reliability spec. | Done | Required-reading context carried from session start; T-0283 spec committed. |
| 2 | Implement evidence append result contract, task lock, and explicit idempotency key handling. | Done | Source changes pending validation. |
| 3 | Update CLI command docs/templates for the new option. | Done | README, SOP, task workflow docs, CLI JSON contract, init templates, and docs tests updated. |
| 4 | Run focused validation. | Done | `/tmp` validation copy build passed; focused tests passed 3 files / 41 tests; built CLI idempotency smoke passed. |
| 5 | Attach evidence and close the capsule when ready. | Done | Evidence records appended with explicit idempotency keys. |

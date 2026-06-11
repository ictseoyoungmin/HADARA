# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use T-0301, not T-0297, as the rc.1 publish capsule id. | Accepted | T-0297 is the already completed rc.0 publish capsule; rc.1 evidence and publish verification must attach to the rc.1 final readiness capsule. | Helper task/version guard smoke. |
| D-2 | Keep README truthful before publish while still documenting rc.1 install after helper verification. | Accepted | Public GitHub may be read before npm publish, while the same README is packaged into the rc.1 tarball after publish. | README release status update. |
| D-3 | Auto-clean only generated release dry-run outputs. | Accepted | This supports the operator's dry-run-then-execute flow without hiding unrelated edits in a publish clone. | Dry-run cleanup smoke. |

# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Source version is `0.3.2-rc.0`. | Done | Docker sync-build reported packageVersion `0.3.2-rc.0`; `ev:T-0336:6016f46604b446e1b8bc83c7`. |
| AC-2 | Release docs target `0.3.2-rc.0`. | Done | README/release readiness alignment covered by Docker sync-build and diff check; `ev:T-0336:6016f46604b446e1b8bc83c7`, `ev:T-0336:d691277c751d49a999c0544b`. |
| AC-3 | Release artifact evidence is attached. | Done | `ev:T-0336:c8f3c4a1a5eb4fb2b14b3e26`. |
| AC-4 | Package smoke passes. | Done | `ev:T-0336:9c56833b13ef45369ac26919`. |
| AC-5 | Clean-checkout smoke passes. | Done | `ev:T-0336:9e05a5302cfb43d289309397`. |
| AC-6 | Strict release gate passes. | Done | `ev:T-0336:6f1ec36b592c41849b5c8907`. |
| AC-7 | Release dry-run passes. | Done | `ev:T-0336:1139c0fdb00c4073aaf36ebe`. |
| AC-8 | Publish dry-run passes. | Done | `ev:T-0336:5b64cf958b404c84978715ab`. |
| AC-9 | No publish mutation occurs. | Done | Publish dry-run only; release/package reports show `publishExecuted:false`, `githubReleaseCreated:false`, and `dockerImageBuilt:false`. |

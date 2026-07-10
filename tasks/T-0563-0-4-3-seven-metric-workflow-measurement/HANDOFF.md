# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Completed measurement v2 with seven metrics, structured dropout, explicit install boundary, and first-file onboarding routing. | Basic/standard/governed each closed-valid in six primary calls with zero stale references; focused 52/52 and Docker 1049/1049 passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Align positioning/onboarding around local-first evidence control and fast structured-state session resume. | The release should explain the user benefit, not only its implementation. | `.hadara/state/current.json`, `README.md`, release/onboarding docs. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host child-process EPERM produces a real dropout at init. | Host run cannot prove workflow correctness. | Preserve the dropout report; use Docker as authoritative execution. |
| Default run starts from an available built CLI. | Install-to-capsule metric excludes package installation. | Report `includesPackageInstallation:false`; complete installed-package run in release readiness. |

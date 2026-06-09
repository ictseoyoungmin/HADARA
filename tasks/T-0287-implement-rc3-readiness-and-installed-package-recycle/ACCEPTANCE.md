# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Source package metadata reports `0.2.0-rc.3`. | Met | Built CLI version smoke reported `packageVersion: 0.2.0-rc.3`. |
| AC-2 | README/release docs distinguish rc3 source candidate from rc2 published npm RC. | Met | README, release readiness, and release notes updated; README contract test passed. |
| AC-3 | Package smoke verifies rc3 package contents and installed CLI behavior. | Met | Passed package smoke artifact after using `/tmp` npm cache. |
| AC-4 | Clean-checkout smoke passes with build/check/built CLI release gate. | Met | Passed clean-checkout smoke artifact after strict marker fix. |
| AC-5 | Fresh init and recycle flow passes for basic, standard, governed, evidence idempotency, proof, and CI gate. | Met | Built CLI recycle command evidence. |
| AC-6 | Release artifact evidence for rc3 is refreshed. | Pending | Requires clean checkpoint commit before artifact builder will run. |

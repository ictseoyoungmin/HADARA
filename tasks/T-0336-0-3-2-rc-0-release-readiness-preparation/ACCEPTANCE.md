# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Source version is `0.3.2-rc.0`. | In Progress | package metadata updated; validation pending |
| AC-2 | Release docs target `0.3.2-rc.0`. | In Progress | README and release readiness updated; final validation pending |
| AC-3 | Release artifact evidence is attached. | Pending | `release artifact --execute --attach-evidence` |
| AC-4 | Package smoke passes. | Pending | `package smoke --execute --attach-evidence` |
| AC-5 | Clean-checkout smoke passes. | Pending | `smoke clean-checkout --execute --attach-evidence` |
| AC-6 | Strict release gate passes. | Pending | `release gate --mode strict --json` |
| AC-7 | Release dry-run passes. | Pending | `release dry-run --json` |
| AC-8 | Publish dry-run passes. | Pending | `release publish --mode dry-run --json` |
| AC-9 | No publish mutation occurs. | Pending | Dry-run publish only; no execute publish command |

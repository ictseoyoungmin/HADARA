# HADARA 0.4.6-rc.0

HADARA 0.4.6-rc.0 is a release candidate focused on brownfield trust polish, delegated-agent onboarding friction, validation capture reliability, and current-state contract clarity after stable 0.4.5.

## Highlights

- Fails closed on duplicate `.gitignore` HADARA `local-state` managed blocks during brownfield adoption.
- Adds package-smoke fallback observability when installed commands exit successfully but stdout capture is empty.
- Improves manifest inference for Python, Cargo, and Go projects, including Go semantic import version suffix handling such as `/v2`.
- Accepts CLI-only evidence category aliases `test` and `tests`, while still persisting canonical `validation`.
- Improves unsupported evidence category diagnostics with allowed tokens, aliases, and schema lookup hints.
- Hardens validation execution capture for delegated tool environments with file-backed capture and direct-result recovery.
- Retires stale bootstrap next-work recommendations after the first real capsule closes.
- Clarifies current-state semantics:
  - `latestCompletedTask` means highest Done task id, not close timestamp chronology.
  - `validationBaseline` means current trusted validation baseline, not necessarily the latest completed task evidence.
- Future-proofs current-state latest-task ordering by comparing task id numeric suffixes.

## Validation

- Focused current-state, validation-run, evidence, manifest inference, and package-smoke tests passed across the 0.4.6 line.
- Docker dev sync build/full suite passed through T-0613 with 153 test files and 1108 tests.
- Built CLI `dist` freshness was verified with `distLooksStale=false`.

## Boundaries

- This is a prerelease candidate intended for npm `next`.
- Stable npm `latest` remains `hadara@0.4.5` until a later stable promotion.
- npm publish, GitHub Release publication, token loading, and installed-package recycle remain operator-controlled steps after this source/readiness capsule.
- Post-publish recycle should install `hadara@next` and verify expected version `0.4.6-rc.0`.

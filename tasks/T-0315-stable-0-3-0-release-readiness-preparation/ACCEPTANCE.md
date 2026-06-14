# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json` and `package-lock.json` root version are `0.3.0`. | Done | Stable metadata committed. |
| AC-2 | README describes stable `0.3.0` as source/release target, does not claim it is published, and install/npx examples use `hadara@0.3.0`. | Done | README release-status wording uses stable target / after-publish boundary. |
| AC-3 | `docs/RELEASE_NOTES.md` has a top `0.3.0` entry with highlights and boundaries. | Done | Release notes updated. |
| AC-4 | `docs/RELEASE_READINESS.md` names current source `0.3.0`, previous published RC `0.3.0-rc.2`, and publish-not-yet-performed boundary. | Done | Release readiness updated. |
| AC-5 | Phase 7 command/docs stable-surface smokes pass from built CLI. | Done | Evidence `command:T-0315:stable-surfaces`. |
| AC-6 | Fresh init profiles, managed patch execute, protocol migrate execute, and minimal lifecycle dogfood pass in disposable projects. | Done | Evidence `command:T-0315:workflow-smokes`. |
| AC-7 | Release artifact, package smoke, clean-checkout smoke, strict release gate, release dry-run, and release publish dry-run pass without publish mutation. | Done | Final release evidence artifacts plus `command:T-0315:final-release-dry-runs`. |
| AC-8 | Docker full validation passes and refreshes `dist`. | Done | Final Docker sync-build passed 118 files / 765 tests and reported `distLooksStale:false`. |
| AC-9 | T-0315 ready/close/audit-close passes, and T-0316/T-0317 are left as follow-ups. | Done | Close-source docs finalized; lifecycle commands run immediately after this update. |

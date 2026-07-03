# 0.4.0 Stable Readiness Decision

Date: 2026-07-03
Task: T-0489

## Decision

Proceed to stable publish preparation for `hadara@0.4.0`.

This is not approval to publish from the current `0.4.0-rc.0` source metadata. The next capsule must retarget source/package metadata to stable `0.4.0`, refresh release docs/artifacts, rerun release validation, and keep npm/GitHub mutation approval-gated.

## Basis

| Gate | Result | Notes |
|---|---|---|
| npm rc package | Pass | `hadara@0.4.0-rc.0` is visible on npm with `next=0.4.0-rc.0`, `latest=0.3.3`, and shasum `e983a13ccce5acfd4ab58d0a3a8f837bdd06acc4`. |
| npm stable precheck | Pass | Exact `hadara@0.4.0` lookup returned not found, so stable remains unpublished before the stable publish capsule. |
| GitHub rc draft | Pass | `v0.4.0-rc.0` exists as draft prerelease targeting `964a8431cc08c2e89460be46560c8a8d98b451e1`. |
| Strict release gate | Pass | `hadara release gate --mode strict --json` returned `ok:true`. |
| Required pre-stable capsules | Pass with accepted warning | T-0482 through T-0488 audited `closed-valid`; T-0481 has one post-close diagnostic report hash warning, with blockers 0 and matching source/slot hashes. |
| Dogfood findings | Pass | T-0481 through T-0488 addressed the high-friction T-0479 findings required before stable. |

## Capsule Review

| Capsule | Decision Input | Readiness |
|---|---|---|
| T-0477 | `0.4.0-rc.0` source/readiness and npm publish evidence. | Accept |
| T-0479 | Fresh-container installed-package dogfood and FlowForge MVP report. | Accept |
| T-0480 | Dogfood artifact Draft/scaffold cleanup. | Accept |
| T-0481 | Initial TASK.md human-readable schema cleanup and pre-stable plan. | Accept with non-blocking audit warning |
| T-0482 | Lean v2 TASK.md schema cleanup. | Accept |
| T-0483 | Top-level JSON `taskId` envelope hardening. | Accept |
| T-0484 | `doctor` install-location output. | Accept |
| T-0485 | Negative timing root cause and monotonic timer hardening. | Accept |
| T-0486 | Task id counter after manual capsule deletion. | Accept |
| T-0487 | Dogfood output UX pass. | Accept |
| T-0488 | `0.4.0-rc.0` GitHub Release draft. | Accept |

## Residuals

| ID | Residual | Disposition |
|---|---|---|
| R-1 | Stable `0.4.0` is not yet published and source metadata still targets `0.4.0-rc.0`. | Handle in the stable publish capsule. |
| R-2 | RC GitHub Release remains draft and uses a GitHub `untagged-*` draft URL until published. | Accept for RC; stable release handling belongs to the stable publish capsule. |
| R-3 | T-0481 audit reports a diagnostic report hash warning. | Accept because blockers are 0, close evidence is valid, and source/slot hashes still match. |
| R-4 | Batch task creation, command timing footers, and further compact output profiles remain useful dogfood follow-ups. | Defer to post-stable candidates unless they block stable publish validation. |

## Next Capsule

Open a stable publish preparation capsule for `hadara@0.4.0`.

Required next-capsule work:

- Retarget package metadata, lockfile, README, release notes, and release readiness docs to stable `0.4.0`.
- Rebuild and refresh `dist`.
- Run package smoke, clean-checkout smoke, release artifact, strict release gate, release dry-run, publish dry-run, and direct npm tarball dry-run as appropriate.
- Confirm `npm view hadara@0.4.0` is still absent before publish.
- Publish only through the approval-gated/manual release path.
- Verify npm `latest=0.4.0` after publish, then open stable installed-package recycle.

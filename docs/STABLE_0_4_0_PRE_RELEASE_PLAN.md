# 0.4.0 Stable Pre-release Plan

Status: stable npm publish and GitHub Release draft complete; stable installed-package recycle is next
Source: T-0479 installed-package dogfood handoff and operator review on 2026-07-02.

## Goal

Promote `hadara@0.4.0-rc.0` to stable only after the high-friction dogfood findings are either fixed, explicitly accepted, or assigned to concrete post-stable follow-up capsules.

## Required Capsules Before Stable

| Order | Capsule | Outcome Required |
|---:|---|---|
| 1 | Task Capsule human-readable schema cleanup | New `TASK.md` scaffolds put Goal/Scope/Plan before inputs, keep Evidence only where it proves Acceptance/Validation, remove hash/source-drift bookkeeping from human Inputs, add manual `History` as `Date / State / Note`, and keep legacy capsules validator-compatible. |
| 2 | JSON taskId envelope hardening | Every JSON command response that is task-scoped exposes top-level `taskId`; nested-only task ids are removed from shell parsing paths. |
| 3 | `doctor` install-location output | `hadara doctor` reports the executable path, package root when discoverable, package version, Node path, and registry/install hints without exposing local secrets. |
| 4 | Timing measurement root cause | Negative dogfood durations are traced to either the harness or CLI; duration collection uses monotonic clocks or records a documented harness-only bug with a fix. |
| 5 | Task id counter after manual capsule deletion | Creating a task after manual deletion does not reuse or shift ids when the task board still contains the id; behavior is tested and documented. |
| 6 | Dogfood output UX pass | High-volume JSON surfaces get compact/operator-friendly alternatives or clear extraction paths; `validation run` child-output/evidence boundaries are clarified. |
| 7 | 0.4.0-rc.0 GitHub Release draft | Create or intentionally skip the GitHub Release draft in a separate release capsule with evidence. |
| 8 | Stable readiness decision | Review all pre-stable capsules, release notes, npm rc metadata, and residual risks; produce an explicit promote/no-promote decision. |

T-0489 completed the stable readiness decision on 2026-07-03. Decision: proceed to stable publish preparation for `hadara@0.4.0`, but do not publish from current `0.4.0-rc.0` source metadata.

## Stable Execution Capsules

| Order | Capsule | Outcome Required |
|---:|---|---|
| 9 | Stable publish | Publish `hadara@0.4.0` with release evidence, npm verification, and GitHub Release handling. |
| 10 | Stable installed-package recycle | In a fresh unmounted container, install `hadara@0.4.0` globally and run a smaller recycle smoke that proves stable packaging, init, task lifecycle, evidence, and validation behavior. |

## Promotion Gates

| Gate | Required Result |
|---|---|
| Package | `npm view hadara@0.4.0-rc.0` remains available and stable publish inputs are reproducible. |
| CLI contract | Task-scoped JSON outputs include top-level `taskId`; changed output schemas are covered by tests. |
| Workflow UX | Fresh `task create` scaffolds read as a human task brief before source bookkeeping. |
| Release docs | Release notes call out stable changes, residual known issues, and upgrade expectations. |
| Evidence | Each required capsule records command evidence and a close handoff before stable publish. |

T-0489 gate review result: all required gates are sufficient to open the stable publish preparation capsule. Stable publish still requires retargeted package metadata, refreshed release artifacts, release validation, and explicit operator approval.

T-0490 result: package metadata, lockfile, package-facing docs, helper notes, stable GitHub release note artifact, and built `dist` targeted stable `0.4.0`; the clean publish clone regenerated release artifact, package smoke, and clean-checkout evidence; the operator published `hadara@0.4.0` to npm with `latest`; npm registry verification returned `latest=0.4.0` and `next=0.4.0-rc.0`.

T-0491 result: created and verified the GitHub stable release draft `v0.4.0` titled `HADARA 0.4.0`, targeting `205e9aad0e01ea5332dbdca39c10403c00e845be`, with `isDraft=true` and `isPrerelease=false`. The draft remains unpublished pending operator review.

## Post-stable Candidates

| Candidate | Reason |
|---|---|
| Batch task creation | Dogfood required 12 capsules; batch scaffolding could reduce repetitive command time. |
| Compact status JSON profile | `task status --json` is still useful but long for shell extraction and human inspection. |
| Timing footer for CLI commands | Operator-visible elapsed time would make future dogfood reports less dependent on external harnesses. |

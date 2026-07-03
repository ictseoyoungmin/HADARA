# 0.4.0 Stable Pre-release Plan

Status: active
Source: T-0479 installed-package dogfood handoff and operator review on 2026-07-02.

## Goal

Promote `hadara@0.4.0-rc.0` to stable only after the high-friction dogfood findings are either fixed, explicitly accepted, or assigned to concrete post-stable follow-up capsules.

## Required Capsules Before Stable

| Order | Capsule | Outcome Required |
|---:|---|---|
| 1 | Task Capsule human-readable schema cleanup | New `TASK.md` scaffolds put Goal/Scope/Plan before inputs, remove duplicate Required/Disposition wording, put Hash after Notes, and keep legacy capsules validator-compatible. |
| 2 | JSON taskId envelope hardening | Every JSON command response that is task-scoped exposes top-level `taskId`; nested-only task ids are removed from shell parsing paths. |
| 3 | `doctor` install-location output | `hadara doctor` reports the executable path, package root when discoverable, package version, Node path, and registry/install hints without exposing local secrets. |
| 4 | Timing measurement root cause | Negative dogfood durations are traced to either the harness or CLI; duration collection uses monotonic clocks or records a documented harness-only bug with a fix. |
| 5 | Task id counter after manual capsule deletion | Creating a task after manual deletion does not reuse or shift ids when the task board still contains the id; behavior is tested and documented. |
| 6 | Dogfood output UX pass | High-volume JSON surfaces get compact/operator-friendly alternatives or clear extraction paths; `validation run` child-output/evidence boundaries are clarified. |
| 7 | 0.4.0-rc.0 GitHub Release draft | Create or intentionally skip the GitHub Release draft in a separate release capsule with evidence. |
| 8 | Stable readiness decision | Review all pre-stable capsules, release notes, npm rc metadata, and residual risks; produce an explicit promote/no-promote decision. |

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

## Post-stable Candidates

| Candidate | Reason |
|---|---|
| Batch task creation | Dogfood required 12 capsules; batch scaffolding could reduce repetitive command time. |
| Compact status JSON profile | `task status --json` is still useful but long for shell extraction and human inspection. |
| Timing footer for CLI commands | Operator-visible elapsed time would make future dogfood reports less dependent on external harnesses. |

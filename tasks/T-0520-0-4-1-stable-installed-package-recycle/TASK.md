# T-0520 0.4.1 stable installed package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0520 |
| Title | 0.4.1 stable installed package recycle |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the public `hadara@latest` install path after stable `0.4.1` publish. | Run installed-package recycle from the npm registry and prove the installed CLI reports `0.4.1` and passes current consumer workflow smokes. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara package recycle --execute --package hadara@latest --expected-version 0.4.1`, npm registry metadata, isolated global install, installed CLI version, command surface, lifecycle help, fresh init/task/status/session/finalize/context smokes, and evidence classification. |
| Out | npm publish, GitHub Release mutation, source code changes, package metadata changes, and broader dogfood beyond the recycle helper's disposable workflow. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm `hadara@latest` resolves to expected stable `0.4.1`. | Done |
| 2 | Execute installed-package recycle against the public npm package. | Done |
| 3 | Classify the initial sandboxed retry failure and record final release evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry metadata and installed CLI both report `0.4.1` for `hadara@latest`. | Done | ev:T-0520:2b4b928b65344d03ad44a53d | `package recycle` steps `npm-view-version`, `npm-dist-tags`, `installed-version` |
| AC-2 | Installed CLI exposes the current command surface and uses `task status`, not the removed `task lifecycle`, for recycle smokes. | Done | ev:T-0520:2b4b928b65344d03ad44a53d | `commandSurfaceExecuted=true`; `taskStatusExecuted=true`; `taskLifecycleExecuted=false` |
| AC-3 | Disposable consumer workflow passes init, task create/status, session start, finalize dry-run, context pack, and context slice smokes. | Done | ev:T-0520:2b4b928b65344d03ad44a53d | `artifacts/package-recycle/2026-07-08T05-23-55.095Z-summary.json` |
| AC-4 | Initial sandboxed recycle failure is classified as environment/network-child friction and resolved by the approved network rerun. | Done | ev:T-0520:705485eda380456583f41294 | ev:T-0520:529d3fdc2ecf4fe08669e29b |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@latest version --registry=https://registry.npmjs.org` | Yes | Passed | Direct registry lookup returned `0.4.1`. |
| `hadara package recycle --package hadara@latest --expected-version 0.4.1 --json` | Yes | Passed | Dry-run planned isolated install and consumer workflow smokes without mutation. |
| `hadara package recycle --execute --package hadara@latest --expected-version 0.4.1 --task T-0520 --attach-evidence --json` | Yes | Passed | ev:T-0520:529d3fdc2ecf4fe08669e29b; ev:T-0520:2b4b928b65344d03ad44a53d; ev:T-0520:705485eda380456583f41294 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | reference | active | Current release-line state pointed to stable installed-package recycle as the next step. |
| `tasks/T-0519-0-4-1-stable-post-publish-evidence-sync` | reference | active | Public npm/GitHub publish verification for stable `0.4.1`. |
| npm registry | reference | active | Source of public package version and dist-tags for `hadara@latest`. |
| `hadara package recycle` | reference | active | Installed-package consumer validation helper. |

## Changes

| Area | Summary |
|---|---|
| Release Validation | Verified `hadara@latest` installs as `0.4.1` and passes installed consumer workflow smokes. |
| Evidence | Recorded passing recycle evidence and a resolver for the first sandboxed registry-lookup failure. |
| Local Feedback | Added uncommitted local feedback for package-recycle child npm lookup latency/progress. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Add package recycle stderr progress or shorter registry lookup diagnostics so sandboxed child npm failures are visible before final JSON. | Open | `.hadara/local/feedback/T-0520-package-recycle-sandbox-lookup-latency.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Stable `hadara@latest` installed-package recycle passed for expected `0.4.1`; initial sandbox failure classified and resolved. |

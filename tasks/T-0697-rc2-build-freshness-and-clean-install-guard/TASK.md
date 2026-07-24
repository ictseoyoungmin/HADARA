# T-0697 RC2 Build Freshness and Clean Install Guard

## Identity

| Field | Value |
|---|---|
| ID | T-0697 |
| Title | RC2 Build Freshness and Clean Install Guard |
| Status | Done |
| Created | 2026-07-24T18:44 |
| Updated | 2026-07-24T19:11 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore RC2 release build freshness guards. | Ensure local checks emit current `dist`, manual publish refreshes and verifies built CLI before artifacts, lockfile root metadata matches `package.json`, and the removed `context pack` surface stays off the public command boundary. |

## Scope

| Boundary | Items |
|---|---|
| In | `npm run check` build/emit behavior, manual publish pre-artifact build/version guard, package-lock regeneration, public `context pack` surface removal, focused regression coverage, clean install/check evidence. |
| Out | Fresh-session dogfood, RC2 validation-baseline promotion, broad TUI debt availability redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Restore build freshness, lockfile guards, and context surface cleanup. | Done |
| 3 | Validate clean install, check/build, dist version, context surface, and diff hygiene. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `npm run check` produces current `dist` by running `npm run build`. | Done | ev:T-0697:e0fed34bf4fd42828d2479ec | `package.json` |
| AC-2 | Manual publish helper rebuilds and verifies `node dist/cli/main.js version` before release artifact creation. | Done | ev:T-0697:eae22eb9eeaf4e459da4335a | `scripts/release/manual-publish-rc.sh` |
| AC-3 | `package-lock.json` root devDependencies match `package.json`; Dashboard-only direct dependencies are absent. | Done | ev:T-0697:8ada5a6be1194d248457a486 | `package-lock.json` |
| AC-4 | Validation evidence records clean install, check/build, dist version, and diff hygiene. | Done | ev:T-0697:b6287de625eb4ec790628adb, ev:T-0697:e0fed34bf4fd42828d2479ec, ev:T-0697:2602690f00cc4f5d95e2b7d7, ev:T-0697:85ddc799f71f403da14b6930 | Task evidence |
| AC-5 | Public command routing, registry, docs, and repo-local recycle smokes no longer expose `context pack`. | Done | ev:T-0697:eb23fa89dbc44cb5a74c6cef | `src/cli/context.ts`, `src/services/capability-registry.ts`, docs |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm install --package-lock-only | Yes | Passed | ev:T-0697:c030f5ce7ba44b289afb3e6c |
| npm ci | Yes | Passed | ev:T-0697:b6287de625eb4ec790628adb |
| npm run check | Yes | Passed | ev:T-0697:e0fed34bf4fd42828d2479ec |
| node dist/cli/main.js version | Yes | Passed | ev:T-0697:2602690f00cc4f5d95e2b7d7 |
| focused regression test | Yes | Passed | ev:T-0697:eae22eb9eeaf4e459da4335a |
| git diff --check | Yes | Passed | ev:T-0697:85ddc799f71f403da14b6930 |
| package-lock Dashboard dependency scan | Yes | Passed | ev:T-0697:8ada5a6be1194d248457a486 |
| context pack public surface removal | Yes | Passed | ev:T-0697:eb23fa89dbc44cb5a74c6cef |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Human reviewer report | requirement | active | Identified P0 build freshness regression and P1 package-lock mismatch after T-0696. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow | active | Task capsule and close/evidence semantics. |
| `scripts/release/manual-publish-rc.sh` | implementation | active | Manual end-to-end publish helper. |
| `tools/dev-surface/release-artifact.ts` | implementation | active | Artifact builder copies existing `dist`. |
| `package.json` / `package-lock.json` | implementation | active | Script and dependency metadata. |
| Human follow-up | requirement | active | Remove `context pack` from the public surface in the same task. |

## Changes

| Area | Summary |
|---|---|
| Build freshness | `npm run check` now runs `npm run build` before tools type-check and the full public plus HADARA-dev test suite. |
| Manual publish guard | `scripts/release/manual-publish-rc.sh` now runs `npm run build` after `npm run check`, verifies `node dist/cli/main.js version` against `package.json`, and only then builds the release artifact. |
| Lockfile hygiene | Regenerated `package-lock.json`; root devDependencies now match `package.json` and removed Dashboard direct dependencies are absent. |
| Context surface | Removed public `context pack` CLI routing and registry entry, updated public docs/templates/smokes away from it, and retained the internal context-pack builder only for internal candidate/historical use. |
| Dist freshness | Refreshed `dist` from the Docker sync-build path and verified `version --verbose --json` reports `distLooksStale: false`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fresh-session dogfood and validation baseline promotion remain after this blocker is fixed. | Open | `docs/AGENT_HANDOFF.md` |
| RF-2 | Risk | Host `npm ci` on the mounted WSL workspace hit a symlink EPERM; clean install/check proof came from a Docker ext4 clean copy including `.hadara`. | Open | ev:T-0697:b6287de625eb4ec790628adb |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-24 | Draft | Initial task scaffold. |
| 2026-07-24 | In Progress | Scoped build freshness and clean install guard work. |
| 2026-07-24 | In Progress | Added same-task public `context pack` removal per human follow-up. |
| 2026-07-24 | Done | Restored build freshness, regenerated lockfile, removed the public `context pack` surface, and recorded clean Docker validation evidence. |

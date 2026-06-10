# T-0289 rc3 post-hardening release readiness refresh

## Metadata

| Field | Value |
|---|---|
| ID | T-0289 |
| Title | rc3 post-hardening release readiness refresh |
| Status | Done |
| Created | 2026-06-09 |
| Updated | 2026-06-09 |

## Goal

| Goal | Notes |
|---|---|
| Re-prove `hadara@0.2.0-rc.3` release readiness after the T-0288 source changes, so the operator can publish with only commit + npm login + the manual publish helper. | T-0288 modified `src/evidence`, `src/services`, and CLI files, so package smoke, clean-checkout smoke, and the release gates must be re-proven against current source. |

## Scope

| In Scope | Reason |
|---|---|
| package smoke `--execute` against current rc.3 source. | Prove the packed tarball installs and the installed CLI works. |
| clean-checkout smoke `--execute` against current rc.3 source. | Prove a fresh checkout installs, builds, and passes from clean. |
| release gate strict, release dry-run, release publish dry-run. | Prove the release readiness gates are green with no blockers. |
| Confirm publish preconditions and document the exact remaining operator steps. | Leave a one-command publish path: commit, npm login, run the helper with `--execute`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Actual npm publish / registry mutation. | Operator-gated and approval-gated; performed by the operator running the helper. |
| `release artifact --execute`. | Requires a clean worktree; the manual publish helper runs it after the operator commits. |
| GitHub Release / Docker / PyPI publish. | Secondary, separately operator-gated. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-09T00:00:00.000Z | Draft | Initial task scaffold. | Scaffold. |
| 2026-06-09T00:00:01.000Z | In Progress | Re-proving rc3 release readiness after T-0288 in the Docker baseline. | package smoke, clean-checkout smoke, and release gates; see EVIDENCE.md. |
| 2026-06-09T00:00:02.000Z | Done | rc3 release readiness re-proven; only operator commit/login/publish remain. | package smoke + clean-checkout passed; release gates green; full suite 695 tests; see EVIDENCE.md. |

# T-0761 Refresh RC3 Final Readiness

## Identity

| Field | Value |
|---|---|
| ID | T-0761 |
| Title | Refresh RC3 Final Readiness |
| Status | Done |
| Created | 2026-08-09T21:25 |
| Updated | 2026-08-09T21:35 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0761 --json`.

## Goal

| Goal | Notes |
|---|---|
| Refresh RC3 pre-publish evidence after T-0760 so every release proof refers to the current HEAD and the exact artifact used for package smoke. | No npm/GitHub mutation or installed consumer recycle is authorized in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Current-HEAD full check, release artifact tarball/checksum/manifest, exact-tarball package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and exact operator handoff sequence. |
| Out | npm publish, GitHub Release mutation/upload, public registry verification, installed package recycle, and source/runtime changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the post-T-0760 RC3 readiness refresh and single-artifact invariant. | Done |
| 2 | Refresh current-HEAD artifact, exact package smoke, consumer, and release gate evidence. | Done |
| 3 | Finish operator handoff, validate evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current source metadata remains `0.5.0-rc.3` and RC2 immutable records are not changed. | Met | ev:T-0761:5ad65cc3c0bd47eeabb6c697 | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-2 | A current-HEAD release artifact produces tarball, checksum, and manifest with no committed binary. | Met | ev:T-0761:5ad65cc3c0bd47eeabb6c697; tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` | `docs/RELEASE_READINESS.md` |
| AC-3 | Package smoke consumes the exact artifact tarball and records matching artifact/package SHA-256 provenance. | Met | ev:T-0761:5ad65cc3c0bd47eeabb6c697; ev:T-0761:3ea412124e9044079edabd1d; matching SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-4 | Clean-checkout smoke and full repository validation pass from the refreshed source state. | Met | ev:T-0761:257b635afb2a4d3ea9fc8c98; ev:T-0761:4626bb2935134a84beb34ef4 | `docs/RELEASE_READINESS.md` |
| AC-5 | Strict release gate, release dry-run, and publish dry-run pass without external mutation. | Met | ev:T-0761:c7ab31e649cf41e2b6122074; ev:T-0761:c5f6c9222d5d486f80aff945; ev:T-0761:db676098038f40bbae98329d | `docs/RELEASE_READINESS.md` |
| AC-6 | The capsule contains an exact operator command sequence that preserves the one-tarball smoke/publish/upload invariant and keeps installed recycle separate. | Met | `HANDOFF.md` operator sequence; ev:T-0761:5ad65cc3c0bd47eeabb6c697 | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Full repository validation | Yes | Passed | ev:T-0761:4626bb2935134a84beb34ef4 |
| Current-HEAD release artifact | Yes | Passed | ev:T-0761:5ad65cc3c0bd47eeabb6c697; tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` |
| Exact tarball package smoke | Yes | Passed | ev:T-0761:3ea412124e9044079edabd1d; exact tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` |
| Clean-checkout smoke | Yes | Passed | ev:T-0761:257b635afb2a4d3ea9fc8c98 |
| Strict release gate | Yes | Passed | ev:T-0761:c7ab31e649cf41e2b6122074 |
| Release dry-run and publish dry-run | Yes | Passed | ev:T-0761:c5f6c9222d5d486f80aff945; ev:T-0761:db676098038f40bbae98329d |
| Release dry-run | Yes | Passed | ev:T-0761:c5f6c9222d5d486f80aff945 |
| Publish dry-run | Yes | Passed | ev:T-0761:db676098038f40bbae98329d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | constraint | active | RC3 artifact/provenance/no-mutation contract. |
| `docs/RELEASE_READINESS.md` | constraint | active | Release recycle order and evidence boundaries. |
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | RC2 records remain immutable. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Operator helper sequence and publish boundary. |
| T-0760 close proof | reference | active | Current HEAD changed Init v1 runtime inputs; T-0759 evidence is stale. |

## Changes

| Area | Summary |
|---|---|
| Release evidence | Done: refreshed all current-HEAD pre-publish proofs under T-0761. |
| Operator handoff | Done: recorded exact one-tarball command sequence and excluded external operations. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Actual npm/GitHub publish and installed consumer recycle remain operator-controlled. | Open | Post-close operator capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined current-HEAD RC3 readiness refresh and exact-artifact provenance boundary after T-0760. |
| 2026-08-09 | Ready for close | Current-HEAD artifact, exact package smoke, clean-checkout, full check, strict gate, and release/publish dry-runs passed; operator handoff completed. |
| 2026-08-09 | Done | Close proof is pending the HADARA close transaction. |

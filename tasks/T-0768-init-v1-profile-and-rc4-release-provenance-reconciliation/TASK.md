# T-0768 Init v1 Profile and RC4 Release Provenance Reconciliation

## Identity

| Field | Value |
|---|---|
| ID | T-0768 |
| Title | Init v1 Profile and RC4 Release Provenance Reconciliation |
| Status | Draft |
| Created | 2026-08-11T17:23 |
| Updated | 2026-08-11T17:23 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make Init v1 profile diagnostics authoritative, keep minimal READ_MAP routing coherent, and leave RC4 operator artifacts recoverable without publishing. | Valid Init v1 metadata selects basic/standard/governed; malformed or partial Init v1 state fails closed; legacy scaffold behavior remains compatible. |

## Scope

| Boundary | Items |
|---|---|
| In | `protocol-profile` Init v1 authority selection, fail-closed diagnostics, minimal workflow context row, profile regression matrix, RC4 artifact locator/handoff reconciliation, and regenerated local readiness evidence. |
| Out | npm publish, GitHub Release mutation/upload, public consumer recycle, stable promotion, and changing the RC4 version to rc.5. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and record the reviewer findings. | Done |
| 2 | Make validated Init v1 metadata authoritative and align minimal workflow routing. | In Progress |
| 3 | Add profile/fail-closed regressions and validate the full source tree. | Pending |
| 4 | Regenerate RC4 artifact/evidence, reconcile operator locator and T-0767 continuation, then close. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 minimal, standard, and governed projects report declared/detected/target profiles as basic, standard, and governed respectively. | Pending | TBD | `src/services/protocol-profile.ts` |
| AC-2 | Init v1 partial or malformed canonical state fails closed; a missing READ_MAP is reported as an error-level required context failure. | Pending | TBD | `src/services/protocol-profile.ts` |
| AC-3 | Legacy basic, standard, and governed scaffold profile behavior remains compatible, and minimal Init v1 workflow Project Start includes READ_MAP. | Pending | TBD | `src/init/templates.ts`; regression tests |
| AC-4 | RC4 artifact provenance has an exact stable logical locator plus private local retention metadata; no public evidence exposes a host-private absolute path. | Pending | TBD | T-0767 handoff and local release workspace |
| AC-5 | Corrective validation regenerates the RC4 artifact/evidence from the changed source while keeping version `0.5.0-rc.4`; no publish mutation occurs. | Pending | TBD | release artifact, package smoke, clean-checkout, gate, and dry-run evidence |
| AC-6 | Capsule docs and continuation guidance are complete before proof-last close. | Pending | TBD | `TASK.md`, `HANDOFF.md`, `EVIDENCE.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused protocol/profile tests | Yes | Not Run | Init v1 and legacy profile matrix. | TBD |
| Full repository validation | Yes | Not Run | Current source after profile/workflow changes. | TBD |
| RC4 artifact/package/checkout/release gates | Yes | Not Run | Rebuilt from a clean source clone; no publish. | TBD |
| Evidence lint and task close | Yes | Not Run | Proof-last close for T-0768; T-0767 continuation repair handled intentionally. | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer findings in current request | constraint | active | Init v1 metadata authority, READ_MAP routing, artifact locator, and closed HANDOFF continuation. |
| `src/init/model.ts` and Init v1 schemas | constraint | active | Validated project/documents state and preset/document-pack contract. |
| `docs/RELEASE_READINESS.md` | constraint | active | RC4 artifact retention and no-mutation release boundary. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Close-source ownership and proof-last close semantics. |
| T-0767 release evidence and HANDOFF | reference | active | Existing RC4 artifact hashes and stale continuation to reconcile. |

## Changes

| Area | Summary |
|---|---|
| Profile authority | TBD |
| Init workflow | TBD |
| Release provenance | TBD |
| Task continuation | TBD |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC4 npm/GitHub/public recycle remains operator-controlled and is outside this corrective capsule. | Open | T-0767 post-close release sequence |
| RF-2 | Risk | Existing T-0767 RC4 bytes are stale after `src/**` changes and must not be presented as current until regenerated. | Open | Rebuild exact artifact before close |

## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Opened to correct Init v1 profile authority, minimal READ_MAP routing, RC4 artifact retention, and stale closed-task continuation guidance. |

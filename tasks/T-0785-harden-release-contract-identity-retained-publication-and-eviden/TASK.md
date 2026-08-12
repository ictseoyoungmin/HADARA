# T-0785 Harden release contract identity retained publication and evidence semantics

## Identity

| Field | Value |
|---|---|
| ID | T-0785 |
| Title | Harden release contract identity retained publication and evidence semantics |
| Status | Done |
| Created | 2026-08-12T12:13Z |
| Updated | 2026-08-12T12:33Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden the RC6 release contract so the published artifact identity, operator lineage, retained-input helper, release-note lifecycle, evidence projection, and close semantics cannot drift silently. | No RC6 artifact regeneration, npm/GitHub publication, public recycle, or stable promotion in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Canonical release-input inventory/hash; lineage schema/current-state gating; retained publish argument preservation; Release Note dirty-tree lifecycle; shared task evidence-doc parsing; legacy projection resolution; controlled residual disposition; fake npm/gh shell integration tests. |
| Out | RC6 artifact regeneration, npm/GitHub mutation, public consumer recycle, stable promotion, Docker image mutation, and edits to closed T-0784 close-source docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Freeze the reviewer findings into the release hardening contract and shared input/disposition model. | Done |
| 2 | Implement release identity/lineage, helper/Release Note flow, shared evidence semantics, and regressions. | Done |
| 3 | Validate with fake operator integration, Docker build/typecheck/full tests, evidence, and proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Release-input inventory is shared by hash and artifact construction, includes package metadata/docs/build inputs, and fails closed for relevant untracked inputs. | Met | ev:T-0785:19546829c53545b4a27ff3df | `tools/dev-surface/release-input.ts` and artifact builder |
| AC-2 | Publication lineage distinguishes legacy and new reports; new reports require artifact source commit, release input hash, and operator commit, and current-state requires the complete new lineage. | Met | ev:T-0785:19546829c53545b4a27ff3df | publication schema/current-state |
| AC-3 | Retained mode preserves all artifact/report arguments through dry-run, prepare, and execute guidance; it never silently falls back to regeneration. | Met | ev:T-0785:6de58ff1ff3c4732a093ceec | release helper |
| AC-4 | Release Note generation/cleanup cannot leave an unmanaged dirty tree or delete the path later printed for publication. | Met | ev:T-0785:6de58ff1ff3c4732a093ceec | prepare/helper flow |
| AC-5 | Projection and close use one shared task evidence-doc parser and resolver; documented mitigation and legacy v1 fallback are resolved consistently without negation false positives. | Met | ev:T-0785:1c2b8a1960b845a99feedcce | evidence semantics |
| AC-6 | Fake npm/gh shell integration covers retained dry-run, argument preservation, Release Note lifecycle, and no artifact regeneration. | Met | ev:T-0785:6de58ff1ff3c4732a093ceec | integration regression |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused release identity and lineage tests | Yes | Passed | Inventory completeness, relevant untracked fail-closed, legacy/new schema, and current-state gates. | ev:T-0785:19546829c53545b4a27ff3df |
| Retained helper and prepare-flow tests | Yes | Passed | Retained args survive dry-run/execute guidance and Release Note stays usable. | ev:T-0785:6de58ff1ff3c4732a093ceec |
| Evidence semantics tests | Yes | Passed | Shared parser, legacy v1 mapping, structured disposition, and negation safety. | ev:T-0785:1c2b8a1960b845a99feedcce |
| Fake npm/gh shell integration | Yes | Passed | Real retained helper execution with no network or external mutation. | ev:T-0785:6de58ff1ff3c4732a093ceec |
| Docker build, tools typecheck, and full tests | Yes | Passed | Built CLI and repository regression suite: 131 files, 1065 tests. | ev:T-0785:19546829c53545b4a27ff3df |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/01_RELEASE_IDENTITY_AND_RETAINED_ARTIFACT_PUBLICATION_HARDENING.md` | design | active | Normative RC6 release identity, retained-input, evidence, timestamp, and capsule budget contract. |
| Reviewer findings attached to this task | reference | active | P1/P2 findings for T-0784 implementation gaps. |
| `tools/dev-surface/release-input.ts` and `tools/dev-surface/release-artifact.ts` | implementation-source | active | Release input and artifact construction must share the same inventory. |
| `scripts/release/manual-publish-rc.sh` and `scripts/release/prepare-publish-env.sh` | implementation-source | active | Operator retained-input and Release Note boundary. |
| `src/evidence/evidence.ts`, `src/evidence/semantics.ts`, and evidence-lint task-doc parsing | implementation-source | active | Projection and close semantic parity. |

## Changes

| Area | Summary |
|---|---|
| Release identity | Shared artifact input inventory, untracked-input fail-closed, complete lineage schema, and hash-based current-state gate. |
| Operator publication | Retained argument propagation, Release Note lifecycle, and fake npm/gh integration coverage. |
| Evidence semantics | Shared task-doc parser, legacy mapping, structured residual disposition, and negation-safe resolution. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC6 artifact/readiness must be regenerated after this hardening commit. | Deferred | Next RC6 regeneration capsule |
| RF-2 | Risk | No npm/GitHub/public consumer mutation is allowed in T-0785. | Closed | Capsule scope |

## Close Summary

T-0785 completed the release identity, retained-input publication, Release Note, and evidence semantic hardening without regenerating or publishing RC6. Full validation passed, and T-0783 EVIDENCE.md was reprojected from the shared resolver so its resolved smoke failure is presented consistently.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Reclassified as the complete release-contract hardening capsule before RC6 regeneration. |
| 2026-08-12 | Done | Release identity and evidence hardening implemented, validated, and ready for proof-last close. |

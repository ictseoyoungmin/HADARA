# T-0747 RC2 Current-Head Re-freeze

## Identity

| Field | Value |
|---|---|
| ID | T-0747 |
| Title | RC2 Current-Head Re-freeze |
| Status | Draft |
| Created | 2026-08-02T01:11 |
| Updated | 2026-08-02T01:11 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reopen and re-freeze RC2 against the actual T-0747 current head. | Reconcile the T-0746 public contract changes, regenerate release artifacts, rerun all formal RC2 gates, and leave publication as a separate operator-controlled action. |

## Scope

| Boundary | Items |
|---|---|
| In | RC2 freeze/readiness documents, README release status, release artifact report/checksum/manifest, package and clean-checkout smoke, strict gate, release dry-run, installed lifecycle provenance, and close-proof projection boundaries. |
| Out | npm/GitHub publication, remote CI, Docker publish, provider/MCP writes, new runtime capability, and committing the binary release tarball. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record the T-0746 freeze-boundary drift and define the re-freeze/release evidence contract. | Done |
| 2 | Update freeze/readiness/README docs and add installed lifecycle provenance fields without adding runtime capability. | In Progress |
| 3 | Generate current-head release evidence, rerun formal gates, and close with reviewed proof-last execution. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | RC2 freeze/readiness/README state names T-0746 and records T-0747 as the current re-freeze owner and boundary. | Done | TBD | docs/RC2_CONTRACT_FREEZE.md; docs/RELEASE_READINESS.md; README.md |
| AC-2 | Installed lifecycle result records schema version, source commit, tarball hash/size/path, helper hash/path, and package manifest hash. | Done | TBD | tools/dev-surface/installed-lifecycle-smoke.ts; artifacts/installed-lifecycle/result.json |
| AC-3 | Current-head release artifact report, checksum, and manifest are generated without committing the binary tarball. | Pending | TBD | release artifact evidence |
| AC-4 | Package/consumer smoke, clean-checkout smoke, strict release gate, release dry-run, and installed lifecycle pass on the current head. | Pending | TBD | task evidence |
| AC-5 | Close-plan readiness passes and reviewed close reaches `closed-valid`; close proof remains in EVIDENCE.md rather than a `Close execute/audit` TASK validation row. | Pending | TBD | task evidence and close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Close-plan readiness | Yes | Not Run | Done-level close readiness will be evaluated by the proof-last close flow. | task close evidence |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer findings for T-0746 | reference | active | Reopen the RC2 freeze boundary, refresh formal gates, and preserve artifact provenance without adding publication mutation. |
| docs/RC2_CONTRACT_FREEZE.md | constraint | active | T-0747 owns the current-head re-freeze boundary. |
| docs/RELEASE_READINESS.md | constraint | active | Current-head release recycle order and artifact retention contract. |

## Changes

| Area | Summary |
|---|---|
| Release process | Reconciled freeze ownership and readiness wording with T-0746 changes. |
| Artifact provenance | Added installed lifecycle provenance and retained release checksum/manifest without a committed tarball. |
| Validation | Reran formal current-head release gates and recorded reduced public evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External publication remains operator-controlled. | Deferred | README.md; docs/RELEASE_READINESS.md |
| RF-2 | Follow-up | Remote CI observation remains separate from local release readiness. | Deferred | docs/RELEASE_READINESS.md |

## Close Summary

T-0747 reconciles the RC2 freeze boundary with the shipped T-0746 schema/document/close contract, refreshes release readiness to the current head, records artifact provenance, and proves the formal release recycle without publication mutation. The binary tarball remains disposable; the capsule retains the reduced report, checksum, manifest, and structured lifecycle result.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-02 | Draft | Initial task scaffold. |
| 2026-08-02 | In Progress | Reopened RC2 freeze accounting for T-0746 current-head contract changes. |

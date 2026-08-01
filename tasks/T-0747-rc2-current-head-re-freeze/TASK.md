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
| 2 | Update freeze/readiness/README docs and add installed lifecycle provenance fields without adding runtime capability. | Done |
| 3 | Generate current-head release evidence, rerun formal gates, and close with reviewed proof-last execution. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | RC2 freeze/readiness/README state names T-0746 and records T-0747 as the current re-freeze owner and boundary. | Done | ev:T-0747:6ff7889cf1864667a25149ea; ev:T-0747:ec137d9a275d4421bf983f79 | docs/RC2_CONTRACT_FREEZE.md; docs/RELEASE_READINESS.md; README.md |
| AC-2 | Installed lifecycle result records schema version, source commit, tarball hash/size/path, helper hash/path, and package manifest hash. | Done | ev:T-0747:f3f8e37f78ac4ce499604b47 | tools/dev-surface/installed-lifecycle-smoke.ts; artifacts/installed-lifecycle/result.json |
| AC-3 | Current-head release artifact report, checksum, and manifest are generated without committing the binary tarball. | Done | ev:T-0747:6ff7889cf1864667a25149ea | artifacts/release-artifact; release artifact report |
| AC-4 | Package/consumer smoke, clean-checkout smoke, strict release gate, release dry-run, and installed lifecycle pass on the current head. | Done | ev:T-0747:c5fd2deb6b464a03bedfa418; ev:T-0747:0829598d30214f39981e4992; ev:T-0747:11bcad3ce81548f1b745a04f; ev:T-0747:ec137d9a275d4421bf983f79; ev:T-0747:f3f8e37f78ac4ce499604b47; ev:T-0747:b898be0af9a249138db2ff7d | task evidence |
| AC-5 | Close-plan readiness passes; reviewed close proof is projected in EVIDENCE.md rather than a `Close execute/audit` TASK validation row. | Done | ev:T-0747:ec137d9a275d4421bf983f79; ev:T-0747:11bcad3ce81548f1b745a04f | task evidence and close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Current-head release artifact | Yes | Passed | Source commit 503546e0 generated a schema-valid tarball, checksum, and manifest; binary tarball was not committed. | ev:T-0747:6ff7889cf1864667a25149ea |
| Current-head package/consumer smoke | Yes | Passed | Installed RC2 artifact, generated init docs, doctor, command surface, and cleanup passed with public smoke artifact. | ev:T-0747:c5fd2deb6b464a03bedfa418 |
| Current-head clean-checkout smoke | Yes | Passed | npm ci, build, full check, doctor, task status, and strict gate passed in a disposable checkout. | ev:T-0747:0829598d30214f39981e4992 |
| Current-head installed lifecycle | Yes | Passed | Provenance-bearing result passed init, validation/evidence, reviewed close, audit, retry, and fresh-session status. | ev:T-0747:f3f8e37f78ac4ce499604b47 |
| Current-head full npm run check | Yes | Passed | Public 129 files/1047 tests and HADARA-dev 16 files/135 tests passed. | ev:T-0747:b898be0af9a249138db2ff7d |
| Current-head strict release gate | Yes | Passed | Latest T-0747 package, clean-checkout, and release artifact evidence is schema-valid and current. | ev:T-0747:11bcad3ce81548f1b745a04f |
| Current-head release dry-run | Yes | Passed | Readiness ready with zero blockers/warnings; publication remains approval-gated. | ev:T-0747:ec137d9a275d4421bf983f79 |
| Close-plan readiness | Yes | Passed | Reviewed dry-run is executable-with-deferred-checks; execute will re-evaluate readiness, close, and audit. | planHash: sha256:d56137fb1a4fa0f09686391273a2eba7bb874935e52d9d3fd6be3490918591a4 |

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
| 2026-08-02 | Done | Current-head release recycle and close-plan readiness passed; reviewed proof-last close is the final lifecycle operation. |

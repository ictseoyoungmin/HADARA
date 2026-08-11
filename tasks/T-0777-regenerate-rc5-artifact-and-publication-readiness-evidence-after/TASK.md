# T-0777 Regenerate RC5 artifact and publication-readiness evidence after T-0776 hardening.

## Identity

| Field | Value |
|---|---|
| ID | T-0777 |
| Title | Regenerate RC5 artifact and publication-readiness evidence after T-0776 hardening. |
| Status | Draft |
| Created | 2026-08-11T21:47 |
| Updated | 2026-08-11T21:47 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Produce a fresh 0.5.0-rc.5 release input from the post-T-0776 source, retain its exact tarball/checksum/manifest under the stable logical release workspace, and prove package/readiness gates with byte-bound evidence. | No npm, GitHub, Docker-image, or public-consumer mutation occurs in this capsule; operator publication is a post-close continuation. |

## Scope

| Boundary | Items |
|---|---|
| In | Retarget package metadata and active release prose to RC5, regenerate exact release artifact/checksum/manifest, retain locator metadata, run package and clean-checkout smokes, strict gate, release dry-run, publish dry-run, and bind structured evidence. |
| Out | npm publish, GitHub Release mutation, Docker image publication, public package recycle, stable promotion, and changes unrelated to the RC5 release contract. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Fix the RC5 release-input contract, source version, and current-state documentation. | In Progress |
| 2 | Generate and retain exact RC5 artifact/checksum/manifest with operator locator metadata. | Pending |
| 3 | Run package/readiness dry-run gates, bind evidence, and close. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current package metadata and active release docs consistently identify `0.5.0-rc.5` as the source candidate while preserving published RC4 and stable `latest=0.4.6` as historical/public state. | Pending | TBD | Package/docs reconciliation |
| AC-2 | Exact RC5 `.tgz`, `.sha256`, and manifest are generated from one clean source root, retained under `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.5/`, and recorded with byte hashes and a private local-path boundary. | Pending | TBD | Release artifact retention |
| AC-3 | Package smoke, clean-checkout smoke, strict release gate, release dry-run, and publish dry-run pass from the same RC5 release input without external mutation. | Pending | TBD | Release readiness gates |
| AC-4 | Operator publication handoff names the exact logical artifact locator and explicitly defers npm/GitHub publication and public recycle to a separate approved capsule. | Pending | TBD | Operator handoff |
| AC-5 | Canonical evidence binds the sanitized readiness report with `sha256`/`byteLength`; evidence lint and proof-last close pass. | Pending | TBD | Evidence Artifact Binding contract |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Package metadata/version and active release-doc reconciliation | Yes | Not Run | RC5 source candidate and RC4/latest public-state separation. | TBD |
| Exact release artifact/checksum/manifest generation and retention | Yes | Not Run | One source root, one byte identity, stable logical locator. | TBD |
| Package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run | Yes | Not Run | Readiness gates only; no external mutation. | TBD |
| Evidence artifact binding and lint | Yes | Not Run | Sanitized report bound with exact byte metadata. | TBD |
| Task close | Yes | Not Run | Proof-last close after handoff completion. | docs/TASK_WORKFLOW_COMMANDS.md |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0776 hardened evidence artifact binding | constraint | active | New evidence refs require exact bytes; RC4 artifact is invalid for promotion after source changes. |
| docs/RELEASE_READINESS.md | reference | active | Canonical release order, root separation, exact artifact retention, and no-publish boundary. |
| scripts/release/manual-publish-rc.sh | implementation-source | active | Operator publication helper must consume the retained exact RC5 artifact later. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | active | Evidence, validation, and proof-last close semantics. |

## Changes

| Area | Summary |
|---|---|
| Package/release docs | Retarget active source candidate from RC4 to RC5 without rewriting published-state history. |
| Release artifacts | Generate exact tarball, checksum, manifest, and locator metadata from one clean source root. |
| Evidence | Attach sanitized readiness report through byte-bound `artifacts[]`; retain no raw private logs. |
| Handoff | Provide exact logical artifact path and separate operator publication/recycle continuation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | RC4 remains public but is not promotion-safe after T-0776 source changes. | Open | docs/RELEASE_READINESS.md |
| RF-2 | Risk | Regenerated artifacts must never be described as RC4 originals or mixed with prior RC4 bytes. | Open | Exact RC5 artifact report |
| RF-3 | Follow-up | npm/GitHub publication and public recycle require a separate operator-approved capsule after this task closes. | Open | HANDOFF.md |

## Close Summary

RC5 release-readiness preparation is complete without external release mutation. The next capsule may perform operator-approved npm/GitHub publication and public consumer recycle only from the retained exact RC5 bytes.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Scope fixed: RC5 source retarget, exact artifact retention, byte-bound readiness evidence, no external publication. |

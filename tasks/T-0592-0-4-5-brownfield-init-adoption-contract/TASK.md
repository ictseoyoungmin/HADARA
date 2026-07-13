# T-0592 0.4.5 brownfield init adoption contract

## Identity

| Field | Value |
|---|---|
| ID | T-0592 |
| Title | 0.4.5 brownfield init adoption contract |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Define the 0.4.5 safe brownfield init adoption contract. | Incorporate reviewer feedback into `docs/specs/0.4.5`, register the new spec, and make release readiness depend on brownfield implementation/dogfood. |

## Scope

| Boundary | Items |
|---|---|
| In | Brownfield repository classification, zero-write bare init, adoption report schema, plan-hash execute contract, managed merge rules, project/HADARA version separation, staged implementation capsules. |
| Out | Implementing the classifier/planner/writer, changing `init` code, package release readiness. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read reviewer feedback and existing 0.4.5 registry spec. | Done |
| 2 | Add brownfield init adoption spec and link it from the existing 0.4.5 design. | Done |
| 3 | Register/render the new spec and validate registry health. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A dedicated brownfield init adoption spec exists with repository states, zero-write dry-run, plan-hash execute, action dispositions, fail-closed rules, and implementation capsules. | Done | ev:T-0592:4679ea7bfaed46119592009b | `docs/specs/0.4.5/brownfield-init-adoption.md` |
| AC-2 | The existing 0.4.5 docs registry spec references the brownfield adoption contract and blocks release readiness until it is implemented/dogfooded. | Done | ev:T-0592:4679ea7bfaed46119592009b | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |
| AC-3 | The new spec is registered in docs registry and rendered into the human projection. | Done | ev:T-0592:4bd2ca8f70cb4a1a81f4652c | `.hadara/docs-registry.json`, `docs/DOC_REGISTRY.md` |
| AC-4 | Validation evidence is recorded. | Done | ev:T-0592:549b44fa89614d619c195f67 | `docs doctor`, text contract checks, docs explain |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docs doctor all-scope | Yes | Passed | ev:T-0592:549b44fa89614d619c195f67 |
| Brownfield contract text check | Yes | Passed | ev:T-0592:4679ea7bfaed46119592009b |
| Docs registry explain | Yes | Passed | ev:T-0592:4bd2ca8f70cb4a1a81f4652c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/8625c65e-2502-4c18-a468-928eadfd778c/pasted-text.txt` | constraint | active | Reviewer feedback defining safe brownfield adoption. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Existing 0.4.5 registry/init cleanup design. |
| `docs/specs/0.4.5/brownfield-init-adoption.md` | implementation-source | active | New brownfield adoption contract. |

## Changes

| Area | Summary |
|---|---|
| Specs | Added `docs/specs/0.4.5/brownfield-init-adoption.md`. |
| Specs | Updated `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` to link brownfield adoption and gate release readiness. |
| Docs registry | Registered the new spec and rendered `docs/DOC_REGISTRY.md`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement T-0593 classifier/dry-run planner next. | Open | `docs/specs/0.4.5/brownfield-init-adoption.md` |
| RF-2 | Follow-up | Implement T-0594 managed merge and v3 adoption writer after the planner. | Open | `docs/specs/0.4.5/brownfield-init-adoption.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Added and registered safe brownfield adoption contract. |
| 2026-07-13 | Done | Spec, registry, and validation evidence completed. |

# T-0526 make status expected docs profile aware

## Identity

| Field | Value |
|---|---|
| ID | T-0526 |
| Title | make status expected docs profile aware |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make `hadara status` profile-aware for expected docs. | Basic/standard projects must not be degraded because HADARA-dev/governed-only docs are absent. |

## Scope

| Boundary | Items |
|---|---|
| In | `status` missing-source issue policy, operations status contract docs, focused tests. |
| Out | New init profiles, docs registry schema changes, command surface changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Make expected-doc checks profile/registry-aware. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Basic/standard profile projects without `docs/AGENT_HANDOFF.md` or `docs/DEVELOPMENT_SLICES.md` do not receive missing-doc warnings for those absent profile-optional docs. | Done | `ev:T-0526:78ff387430f3462ea3c8c919` | User report. |
| AC-2 | Governed or registry-explicit projects still warn when expected status source docs are missing. | Done | `ev:T-0526:78ff387430f3462ea3c8c919` | `docs/OPERATIONS_STATUS_CONTRACT.md` |
| AC-3 | Validation evidence is recorded, including Docker dist refresh before built-CLI smoke. | Done | `ev:T-0526:80cd4a6dfba041e0b622b0a5` | `AGENTS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status tests | Yes | Passed | `ev:T-0526:78ff387430f3462ea3c8c919` |
| Docker sync build and built status smoke | Yes | Passed | `ev:T-0526:80cd4a6dfba041e0b622b0a5` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User report | reference | active | `status` should not treat HADARA-dev-only docs as required for normal users. |
| `docs/OPERATIONS_STATUS_CONTRACT.md` | reference | active | Public JSON/health contract. |
| `AGENTS.md` | constraint | active | Use Docker sync build before built-CLI smoke. |

## Changes

| Area | Summary |
|---|---|
| Status | `hadara status` missing-doc warnings now use scaffold/docs-registry/profile expectations, so basic/standard projects are not degraded for absent governed/HADARA-dev-only docs while governed or explicitly registered docs remain enforced. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Over-suppressing missing-doc warnings could hide real governed-project drift. | Closed | Covered by governed/registry tests. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Implemented profile/registry-aware status source expectations and passed host focused plus Docker full validation. |

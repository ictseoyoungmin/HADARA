# T-0757 Converge Init v1 Document Routing Authority

## Identity

| Field | Value |
|---|---|
| ID | T-0757 |
| Title | Converge Init v1 Document Routing Authority |
| Status | Done |
| Created | 2026-08-09T19:54 |
| Updated | 2026-08-09T20:17 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make Init v1 document routing use one canonical registry and keep its generated read-map projection current. | `.hadara/documents.json` is authoritative for Init v1 projects; `.hadara/docs-registry.json` remains a legacy compatibility input only. |

## Scope

| Boundary | Items |
|---|---|
| In | Init v1/legacy registry selection, docs read/list/doctor/register/update/archive/supersede/unregister routing, deterministic `READ_MAP.md` regeneration, generated identity ownership guidance, and focused regression tests. |
| Out | PDF/DOCX content extraction, new public provider surfaces, release publication, and broad close-module refactoring. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the RC3 document-routing authority and projection contract. | Done |
| 2 | Implement Init v1 routing, guarded projection regeneration, and generated guidance alignment. | Done |
| 3 | Validate fresh Init v1, legacy compatibility, drift repair, and full repository behavior. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Init v1 read/list/doctor/read-map reports use `.hadara/documents.json` without `DOC_REGISTRY_MISSING`; legacy projects continue using `.hadara/docs-registry.json` as a compatibility path. | Met | ev:T-0757:0308a69d4e5f4687b37eeb84; ev:T-0757:c582c1dca87b433eb7263b10 | `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` |
| AC-2 | Init v1 document mutations update the canonical registry through reviewed before-hash execution and never create a second authoritative registry. | Met | ev:T-0757:0308a69d4e5f4687b37eeb84; ev:T-0757:c582c1dca87b433eb7263b10 | `src/services/docs-registry.ts` |
| AC-3 | `READ_MAP.md` is regenerated deterministically from the canonical registry, detects manual drift, and remains a fallback projection without task-local dynamic state. | Met | ev:T-0757:c582c1dca87b433eb7263b10; ev:T-0757:c582c1dca87b433eb7263b10 | `src/init/model.ts`; `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` |
| AC-4 | Generated and active guidance separates AGENTS policy, workflow operations, and READ_MAP routing; identity ownership links to a precise workflow section. | Met | ev:T-0757:c582c1dca87b433eb7263b10 | `src/init/templates.ts`; `docs/HADARA_WORKFLOW.md` |
| AC-5 | Focused tests, full `npm run check`, and built CLI fresh-init/read-map smokes pass. | Met | ev:T-0757:c582c1dca87b433eb7263b10; ev:T-0757:b2da5d7a6f024d52bd66ced2 | Validation table |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Init v1 document routing focused tests | Yes | Passed | exit 0 in 3348ms | ev:T-0757:c582c1dca87b433eb7263b10 |
| Fresh Init v1 routing smoke | Yes | Passed | Fresh Init v1 plan/apply with --adopt, canonical documents registry, generated READ_MAP, and no legacy registry verified | ev:T-0757:0308a69d4e5f4687b37eeb84; ev:T-0757:d418dbe0c73f440888a8204b |
| Full npm check | Yes | Passed | exit 0 in 57996ms | ev:T-0757:b2da5d7a6f024d52bd66ced2 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/archive/retired-2026-07-26/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | constraint | active | `.hadara/documents.json` and `READ_MAP.md` projection ownership. |
| `docs/archive/retired-2026-07-26/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | reference | active | C-004, L-005, and fallback routing requirements. |
| `docs/HADARA_WORKFLOW.md` | workflow | active | Current command and reading boundaries. |
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | No RC2 mutation; RC3 source only. |

## Changes

| Area | Summary |
|---|---|
| Registry authority | Done | Route Init v1 read and mutation operations through `.hadara/documents.json`, preserving legacy compatibility. |
| Projection | Done | Keep `.hadara/context/READ_MAP.md` deterministic and synchronized with the canonical registry. |
| Guidance | Done | Add precise identity ownership routing and keep generated docs roles distinct. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Non-Markdown locator extraction remains deferred; RC3 records format-neutral path routing only. | Open | Future `documents.v2` design |

## Close Summary

Implementation and validation are complete. The reviewed proof-last close is the remaining operator action.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined RC3 document-routing authority, projection, and generated-guidance boundaries. |
| 2026-08-09 | Ready for close | Init v1 routing, generated guidance, focused tests, fresh smoke, and full npm check passed. |
| 2026-08-09 | Done | Close-source documents prepared for reviewed proof-last execution. |

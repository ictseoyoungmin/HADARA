# T-0462 Agent UX fresh init quickstart verbosity hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0462 |
| Title | Agent UX fresh init quickstart verbosity hardening |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/cli/init.ts | implementation-source | approved | implemented | sha256:a751a6f6b86e34fb15ab5c9016cbbad04d38fabdd358859e2d69f11e98f9d2d5 | Generated 0.4 init workflow template. |
| tests/unit/init.test.ts | reference | approved | implemented | sha256:1262e7a62b2f231e1e16b5e2739c80df1cde375bc4f1b254d11dd1a464510bc6 | Init scaffold regression coverage. |
| tests/unit/schema-fixtures.test.ts | reference | approved | implemented | sha256:360b42680e46ae1ebba0ecb14c5f8027a568eb67cbb7a4909acd4f5f6ba6f766 | Schema fixture validation. |
| docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md | reference | approved | implemented | sha256:41106f8178c44bdd21f79b94c61e86ac3849ca0d4cd543539c7026ef3cbbc4f6 | Product scaffold compactness and generic-default constraints. |
| docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md | reference | approved | implemented | sha256:ca941c7f6551c1dd63d0e6cb10bb5b0cdb44b736a0afab0a40f0806f45325a96 | Workflow document role and command guidance constraints. |

## Goal

| Goal | Notes |
|---|---|
| Make fresh `hadara init` easier to enter without adding scaffold files or weakening workflow safety. | Add a compact top-of-file Quickstart to generated `docs/HADARA_WORKFLOW.md` while preserving the detailed lifecycle, read authority, evidence, and finalize guidance below it. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Inspect current fresh init workflow verbosity and choose a no-new-file quickstart improvement. | Done | ev:T-0462:ca54a04cfc91403f91eb81b5 |
| 2 | Add a compact Quickstart section before Minimal Loop in the generated workflow template. | Done | ev:T-0462:84b3176bc6cd4cde96c34534 |
| 3 | Add init template coverage for Quickstart presence, ordering, and early actionability. | Done | ev:T-0462:84b3176bc6cd4cde96c34534 |
| 4 | Validate focused tests/build and fresh governed init doctor cleanliness. | Done | ev:T-0462:84b3176bc6cd4cde96c34534; ev:T-0462:ca54a04cfc91403f91eb81b5 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Generated `docs/HADARA_WORKFLOW.md` contains a compact `## Quickstart` before `## Minimal Loop`. | Yes | Met | ev:T-0462:84b3176bc6cd4cde96c34534 | Required | src/cli/init.ts |
| AC-2 | Quickstart gives first actions for new project, work selection, task creation, routed file reads, and finalize close. | Yes | Met | ev:T-0462:84b3176bc6cd4cde96c34534 | Required | src/cli/init.ts |
| AC-3 | Fresh governed init remains doctor-clean and does not add new scaffold files. | Yes | Met | ev:T-0462:ca54a04cfc91403f91eb81b5 | Required | built CLI smoke |
| AC-4 | Focused init/schema tests and TypeScript build pass. | Yes | Met | ev:T-0462:84b3176bc6cd4cde96c34534 | Required | tests/unit/init.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Scoped Docker validation | `npx vitest run tests/unit/init.test.ts tests/unit/schema-fixtures.test.ts && npm run build` in `/tmp/hadara` after overlaying changed files. | Yes | Passed | ev:T-0462:84b3176bc6cd4cde96c34534 |
| Fresh governed init smoke | Built CLI `init --profile governed --json`, `init doctor --json`, file count, line count, and Quickstart position check in `/tmp/hadara-t0462-init-mP9Dg1`. | Yes | Passed | ev:T-0462:ca54a04cfc91403f91eb81b5 |
| Broad focused attempt with docs doctor | `npx vitest run tests/unit/init.test.ts tests/unit/docs-doctor.test.ts tests/unit/schema-fixtures.test.ts && npm run build` | No | Failed | ev:T-0462:e0c87ae662b84f8fa20128cc; resolved by ev:T-0462:1d80cfb0d819461d86a75c47 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/init.ts | L1135-L1156 | Updated | Added generated workflow Quickstart before Minimal Loop. | ev:T-0462:84b3176bc6cd4cde96c34534 |
| tests/unit/init.test.ts | L117-L156 | Updated | Added assertions for Quickstart presence, ordering, and early `task status` guidance. | ev:T-0462:84b3176bc6cd4cde96c34534 |
| dist/ | N/A | Generated | Refreshed built CLI output from Docker build. | ev:T-0462:84b3176bc6cd4cde96c34534 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Including `tests/unit/docs-doctor.test.ts` in the focused validation attempt failed on historical Required Reading / DEVELOPMENT_SLICES fixture assumptions outside this quickstart change; scoped validation and fresh init smoke resolve this capsule's readiness. | Open | ev:T-0462:e0c87ae662b84f8fa20128cc; ev:T-0462:1d80cfb0d819461d86a75c47 |
| RF-2 | Follow-up | Mounted workspace `task status` and `task finalize` still have long silent intervals; add progress or latency diagnostics next. | Open | T-0463 candidate |

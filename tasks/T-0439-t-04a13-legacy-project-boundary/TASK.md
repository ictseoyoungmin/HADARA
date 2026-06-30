# T-0439 T-04A13 Legacy Project Boundary

## Identity

| Field | Value |
|---|---|
| ID | T-0439 |
| Title | T-04A13 Legacy Project Boundary |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md | implementation-source | implementation-source | approved | sha256:fe90f8ef046cf98fa7acb8e2ae57a27479c44338e10d01fac4f75444d28bc954 | Docs registry/read-map metadata and drift contract. |
| docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md | reference | implementation-source | approved | sha256:e22b215183e9ae944ab419ccfce0f5360821b78657bff125c47f48628bf1e47c | Boundary context for this capsule line. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | implementation-source | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | T-04A13 sequence and bounded hardening allowance. |

## Goal

| Goal | Notes |
|---|---|
| Apply the immediate reviewer feedback that hardens docs registry/read-map behavior before broader 0.4 legacy-boundary work continues. | Keep this capsule bounded to small correctness and guidance fixes: registry metadata input, active task docs, recursive specs inbox, profile-aware finish advisories, stale validation wording, and evidence projection wording. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract from reviewer feedback. | Done | TASK.md |
| 2 | Implement bounded docs/read-map/validation hardening. | Done | Pending validation |
| 3 | Validate and record evidence. | Done | `ev:T-0439:b7d2205ef1744eb5b87ec87c`, `ev:T-0439:86ff7918e98f424eac9686c7`, `ev:T-0439:62d3893695344992b22ca881` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `docs register` accepts and persists v2 metadata fields for new registry entries. | Yes | Met | `ev:T-0439:86ff7918e98f424eac9686c7` | Required | Reviewer feedback item 1 |
| AC-2 | `docs read-map` treats active 0.4 Task Capsules as `TASK.md`, `HANDOFF.md`, and `EVIDENCE.md`, with `CONTEXT.md` left as legacy-only. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c`, `ev:T-0439:86ff7918e98f424eac9686c7` | Required | Reviewer feedback item 2 |
| AC-3 | Docs inbox/read-map discovery recursively scans nested `docs/specs/**` Markdown files. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c` | Required | Reviewer feedback item 3 |
| AC-4 | `task finish` shared-state advisories do not require absent docs that are not in the docs registry. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c`, `ev:T-0439:86ff7918e98f424eac9686c7` | Required | Reviewer feedback item 4 |
| AC-5 | Done-level scaffold placeholder guidance no longer tells agents to restore removed Scope / Out of Scope sections. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c` | Required | Reviewer feedback item 6 |
| AC-6 | Evidence projection wording says `EVIDENCE.md` is a generated projection file, not only generated slots. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c` | Required | Reviewer feedback risk 2 |
| AC-7 | Validation evidence is recorded. | Yes | Met | `ev:T-0439:b7d2205ef1744eb5b87ec87c`, `ev:T-0439:86ff7918e98f424eac9686c7`, `ev:T-0439:62d3893695344992b22ca881` | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Docker build | `npm run build` in ext4 Docker copy | Yes | Passed | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| Focused tests | `npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/task-finish.test.ts tests/unit/command-registry.test.ts tests/harness/harness-validate.test.ts` in ext4 Docker copy | Yes | Passed | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| Built CLI smokes | `docs register`, `docs read-map`, and `task finish` smokes after refreshing workspace `dist` | Yes | Passed | `ev:T-0439:86ff7918e98f424eac9686c7` |
| Diff hygiene | `git diff --check` | Yes | Passed | `ev:T-0439:62d3893695344992b22ca881` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/docs-registry.ts | L54-L62,L340-L413,L448-L448,L720-L783,L927-L961 | Add registry metadata fields/options, active 0.4 task docs, and recursive bounded specs discovery. | Reviewer feedback items 1-3. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| src/cli/docs.ts | L43-L60,L119-L123 | Wire v2 metadata options into `docs register`. | Reviewer feedback item 1. | `ev:T-0439:86ff7918e98f424eac9686c7` |
| src/task/task-finish.ts | L404-L427 | Filter shared-state advisories by registry or existing file when registry exists. | Reviewer feedback item 4. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| src/harness/validate.ts | L831-L834 | Update stale placeholder guidance. | Reviewer feedback item 6. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| src/services/capability-registry.ts | L801-L801,L1335-L1335 | Align docs register/evidence project command guidance. | Reviewer feedback item 1 and projection wording risk. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| tests/unit/docs-registry.test.ts | L160-L197,L200-L255 | Cover metadata registration, active task docs, nested specs discovery, and temp-plan exclusion. | Regression coverage. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| tests/unit/task-finish.test.ts | L6-L6,L111-L121 | Cover registry-aware shared-state advisories. | Regression coverage. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md | L92-L92 | Align projection wording with implementation. | Reviewer feedback risk 2. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md | L157-L157 | Align projection wording with implementation. | Reviewer feedback risk 2. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |
| docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md, docs/DEVELOPMENT_SLICES.md | whole-file | Update shared state for T-0439 completion and next T-04A13 mutation-boundary work. | Handoff continuity. | `ev:T-0439:b7d2205ef1744eb5b87ec87c` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Full T-04A13 legacy mutation blocking remains the next implementation slice. | Open | docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md |
| RF-2 | Follow-up | Existing `docs register` entries are not updated in this bounded patch; use future docs registry hardening if metadata edit-in-place is needed. | Open | Reviewer feedback item 1 |

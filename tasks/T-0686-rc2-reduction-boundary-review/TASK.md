# T-0686 RC2 Reduction Boundary Review

## Identity

| Field | Value |
|---|---|
| ID | T-0686 |
| Title | RC2 Reduction Boundary Review |
| Status | Done |
| Created | 2026-07-23T18:35 |
| Updated | 2026-07-23T18:43 |

## Goal

| Goal | Notes |
|---|---|
| Produce the decision record for a staged RC2 reduction from `5b62e35`, without changing product runtime. | Identify what must remain, what may be removed, the order of work, and the proof required before each deletion. |

## Scope

| Boundary | Items |
|---|---|
| In | Source and documentation audit; retained-contract inventory; removal candidates; staged implementation sequence; validation gates. |
| Out | Runtime refactor, package version change, publication, migration or compatibility implementation, and removal of any source file. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Restore and inspect the last committed product baseline. | Done |
| 2 | Separate core engineering guarantees from development-only, optional, and compatibility surfaces. | Done |
| 3 | Record removal order, acceptance gates, and unresolved decisions in this Task contract. | Done |
| 4 | Hand off this review for approval before implementation Capsules are created. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The document distinguishes retained guarantees, confirmed extraction/removal candidates, and items requiring prior characterization. | Met | Inspection recorded in History. | Priorities P0-P3 below |
| AC-2 | Each proposed implementation stage has a bounded outcome and validation gate. | Met | Inspection recorded in History. | Staged execution below |
| AC-3 | No production runtime behavior changed while preparing the decision record. | Met | ev:T-0686:596bd6346f2b4f70905bcdbd | Scope |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Restored baseline source and documentation audit | Yes | Passed | TASK.md Priorities and History |
| Working-tree boundary check before handoff | Yes | Passed | ev:T-0686:596bd6346f2b4f70905bcdbd |
| Working-tree boundary check | Yes | Passed | ev:T-0686:596bd6346f2b4f70905bcdbd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User direction, 2026-07-23 | constraint | active | Restore `HEAD`; retain only demonstrated simplifications; proceed in stages; document findings before implementation. |
| `AGENTS.md` | constraint | active | Use a Capsule, preserve evidence/close rules, and update current-state handoff. |
| `docs/ARCHITECTURE.md` and `docs/SECURITY_MODEL.md` | reference | active | Identify safety guarantees before reducing runtime. |
| `src/cli/main.ts`, `src/init/`, `src/task/`, `src/evidence/` | implementation-source | active | Audit command surface and the minimum complete workflow. |

## Changes

| Area | Summary |
|---|---|
| `tasks/T-0686-*` | Analysis-only Capsule created after resetting to `5b62e35`. |
| `docs/TASK_BOARD.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` | Current work now routes to this reduction-boundary review. |

## Priorities

### P0 - Freeze the Contract Before Deleting

| Finding | Why it is critical | Required decision / proof |
|---|---|---|
| The original task scaffold already keeps the human contract in one `TASK.md` and only a compact `HANDOFF.md` beside generated evidence. | Replacing it with many human-authored fragments directly violates the intended small-task workflow and is not simplification. | Retain this shape. Any schema simplification must preserve Goal, Scope, Plan, Acceptance, Validation, constraints, changes, risks, and history in `TASK.md`. |
| `src/evidence/evidence.ts` and `src/task/task-close.ts` carry append-only, redacted evidence and source-freshness close proof. | These are the product's review and integrity guarantees, not HADARA-dev convenience code. | Characterize and retain redaction, append serialization, bounded public summaries, close evidence idempotency, source hashing, and drift audit before touching adjacent modules. |
| `src/task/task-capsule.ts` protects task ID allocation, Task Board writes, and concurrent create through a local lock. | A smaller scaffold without collision and managed-write protection regresses delegated multi-session work. | Preserve task creation serialization, Board uniqueness, and non-overwrite behavior. |
| Existing tests are broad because they encode many unrelated surfaces. | Deleting the suite before mapping guarantees removes the only regression signal. | Create a compact characterization matrix first: one focused test per retained public promise, then remove obsolete tests with their retired surface. |

### P1 - Replace, Then Remove, Init and Lifecycle Complexity

| Finding | Candidate reduction | Gate before deletion |
|---|---|---|
| `src/init/project.ts`, `profile.ts`, `adoption.ts`, and scaffold generation implement `basic`/`standard`/`governed`, brownfield adoption, managed patches, and reviewed plan hashes. | Replace with one non-overwriting init scaffold. No profile selection, adoption mode, upgrade route, or human init plan hash is needed for the RC2 target. | Fresh-project init, existing-file no-overwrite, compact Capsule creation, validation update, and `closed-valid` close must pass from an installed package. |
| `task finalize` and its lower-level lifecycle helpers coexist with the user-facing close flow. | Make `task status` and proof-last `task close` the documented public loop; decide separately whether compatibility aliases remain. | A close characterization test must cover incomplete contract rejection, evidence requirement, idempotent close proof, and post-close drift detection. |
| The current docs and `AGENTS.md` contain conflicting old multi-document and profile-era instructions. | Rewrite routing and scaffold guidance only after the new workflow exists. | Static scan of generated scaffold, README, help, and required-reading docs for retired terms and stale command examples. |

### P2 - Extract Confirmed HADARA-dev and Release-Operator Code

| Finding | Candidate reduction | Gate before deletion |
|---|---|---|
| `hadara dev`, source-checkout Docker helpers, package smoke, and release implementation live under distributable `src/cli`. | Move development verification to `tools/`; retain only the two explicit release-operator scripts under `scripts/release/`. Do not delete the verification behavior until the tools own it. | `npm pack` file-list inspection, isolated install verification, and Docker source build must prove that the installed CLI has no development-only roots. |
| Release behavior has safety value but does not belong in the ordinary installed command surface. | Preserve explicit operator confirmation and clean-artifact checks in scripts or tools, rather than turning release into a toy or silently removing gates. | Script-level dry-run/confirmation tests and a documented operator invocation must replace removed CLI tests. |

### P3 - Defer Optional Read Surfaces Until Their Product Value Is Re-established

| Finding | Candidate reduction | Gate before deletion |
|---|---|---|
| Dashboard, TUI, MCP, Hermes, provider, harness, context graph/cache, schemas, docs registry, status projection, and operational-debt stacks dominate the current tree. | They are not part of the proposed RC2 core, but their dependencies and user value differ. Treat them as separate removal batches, not one deletion. | For each batch: identify its public command roots, generated files, documentation, tests, package files, and any dependency on retained evidence/close code. Prove the core CLI and fresh Capsule lifecycle without it. |
| `current.json`, managed sections, and document registry are compatibility and governance machinery intertwined with status and close. | Do not classify them as mere development code. First decide whether compact Markdown ownership can replace each specific invariant. | A source-to-invariant mapping and a fresh-project workflow test are required before removal. |
| README branding, npm version signal, and MIT guidance are package trust signals. | Retain or replace them deliberately; they must not disappear as collateral documentation cleanup. | Check the packed README and package metadata from the isolated install path. |

## Staged Execution

| Stage | Outcome | Permitted change | Exit gate |
|---|---|---|---|
| S1 | Baseline characterization | Add focused tests and an explicit retained-guarantee inventory; no removals. | Existing build plus focused evidence, close, task-create, init no-overwrite, and compact Capsule tests pass. |
| S2 | Unified init and Capsule contract | Replace profile/adoption/upgrade scaffolding while retaining task/evidence/close primitives. | Fresh init and complete compact Capsule reach `closed-valid`; existing files are unchanged. |
| S3 | Public CLI reduction | Route only the proven core commands; remove code and tests exclusively tied to retired roots. | Built help and installed package expose only approved roots; no retired-root imports remain. |
| S4 | Dev/release extraction | Move source-checkout helpers to `tools` and operator flow to the two release scripts. | Docker build, `npm pack`, isolated installation, and release-script checks pass. |
| S5 | Optional-surface retirement | Remove dashboard/TUI/MCP/provider/context/registry batches only after per-batch mapping. | Every removed batch has a documented rationale and the retained core test matrix remains green. |
| S6 | RC validation and release review | Update docs, run package and Docker verification, and make a separate publication decision. | Diff review, focused tests, installed-package verifier, and Docker evidence are attached. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | A line-count-driven deletion can remove security or close integrity with development-only code. | Open | P0 characterization matrix |
| RF-2 | Risk | A unified init can regress non-overwrite and concurrent task creation if it replaces rather than reuses safe primitives. | Open | P0 and S2 |
| RF-3 | Risk | Moving release code can weaken operator confirmation or artifact verification. | Open | P2 and S4 |
| RF-4 | Follow-up | Decide which optional surfaces are truly retired versus merely deferred after their dependency map is reviewed. | Open | P3 and S5 |
| RF-5 | Follow-up | Decide whether `task finalize` needs a temporary alias during the breaking RC2 transition. | Open | P1 and S3 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold created. |
| 2026-07-23 | In Progress | Restored repository to `5b62e35` at the user's request; audited original compact Capsule, evidence/close, init, command registry, and optional runtime surfaces. |
| 2026-07-23 | Done | Completed the staged reduction decision record; implementation requires a separate S1 characterization Capsule. |

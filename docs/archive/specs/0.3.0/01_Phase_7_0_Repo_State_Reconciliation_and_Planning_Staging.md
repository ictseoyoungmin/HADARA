# Phase 7.0 — Repo State Reconciliation and Planning Staging

## Status

Planned docs-first staging specification.

Phase 7.0 exists because Phase 7 must start from an internally consistent repository state. If README, release notes, project state, handoff, and task evidence disagree about the current published/source state, Phase 7.1+ will build registries on stale assumptions.

## Goal

Stage the Phase 7 specifications and reconcile current repository status documents without implementing runtime behavior.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Implement command registry | Phase 7.1. |
| Implement lifecycle guide | Phase 7.2. |
| Implement docs registry | Phase 7.3. |
| Implement managed sections | Phase 7.4. |
| Mark or archive old docs | Phase 7.5, after registry exists. |
| Publish a release | Phase 7.6 only after all required phases complete. |

## Required Pre-Edit Reading

Read these before changing docs:

```text
README.md
docs/RELEASE_NOTES.md
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
docs/TASK_BOARD.md
docs/DEVELOPMENT_SLICES.md
docs/TASK_WORKFLOW_COMMANDS.md
docs/IMPLEMENTATION_SOP.md
package.json
package-lock.json
```

If a current release task capsule exists, read its `TASK.md`, `EVIDENCE.md`, and `HANDOFF.md` before changing release-state prose.

## Files to Add

Add all Phase 7 specs under:

```text
docs/specs/0.3.0/
```

Required files:

```text
00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
01_Phase_7_0_Repo_State_Reconciliation_and_Planning_Staging.md
02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md
03_Phase_7_2_Lifecycle_Guide_and_Command_Portfolio_Audit.md
04_Phase_7_3_Document_Registry_and_Docs_Doctor.md
05_Phase_7_4_Managed_Sections_and_Safe_Patch_Plans.md
06_Phase_7_5_Docs_Cleanup_Operations.md
07_Phase_7_6_0_3_0_Release_Hardening_and_Installed-Package Validation.md
implementation_guides/SPEC_AUTHORING_RULES.md
implementation_guides/WORKER_AGENT_INSTRUCTIONS.md
implementation_guides/README_UPDATE_INSTRUCTIONS.md
```

Do not copy `BUNDLE_README.md` over the repository root `README.md`.

## Release-State Reconciliation Checklist

Reconcile current release status across these files:

| File | Required Check |
|---|---|
| `package.json` | Version matches intended current source package version. |
| `package-lock.json` | Root package version matches `package.json`. |
| `README.md` | Release Status and install examples reflect actual published/source status. |
| `docs/RELEASE_NOTES.md` | Latest entry does not call an already-published version only a source candidate. |
| `docs/PROJECT_STATE.md` | Current phase and latest completed task are consistent with handoff/task evidence. |
| `docs/AGENT_HANDOFF.md` | Active/next task points to Phase 7.0 or Phase 7.1, not an obsolete optional RC publish step. |
| `docs/TASK_BOARD.md` | Rows for current release tasks do not contradict their Task Capsule status. |
| Release task capsule | `TASK.md`/`EVIDENCE.md` publish status agrees with README/release notes. |

If a fact cannot be verified from repository evidence, do not invent it. Write a conservative note such as:

```text
Publication status requires operator verification before release notes are changed.
```

## Docs Update Requirements

### README

Add a clearly marked planning note:

```md
### Planned 0.3.0 Direction

The planned 0.3.0 line is Phase 7 Surface Refactor. It organizes HADARA's existing task, evidence, proof, lifecycle, release, and document surfaces so agents can distinguish primary lifecycle commands, diagnostics, advanced surfaces, canonical documents, historical documents, and safe Markdown update boundaries.

Phase 7.x labels are internal implementation phases, not npm release-candidate labels. A new external release should be prepared only after all required Phase 7.x work passes Phase 7.6 hardening and installed-package validation.
```

Do not advertise `hadara help lifecycle`, `hadara commands --json`, `hadara docs list`, or managed section patching as implemented before the corresponding phase lands.

### PROJECT_STATE

Add a short planning row or paragraph:

```text
Next planned line: Phase 7 Surface Refactor for 0.3.0. This line covers command registry/help, lifecycle guide, document registry, managed sections, docs cleanup, and release hardening. These specs are staged under docs/specs/0.3.0/ and are not implemented until their corresponding Task Capsules close valid.
```

### AGENT_HANDOFF

Set next recommended work to Phase 7.0 if staging is not complete, or Phase 7.1 if staging is complete.

Required reading for Phase 7.1:

```text
docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md
docs/TASK_WORKFLOW_COMMANDS.md
src/services/capability-registry.ts
src/cli/main.ts
```

### DEVELOPMENT_SLICES

Add future rows using Phase 7.x labels:

| Order | Slice | Capsule | Purpose | Done Evidence |
|---:|---|---|---|---|
| TBD | Phase 7.0 Repo State Reconciliation and Planning Staging | TBD | Stage specs and align release/docs state before implementation. | Docs staged; current-state docs reconciled; no runtime behavior claimed. |
| TBD | Phase 7.1 Command Surface Registry and Structured Help | TBD | Create command registry and registry-backed help/commands JSON. | Registry coverage tests; structured help smoke. |
| TBD | Phase 7.2 Lifecycle Guide and Command Portfolio Audit | TBD | Separate primary lifecycle from diagnostics/advanced surfaces. | Lifecycle guide JSON/docs; portfolio audit. |
| TBD | Phase 7.3 Document Registry and Docs Doctor | TBD | Classify documents and detect docs/required-reading drift. | Docs registry/list/doctor/explain smokes. |
| TBD | Phase 7.4 Managed Sections and Safe Patch Plans | TBD | Add bounded managed Markdown patch framework. | Dry-run/execute hash-guarded patch smoke. |
| TBD | Phase 7.5 Docs Cleanup Operations | TBD | Mark stale/superseded docs and prune default reading. | docs mark/archive dry-run tests. |
| TBD | Phase 7.6 0.3.0 Release Hardening and Installed-Package Recycle | TBD | Prove installed package and fresh-agent workflow. | Full suite, Docker, package smoke, clean-checkout, installed recycle. |

Use real order/task ids only when actual capsules are created.

### DECISIONS

Add a decision row if `docs/DECISIONS.md` exists and uses a decision table:

| ID | Date | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|---|
| TBD | YYYY-MM-DD | 0.3.0 will be implemented as Phase 7 Surface Refactor, not as rc4-rc9 internal phase labels. | Proposed/Accepted | Phase 6.1 already exists; Phase 7.x avoids confusing internal implementation phases with external prerelease labels. | `docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md` |

## Phase 7.0 Task Capsule Scope

Suggested task title:

```bash
hadara task create "Stage Phase 7 surface refactor specs" --json
```

In scope:

```text
- Add Phase 7 spec files.
- Add implementation guide files.
- Reconcile current release-state wording.
- Add Phase 7 planning note to README.
- Update Project State, Agent Handoff, Development Slices, and optional Decisions.
```

Out of scope:

```text
- Runtime code changes.
- New CLI commands.
- Registry implementation.
- Historical doc status changes.
- File moves/deletions.
- Release mutation.
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.0-1 | All Phase 7 spec files are present under `docs/specs/0.3.0/`. |
| AC-7.0-2 | No new spec uses rc4-rc9 as the implementation phase naming scheme. |
| AC-7.0-3 | README has a planning note but does not claim Phase 7.1+ features exist. |
| AC-7.0-4 | Release status wording is reconciled or explicitly marked as requiring operator verification. |
| AC-7.0-5 | Project State and Agent Handoff point to Phase 7 as next work. |
| AC-7.0-6 | Development Slices includes Phase 7.x future rows. |
| AC-7.0-7 | No historical docs are moved, deleted, or marked superseded. |
| AC-7.0-8 | Task evidence records docs-only scope and validation. |

## Validation

For docs-only staging:

```bash
git diff --check
```

If docs/protocol tests are lightweight and available:

```bash
npm run test:focused -- tests/unit/protocol-consistency.test.ts tests/unit/init.test.ts
```

Record if no runtime code changed:

```text
Docs-only Phase 7.0 staging; no runtime code changed. Full build/test deferred because behavior did not change.
```

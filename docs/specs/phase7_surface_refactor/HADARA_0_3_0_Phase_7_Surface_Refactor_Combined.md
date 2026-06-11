# HADARA 0.3.0 Phase 7 Surface Refactor Program

## Status

Draft replacement specification for the 0.3.0 surface-refactor line.

This document replaces the previous rc4-rc9 wording with Phase 7.x wording because the project already has Phase 6 and Phase 6.1 planning/history. Phase 7.x labels are implementation phases, not external release-candidate labels.

## Release Rule

All required Phase 7.x work must be completed before the next external HADARA release is prepared.

Do not publish after Phase 7.1, 7.2, 7.3, 7.4, or 7.5 individually. A release candidate or stable 0.3.0 artifact may be prepared only during Phase 7.6 after the full surface-refactor program passes installed-package recycle.

## Thesis

HADARA 0.3.0 is not primarily a feature-expansion release.

It is a surface-refactor release that turns the existing task, evidence, proof, close/audit, CI, release, and document surfaces into a coherent agent workflow product.

The current product problem is:

```text
HADARA has enough capabilities, but agents still pay too much judgment cost:
what to read, what to run, what is required, what is diagnostic, and what can be safely automated.
```

Phase 7 optimizes for:

```text
command clarity
lifecycle clarity
document role clarity
safe document maintenance
lower agent re-reading cost
lower command-selection ambiguity
```

## Product Positioning

HADARA is a project-local operating layer for agentic development.

It is not a full agent runtime, scheduler, or enterprise Rack layer. It makes long-running AI-assisted work inspectable, resumable, evidence-backed, and safely handoffable.

For 0.3.0, the product promise is:

```text
HADARA tells an agent:
1. where it is in the work lifecycle,
2. which commands matter now,
3. which commands are diagnostic or advanced,
4. which documents are canonical/current/historical,
5. which Markdown state can be safely updated by tooling,
6. and which writes require explicit dry-run/hash review.
```

## Repo-Aware Inputs

The implementation must account for these existing HADARA surfaces:

| Existing Surface | Phase 7 Implication |
|---|---|
| `src/services/capability-registry.ts` and `tools list` | Phase 7.1 must extend or project from existing capability metadata instead of creating an unrelated duplicate registry. |
| `src/cli/main.ts` dispatch/help structure | Phase 7.1 must replace manual flat help with registry-backed structured help and tests for dispatch/help drift. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Phase 7.2 should promote this as the canonical lifecycle seed rather than inventing a conflicting lifecycle. |
| `src/cli/init.ts` basic/standard/governed profile generation | Phase 7.3 document registry must integrate with init profiles, init doctor, init upgrade, register-doc, and Required Reading. |
| `docs/SCHEMAS.md` and `src/schemas/schema-index.json` | Every new JSON report contract must be registered and fixture-tested. |
| Existing dry-run/before-hash patterns | Phase 7.4 and Phase 7.5 must reuse dry-run-first, before-hash, fail-closed write semantics. |

## Phase Map

| Phase | Name | Primary Outcome |
|---|---|---|
| Phase 7.0 | Repo State Reconciliation and Planning Staging | Align current release/docs state, stage the Phase 7 specs, and remove rc-phase terminology. |
| Phase 7.1 | Command Surface Registry and Structured Help | Every public command has metadata; help and command discovery are registry-backed. |
| Phase 7.2 | Lifecycle Guide and Command Portfolio Audit | Primary capsule lifecycle is separated from diagnostics, project-level, release-only, dev-only, UI, integration, and advanced commands. |
| Phase 7.3 | Document Registry and Docs Doctor | Documents become machine-classified by owner, kind, status, read-time, and update owner; init profiles seed registry entries. |
| Phase 7.4 | Managed Sections and Safe Patch Plans | HADARA can plan and apply bounded Markdown updates only inside declared managed sections or existing bounded write paths. |
| Phase 7.5 | Docs Cleanup Operations | Stale/superseded docs can be marked, explained, and excluded from default required reading through dry-run-first operations. |
| Phase 7.6 | 0.3.0 Release Hardening and Installed-Package Recycle | Installed-package recycle, fresh-init installed-package recycle, docs registry installed-package recycle, managed-patch validation, and release readiness. |

## Dependency Rules

Implement in order:

```text
7.0 Repo State Reconciliation
  -> 7.1 Command Registry
  -> 7.2 Lifecycle Guide
  -> 7.3 Document Registry
  -> 7.4 Managed Sections
  -> 7.5 Docs Cleanup
  -> 7.6 Release Hardening
```

Rules:

| Rule | Reason |
|---|---|
| Do not implement managed document patching before document registry exists. | Patch ownership depends on document ownership/status. |
| Do not implement docs cleanup before document statuses exist. | Cleanup needs canonical/historical/superseded classification. |
| Do not add new public commands before command registry coverage exists. | New surface must declare family/scope/write boundary at creation. |
| Do not rewrite README as if 0.3.0 has shipped before Phase 7.6. | README must reflect implemented behavior only. |
| Do not use rc4-rc9 language in new specs. | Phase 7.x is the internal implementation program. |

## Non-Goals for Phase 7

| Non-Goal | Reason |
|---|---|
| Full agent runtime or scheduler | HADARA remains a project-local operating layer. |
| Rack/enterprise behavior | Rack is a later product layer. |
| Broad automatic document rewriting | Unbounded doc writes can corrupt user-authored project context. |
| Automatic historical deletion | Historical proof and planning context must be preserved. |
| Dashboard/TUI redesign | UI can consume future registries, but Phase 7 starts with CLI/document foundations. |
| Broad evidence migration | Evidence v2 migration remains its own track. |
| Release/publish automation expansion | Publish mutation remains operator-approved and release-gated. |

## Command Consolidation Principle

Phase 7 must not merely classify the existing CLI surface. It must reduce the canonical surface.

Rules:

```text
- Keep compatibility commands executable unless an explicit later deprecation window is accepted.
- Remove non-primary commands from default help and primary lifecycle docs.
- Mark compatibility aliases, diagnostic commands, advanced/dev/release surfaces, and deprecation candidates in the authoritative capability registry.
- Prefer one canonical command family for one user intent.
```

Initial consolidation direction:

```text
doctor family      -> one doctor concept with scoped projections
status family      -> project status / task status / proof status only as primary
task inspection    -> task status primary; task show/task complete non-canonical
evidence writing   -> evidence add-command primary now; evidence collect non-canonical
policy preflight   -> policy preflight as canonical concept
smoke family       -> smoke core/package/clean-checkout family shape
remediation        -> protocol remediate as canonical remediation family
release/dev/ui     -> hidden from primary lifecycle help
```


## Design Principles

| Principle | Meaning |
|---|---|
| Registry before automation | A command or document must be classified before tools automate around it. |
| One source of truth | Help, `commands --json`, `tools list`, docs, and README must not maintain independent command inventories. |
| Canonical path over command sprawl | Agents should see a small primary path and optional diagnostics. |
| Read-only first | New planning/doctor surfaces start read-only. |
| Dry-run before mutation | Any write operation must preview before executing. |
| Managed section only | Automated Markdown writes must touch only declared managed regions or existing bounded write paths. |
| Fail closed on stale state | Before-hash or section-hash mismatch blocks writes. |
| Preserve user-authored context | Freeform project docs and prose are not overwritten by default. |
| Schema fixture before public JSON | New JSON reports need schema entries and contract tests. |

## Canonical Capsule Lifecycle Target

Phase 7 should converge on this primary worker path:

```text
1. Select or create a Task Capsule.
2. Inspect task status and required docs.
3. Implement the scoped change.
4. Record evidence.
5. Finish bounded task bookkeeping.
6. Check readiness.
7. Close by recording close proof.
8. Audit close proof.
9. Suggest or update handoff.
```

Primary commands:

```bash
hadara task next --json
hadara task create "..." --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json
hadara task audit-close --task T-XXXX --json
hadara handoff suggest --task T-XXXX --json
```

Diagnostic side paths:

```bash
hadara evidence lint --task T-XXXX --json
hadara proof status --task T-XXXX --json
hadara proof explain --task T-XXXX --json
hadara protocol doctor --task T-XXXX --json
hadara harness validate --task T-XXXX --level done --json
hadara ci gate --mode advisory --task T-XXXX --json
```

## Cross-Phase Schema Requirements

New report schemas must be registered in `src/schemas/schema-index.json` and summarized in `docs/SCHEMAS.md`.

Expected schema ids:

```text
hadara.commands.registry.v1
hadara.command.help.v1
hadara.lifecycle.guide.v1
hadara.command.portfolioAudit.v1
hadara.docs.registry.v1
hadara.docs.list.v1
hadara.docs.doctor.v1
hadara.docs.explain.v1
hadara.managedSection.v1
hadara.docs.patchPlan.v1
hadara.docs.patchApply.v1
hadara.docs.mark.v1
hadara.docs.archivePlan.v1
```

If implementation chooses a different schema id, the task must explain why in `DECISIONS.md` or the Task Capsule.

## Shared Report Envelope

Unless an existing command already has a stable report contract, new Phase 7 reports should use this envelope:

```ts
interface HadaraPhase7ReportBase {
  schemaVersion: string;
  command: string;
  ok: boolean;
  mode?: 'read-only' | 'dry-run' | 'execute';
  project?: {
    rootKind: 'current-working-directory' | 'explicit-project-root';
    fingerprint?: string;
  };
  summary?: Record<string, unknown>;
  issues: Array<{
    severity: 'info' | 'warning' | 'error';
    code: string;
    path?: string;
    commandId?: string;
    message: string;
    nextAction?: string;
  }>;
}
```

## Shared Validation Baseline

Each implementation phase should run:

```bash
npm run build
npm test
npm run dev:docker-sync-build
```

If Docker is unavailable, the task must record:

```text
- exact fallback validation path,
- why Docker was unavailable,
- residual release risk,
- and whether Phase 7.6 must rerun Docker before release.
```

## Definition of Done for Phase 7 Program

The Phase 7 program is complete when a fresh agent can start with:

```bash
hadara help lifecycle
```

and correctly understand:

```text
what to do first,
what is required,
what is diagnostic,
what is advanced,
which docs to read,
which docs are historical/superseded,
and what HADARA can safely update.
```


---

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


---

# Phase 7.1 — Command Surface Registry and Structured Help

## Status

Planned implementation specification.

## Problem

The CLI exposes many commands across task lifecycle, evidence, proof, protocol, release, dev validation, UI, integration, and agent-loop surfaces. A flat help list makes agents infer:

```text
which command is primary,
which command is diagnostic,
which command mutates state,
which command is human/release/operator only,
and which commands are safe at the current lifecycle stage.
```

Phase 7.1 removes that inference burden by introducing a command registry and registry-backed structured help.

## Goal

Create a single command surface registry that powers:

```text
hadara help
hadara help lifecycle
hadara help command <id>
hadara commands --json
hadara tools list --json, either directly or by projection
```

The default help must become lifecycle-oriented and short. Full inventory must remain available through `hadara commands --json` and family-specific help.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Delete or rename commands | Phase 7.1 classifies existing surface; portfolio decisions happen in Phase 7.2. |
| Deprecate commands | Requires audit evidence from Phase 7.2. |
| Implement docs registry | Phase 7.3. |
| Implement managed Markdown writes | Phase 7.4. |
| Change command behavior | Phase 7.1 should be discovery/help focused. |

## Authoritative Inventory Decision

HADARA must have exactly one authoritative command/capability inventory.

The authoritative source is:

```text
src/services/capability-registry.ts
```

Do not create an independent command registry that duplicates command metadata.

`hadara help`, `hadara help lifecycle`, `hadara help command <id>`, `hadara commands --json`, `hadara tools list --json`, MCP capability exposure, README command tables, and lifecycle guide outputs must be derived from `capability-registry.ts` or from tested projections of it.

If helper modules are added, they may render or project the registry, but they must not define independent command metadata.

## Existing Surface Integration

Use this pattern:

| Pattern | Rule |
|---|---|
| Required | Promote/extend existing `src/services/capability-registry.ts` into the richer command/capability inventory. |
| Allowed | Add rendering helpers such as `src/cli/help.ts` or `src/cli/commands.ts` that import from the registry. |
| Disallowed | Create `src/cli/command-registry.ts` as a second source of truth. |
| Disallowed | Keep manual help text, capability registry, README command list, and docs command matrix as independent inventories. |

`tools list` remains a compatibility projection. It must not become a separate source of truth.

`commands --json` is the full CLI command metadata projection.

## Files to Add or Change

Expected files:

```text
src/services/capability-registry.ts      # authoritative inventory
src/services/tools-list.ts               # compatibility projection from capability registry
src/cli/help.ts                          # registry-backed renderer only
src/cli/commands.ts                      # registry-backed commands --json handler
src/schemas/commands-registry.schema.json
src/schemas/command-help.schema.json
src/schemas/schema-index.json
docs/COMMAND_SURFACE.md
docs/SCHEMAS.md
tests/unit/command-registry.test.ts
tests/unit/help.test.ts
tests/unit/tools-list-command-registry.test.ts
```

If file names differ, document the reason in the task `DECISIONS.md`.

## Registry Type Model

Implement equivalent TypeScript types:

```ts
export type CommandFamily =
  | 'start'
  | 'capsule-lifecycle'
  | 'proof-diagnostics'
  | 'project-health'
  | 'docs-governance'
  | 'release-package'
  | 'dev-validation'
  | 'integrations'
  | 'ui'
  | 'agent-loop'
  | 'install'
  | 'advanced';

export type CommandScope =
  | 'project'
  | 'capsule'
  | 'task'
  | 'evidence'
  | 'proof'
  | 'docs'
  | 'release'
  | 'package'
  | 'dev'
  | 'integration'
  | 'ui'
  | 'local-state';

export type LifecycleStage =
  | 'discover'
  | 'create'
  | 'inspect'
  | 'work'
  | 'evidence'
  | 'finish'
  | 'ready'
  | 'close'
  | 'audit'
  | 'handoff'
  | 'none';

export type CommandRequiredness =
  | 'primary'
  | 'conditional'
  | 'diagnostic'
  | 'advanced'
  | 'release-only'
  | 'dev-only'
  | 'integration-only'
  | 'deprecated'
  | 'disabled';

export type CommandWriteBoundary =
  | 'read-only'
  | 'task-capsule-create'
  | 'task-status-bookkeeping'
  | 'evidence-append'
  | 'close-evidence-append'
  | 'managed-doc-section'
  | 'shared-doc-suggestion'
  | 'shared-doc-write'
  | 'project-scaffold'
  | 'release-artifact'
  | 'external-subprocess'
  | 'release-mutation'
  | 'local-cache'
  | 'integration-opt-in';

export type CommandActor =
  | 'agent-worker'
  | 'coordinator'
  | 'operator'
  | 'release-operator'
  | 'human-only';

export interface CommandRegistryExample {
  title: string;
  command: string;
  when: string;
}

export interface CommandRegistryEntry {
  id: string;                         // stable id, e.g. 'task.close'
  command: string;                    // user-visible command pattern
  summary: string;
  canonical: boolean;                 // appears as a preferred command surface
  aliasFor?: string;                  // set when this command is compatibility surface
  deprecatedCandidate?: boolean;       // true when marked for future removal/replacement review
  appearsInDefaultHelp: boolean;       // false for diagnostic/advanced/dev/release-only surfaces
  family: CommandFamily;
  scope: CommandScope;
  lifecycleStage: LifecycleStage;
  requiredness: CommandRequiredness;
  writeBoundary: CommandWriteBoundary;
  readOnly: boolean;
  risk: 'low' | 'medium' | 'high';
  actor: CommandActor;
  status: 'stable' | 'experimental' | 'planned' | 'deprecated' | 'disabled';
  schemaVersion?: string;
  since?: string;
  aliases?: string[];
  docs: string[];
  examples: CommandRegistryExample[];
  related: string[];
  conflictsWith: string[];
  notes?: string;
}
```


## Command Consolidation Policy

Phase 7.1 must not only classify commands. It must begin reducing the canonical surface.

Physical command removal is out of scope for Phase 7.1, but canonical surface reduction is in scope.

Every registry entry must declare:

```ts
canonical: boolean;
aliasFor?: string;
deprecatedCandidate?: boolean;
appearsInDefaultHelp: boolean;
```

Rules:

| Rule | Meaning |
|---|---|
| Canonical commands appear in lifecycle help and README primary paths. |
| Aliases remain executable for compatibility but do not appear in the primary lifecycle. |
| Diagnostic commands are available through help diagnostics or family help, not default help. |
| Advanced/dev/release/UI/integration commands are hidden from default worker help. |
| Deprecated candidates are not removed in Phase 7.1; they are documented for Phase 7.2 audit. |

### Initial Canonical Surface Decisions

These decisions are binding for registry metadata unless implementation discovers a concrete incompatibility and records it in the task `DECISIONS.md`.

| Current Command | Phase 7.1 Canonical Decision | Canonical / Replacement Surface |
|---|---|---|
| `task show` | Compatibility alias / non-canonical | `task status --view full` or `task.status` full view projection |
| `task complete` | Non-canonical read-only workflow guide | `task status --view guide` or lifecycle guide projection |
| `evidence collect` | Non-canonical compatibility surface | future `evidence add`; current `evidence add-command` remains primary command-log evidence path |
| `ops status` | Non-canonical alias | `status --view ops` or project status projection |
| `policy check-shell` | Non-canonical alias | `policy preflight` |
| `write preflight` | Non-canonical alias | `policy preflight` with write-boundary metadata |
| `package smoke` | Non-canonical alias candidate | `smoke package` family shape, while existing command remains executable |
| `task upgrade-scaffold` | Non-canonical remediation alias candidate | `protocol remediate --fix task-scaffold` |
| `harness validate` | Diagnostic only | `task ready` is primary readiness; `harness validate` debugs blockers |
| `dev docker-check` | Dev-only | hidden from default help |
| `run scaffold` / `run` | Advanced harness | hidden from default help |
| `dashboard serve` / `tui` | UI surface | hidden from default primary lifecycle |
| `release *` | Release-only | shown under `hadara help release`, not default worker lifecycle |
| `mcp serve`, `hermes *`, `install plan` | Integration/advanced | hidden from default worker lifecycle |

Phase 7.1 must not remove these commands. It must mark them correctly and keep compatibility.

Phase 7.2 will decide which aliases become formal deprecation candidates.

### Default Help Rule

Default `hadara` / `hadara help` must show only:

```text
start commands,
primary capsule lifecycle commands,
core proof diagnostics,
and pointers to release/dev/integration/advanced help.
```

It must not show the full inventory.


## Minimum Registry Inventory

The registry must cover every public command dispatched or documented at the time Phase 7.1 is implemented.

Seed entries must include at least:

```text
version
doctor
init
init.doctor
init.upgrade
init.register-doc
init.enable-integration

task.create
task.list
task.show
task.next
task.status
task.complete
task.finish
task.upgrade-scaffold
task.ready
task.close
task.audit-close

evidence.collect
evidence.add-command
evidence.list
evidence.lint
evidence.migrate

proof.status
proof.explain
ci.gate

debt.list
debt.show
protocol.doctor
protocol.remediate
tools.list
handoff.update
handoff.suggest
write.preflight
policy.check-shell
policy.preflight-shell
harness.validate
harness.replay
hermes.detect
hermes.export-context
mcp.serve
status
ops.status
run-state.show
run-state.resume
install.plan
smoke.run
smoke.clean-checkout
package.smoke
release.dry-run
release.publish
release.artifact
release.gate
dashboard.serve
tui
run.scaffold
run
```

If a command is intentionally excluded, add an explicit `disabled` or `advanced` entry explaining why.

## Example Entries

```ts
{
  id: 'task.close',
  command: 'hadara task close --task <task-id> [--execute] [--json]',
  summary: 'Preview or append close proof for a Task Capsule after readiness passes.',
  canonical: true,
  appearsInDefaultHelp: true,
  family: 'capsule-lifecycle',
  scope: 'capsule',
  lifecycleStage: 'close',
  requiredness: 'primary',
  writeBoundary: 'close-evidence-append',
  readOnly: false,
  risk: 'medium',
  actor: 'agent-worker',
  status: 'stable',
  schemaVersion: 'hadara.task.close.v1',
  docs: ['docs/TASK_WORKFLOW_COMMANDS.md'],
  examples: [
    { title: 'Preview close', command: 'hadara task close --task T-0001 --json', when: 'After task ready passes.' },
    { title: 'Append close proof', command: 'hadara task close --task T-0001 --execute --json', when: 'After reviewing the dry-run report.' }
  ],
  related: ['task.ready', 'task.audit-close', 'proof.status'],
  conflictsWith: ['task.finish']
}
```

```ts
{
  id: 'harness.validate',
  command: 'hadara harness validate --task <task-id> [--level draft|done] [--json]',
  summary: 'Run direct Task Capsule structure and done-level diagnostics.',
  family: 'proof-diagnostics',
  scope: 'capsule',
  lifecycleStage: 'ready',
  requiredness: 'diagnostic',
  writeBoundary: 'read-only',
  readOnly: true,
  risk: 'low',
  actor: 'agent-worker',
  status: 'stable',
  schemaVersion: 'hadara.harness.validate.v1',
  docs: ['docs/TASK_WORKFLOW_COMMANDS.md'],
  examples: [
    { title: 'Debug done readiness', command: 'hadara harness validate --task T-0001 --level done --json', when: 'When task ready reports blockers.' }
  ],
  related: ['task.ready', 'protocol.doctor', 'evidence.lint'],
  conflictsWith: []
}
```

## CLI Behavior

Add or update these command surfaces:

```bash
hadara help
hadara help lifecycle
hadara help command <id>
hadara help family <family>
hadara commands --json
hadara commands --family capsule-lifecycle --json
hadara commands --requiredness primary --json
```

`hadara` with no args should behave like `hadara help`.

### Default Help Layout

Default help should be short:

```text
HADARA — project-local operating layer for evidence-backed agent work

Start:
  hadara help lifecycle
  hadara task next --json
  hadara task status --task T-XXXX --json

Primary capsule lifecycle:
  discover/create -> inspect -> evidence -> finish -> ready -> close -> audit -> handoff

Use:
  hadara help lifecycle       Show the canonical task loop.
  hadara help command <id>    Explain one command.
  hadara commands --json      Machine-readable command registry.

Advanced surfaces:
  release/package, dev validation, integrations, dashboard/TUI, run harness.
```

Do not print the entire command inventory in default help.

## JSON Contract: `hadara.commands.registry.v1`

`hadara commands --json` should return:

```json
{
  "schemaVersion": "hadara.commands.registry.v1",
  "command": "commands",
  "ok": true,
  "registryVersion": 1,
  "filters": {
    "family": null,
    "requiredness": null
  },
  "commands": [
    {
      "id": "task.close",
      "command": "hadara task close --task <task-id> [--execute] [--json]",
      "summary": "Preview or append close proof for a Task Capsule after readiness passes.",
      "canonical": true,
      "appearsInDefaultHelp": true,
      "family": "capsule-lifecycle",
      "scope": "capsule",
      "lifecycleStage": "close",
      "requiredness": "primary",
      "writeBoundary": "close-evidence-append",
      "readOnly": false,
      "risk": "medium",
      "actor": "agent-worker",
      "status": "stable",
      "schemaVersion": "hadara.task.close.v1",
      "docs": ["docs/TASK_WORKFLOW_COMMANDS.md"],
      "related": ["task.ready", "task.audit-close", "proof.status"],
      "conflictsWith": ["task.finish"]
    }
  ],
  "issues": []
}
```

## Drift Tests

Add tests that fail when inventories drift:

| Test | Expected Assertion |
|---|---|
| `command-registry covers dispatch` | Every public top-level/subcommand dispatch has a registry id. |
| `registry ids unique` | No duplicate ids or command patterns. |
| `help uses registry` | Help output includes registry-generated primary commands. |
| `default help short` | Default help does not dump the full inventory. |
| `tools list projection` | CLI capabilities in `tools list` are generated from the authoritative capability registry. |
| `canonical surface reduction` | Default help excludes non-canonical, advanced, dev-only, release-only, and alias commands. |
| `alias mapping` | Every non-canonical compatibility command has `aliasFor`, `deprecatedCandidate`, or non-primary requiredness metadata. |
| `schemas registered` | New schema fixtures exist in `schema-index.json`. |

Implementation may use static command inventories if dynamic dispatch parsing is impractical, but the test must be explicit and easy to update.

## Documentation Updates

Create `docs/COMMAND_SURFACE.md` with:

```text
- command families,
- requiredness definitions,
- write boundary definitions,
- primary lifecycle commands,
- diagnostic commands,
- advanced/release/dev/integration/UI commands,
- rule for adding new commands.
```

Update `docs/TASK_WORKFLOW_COMMANDS.md` only to reference the registry/help surfaces. Do not duplicate the full registry.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.1-1 | Every public command has exactly one command registry entry. |
| AC-7.1-2 | `hadara help` is registry-backed and lifecycle-oriented, not a flat full command dump. |
| AC-7.1-3 | `hadara help lifecycle` shows the primary lifecycle and diagnostic side paths. |
| AC-7.1-4 | `hadara help command <id>` explains family, scope, lifecycle stage, requiredness, write boundary, examples, docs, related commands, and conflicts. |
| AC-7.1-5 | `hadara commands --json` returns `hadara.commands.registry.v1`. |
| AC-7.1-6 | `tools list` remains compatible and is generated from the same authoritative capability registry. |
| AC-7.1-7 | The registry records `canonical`, `aliasFor`, `deprecatedCandidate`, and `appearsInDefaultHelp` where applicable. |
| AC-7.1-8 | Default help hides non-canonical, advanced, dev-only, release-only, UI, integration, and alias commands. |
| AC-7.1-9 | New schema fixtures are registered. |
| AC-7.1-10 | Tests fail on missing registry metadata for a public command. |
| AC-7.1-11 | Tests fail if a second unprojected command inventory is introduced. |

## Validation

```bash
npm run test:focused -- tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/tools-list-command-registry.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help
node dist/cli/main.js help lifecycle
node dist/cli/main.js help command task.close
node dist/cli/main.js commands --json
node dist/cli/main.js commands --family capsule-lifecycle --json
```


---

# Phase 7.2 — Lifecycle Guide and Command Portfolio Audit

## Status

Planned implementation specification.

## Problem

HADARA already has a meaningful task lifecycle, but similar-looking commands can be misused unless their roles are explicit.

Examples:

| Confusable Commands | Required Distinction |
|---|---|
| `task ready` vs `harness validate` | Primary readiness gate vs direct diagnostic validation. |
| `task complete` vs `task finish` | Read-only workflow compressor vs bounded status bookkeeping writer. |
| `task close` vs `task audit-close` | Append close proof vs verify already-recorded close proof. |
| `proof status` vs `ci gate` | Task proof read model vs aggregated advisory/strict gate. |
| `handoff suggest` vs `handoff update` | Read-only coordinator suggestion vs shared-doc write. |
| `release gate` vs `task ready` | Project release readiness vs capsule readiness. |

Phase 7.2 turns these distinctions into a canonical lifecycle guide and command portfolio audit.

## Goal

Create a lifecycle guide that agents can follow without reading every command, and create a portfolio audit that records why overlapping commands exist.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Physically remove commands | Compatibility windows are required. Phase 7.2 may mark aliases/deprecation candidates but must not break existing commands. |
| Change command semantics | This phase documents and projects existing semantics unless a small metadata addition is required. |
| Implement document registry | Phase 7.3. |
| Implement session start packets | Should wait until command and document registries are both available. |

## Inputs

Required reading before implementation:

```text
docs/TASK_WORKFLOW_COMMANDS.md
docs/COMMAND_SURFACE.md
src/cli/command-registry.ts
src/schemas/task-complete-flow.schema.json
src/schemas/task-finish.schema.json
src/schemas/task-ready.schema.json
src/schemas/task-close.schema.json
src/schemas/task-audit-close.schema.json
```

## Files to Add or Change

```text
docs/LIFECYCLE_GUIDE.md
docs/COMMAND_PORTFOLIO_AUDIT.md
docs/TASK_WORKFLOW_COMMANDS.md
src/cli/help.ts
src/cli/commands.ts or lifecycle-guide service file
src/schemas/lifecycle-guide.schema.json
src/schemas/command-portfolio-audit.schema.json
src/schemas/schema-index.json
tests/unit/lifecycle-guide.test.ts
tests/unit/command-portfolio-audit.test.ts
```

## Canonical Lifecycle Model

Define lifecycle stages as stable vocabulary:

| Stage | Meaning | Primary Command |
|---|---|---|
| discover | Find current/next work. | `task next` |
| create | Create a capsule if needed. | `task create` |
| inspect | Read current task state. | `task status` |
| work | Make project changes within scope. | project-specific |
| evidence | Record validation evidence. | `evidence add-command` |
| finish | Sync bounded task status bookkeeping. | `task finish` |
| ready | Check done-level readiness. | `task ready` |
| close | Append close proof after readiness passes. | `task close --execute` |
| audit | Verify close proof. | `task audit-close` |
| handoff | Suggest or update next handoff state. | `handoff suggest` / `handoff update` |

## Lifecycle Guide Report

`hadara help lifecycle --json` should return `hadara.lifecycle.guide.v1`:

```json
{
  "schemaVersion": "hadara.lifecycle.guide.v1",
  "command": "help.lifecycle",
  "ok": true,
  "primaryPath": [
    {
      "stage": "discover",
      "commandId": "task.next",
      "command": "hadara task next --json",
      "requiredness": "primary",
      "writeBoundary": "read-only",
      "when": "At session start or after completing a task."
    },
    {
      "stage": "evidence",
      "commandId": "evidence.add-command",
      "command": "hadara evidence add-command --task T-XXXX --summary \"...\" --result passed --json",
      "requiredness": "primary",
      "writeBoundary": "evidence-append",
      "when": "After running project validation or recording relevant work proof."
    }
  ],
  "diagnostics": [
    {
      "commandId": "harness.validate",
      "useWhen": "task ready reports format or done-level blockers"
    },
    {
      "commandId": "proof.explain",
      "useWhen": "proof status is stale, weak, or confusing"
    }
  ],
  "advanced": [
    { "family": "release-package", "useWhen": "release capsule only" },
    { "family": "dev-validation", "useWhen": "HADARA-dev validation only" }
  ],
  "issues": []
}
```

## Binding Consolidation Decisions

Phase 7.2 must turn the Phase 7.1 canonical/alias metadata into an explicit portfolio audit.

At minimum, decide and document the following:

| Current Surface | Decision | Canonical Surface |
|---|---|---|
| `doctor`, `init doctor`, `protocol doctor` | Consolidate conceptually under `doctor` family. Existing commands remain aliases/projections. | `doctor --scope init|protocol|docs|profile|all`, `doctor --task T-XXXX` if implemented or planned. |
| `status`, `ops status`, `run-state show/resume` | Keep `status` as project status; demote `ops status` and `run-state*` from primary help. | `status`, `task status`, `proof status`. |
| `task show`, `task status`, `task complete` | Make `task status` the canonical inspection surface; keep `task complete` read-only guide/non-primary. | `task status --view summary|full|guide` or registry-equivalent projection. |
| `task ready`, `harness validate`, `proof status`, `evidence lint` | Keep `task ready` primary; others diagnostic. | `task ready --level done`. |
| `evidence collect`, `evidence add-command` | Keep `add-command` primary for command-log evidence now; plan future `evidence add`. | `evidence add-command`, future `evidence add`. |
| `proof status`, `proof explain` | Prefer `proof status --explain`; keep `proof explain` alias if useful. | `proof status`. |
| `policy check-shell`, `policy preflight-shell`, `write preflight` | Consolidate around `policy preflight`. | `policy preflight`. |
| `package smoke`, `smoke clean-checkout`, `smoke run` | Consolidate family shape under `smoke`. | `smoke core`, `smoke package`, `smoke clean-checkout` as future/canonical naming. |
| `task upgrade-scaffold`, `protocol remediate` | Consolidate under remediation family. | `protocol remediate --fix task-scaffold`. |
| `release *` | Keep release commands separate but hidden from primary lifecycle. | `help release`. |
| `dev docker-check`, `run*`, `dashboard`, `tui`, `mcp`, `hermes`, `install` | Advanced/dev/UI/integration surfaces. | family-specific help only. |

Do not add runtime deprecation warnings until the audit is accepted and documented.

## Portfolio Audit Document

Create `docs/COMMAND_PORTFOLIO_AUDIT.md` with this structure:

```md
# COMMAND_PORTFOLIO_AUDIT

## Purpose

## Primary Lifecycle Commands

| Stage | Command ID | Role | Write Boundary | Why Primary |
|---|---|---|---|---|

## Diagnostic Commands

| Command ID | Looks Similar To | Diagnostic Role | Not Primary Because |
|---|---|---|---|

## Project/Release/Dev/UI/Integration Commands

| Family | Command IDs | Use Boundary | Hidden From Primary Lifecycle Because |
|---|---|---|---|

## Non-Overlap Decisions

| Decision | Commands | Rule | Evidence |
|---|---|---|---|

## Deprecation Candidates

| Command ID | Reason | Decision | Follow-up |
|---|---|---|---|
```

Do not add deprecation warnings unless the phase task makes an explicit accepted decision.

## Non-Overlap Rules to Encode

At minimum, document these rules:

| Rule | Required Text |
|---|---|
| `task status` | Report generation success is not readiness. Readiness lives in readiness/proof fields and `task ready`. |
| `task complete` | Read-only workflow compressor; it must not execute lifecycle steps. |
| `task finish` | May update only bounded task status bookkeeping unless future managed sections explicitly expand it. |
| `task ready` | Read-only readiness preflight; it does not append close proof. |
| `harness validate` | Diagnostic command; use when primary lifecycle reports blockers. |
| `task close` | Appends close evidence only; does not update Project State, Handoff, or broad docs. |
| `task audit-close` | Read-only verification after close. |
| `proof status/explain` | Diagnostic read models; they do not replace close/audit. |
| `ci gate` | Aggregated local/project gate; not a capsule lifecycle substitute. |
| `release *` | Release capsule/operator surfaces; never part of ordinary task lifecycle. |
| `dev docker-check` | HADARA-dev validation wrapper; external-subprocess boundary. |

## Help Output Changes

`hadara help lifecycle` text mode should show:

```text
Primary capsule lifecycle:
  1 discover  hadara task next --json
  2 create    hadara task create "..." --json
  3 inspect   hadara task status --task T-XXXX --json
  4 evidence  hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
  5 finish    hadara task finish --task T-XXXX --json
              hadara task finish --task T-XXXX --execute --json
  6 ready     hadara task ready --task T-XXXX --level done --json
  7 close     hadara task close --task T-XXXX --json
              hadara task close --task T-XXXX --execute --json
  8 audit     hadara task audit-close --task T-XXXX --json
  9 handoff   hadara handoff suggest --task T-XXXX --json

Diagnostics when blocked:
  evidence lint, proof status/explain, protocol doctor, harness validate, ci gate

Advanced:
  release/package, dev docker-check, dashboard/tui, integrations, run harness
```

## Optional Additive Metadata

If useful, add `lifecycleGuide` metadata to `task complete --json`, not to every command.

Example additive field:

```json
{
  "lifecycleGuide": {
    "currentStage": "ready",
    "primaryNextCommandId": "task.ready",
    "diagnosticCommandIds": ["harness.validate", "proof.explain"],
    "helpCommand": "hadara help lifecycle"
  }
}
```

Do not break existing `hadara.task.complete_flow.v1` consumers. If the schema cannot accept this additively, register a new schema id.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.2-1 | `docs/LIFECYCLE_GUIDE.md` exists and matches registry vocabulary. |
| AC-7.2-2 | `docs/COMMAND_PORTFOLIO_AUDIT.md` exists and documents non-overlap decisions. |
| AC-7.2-3 | `hadara help lifecycle --json` returns `hadara.lifecycle.guide.v1`. |
| AC-7.2-4 | Diagnostic commands are explicitly excluded from required primary lifecycle. |
| AC-7.2-5 | Release/dev/UI/integration commands are hidden from primary lifecycle help but discoverable through family help/commands JSON. |
| AC-7.2-6 | `TASK_WORKFLOW_COMMANDS.md`, help lifecycle, and registry lifecycle stages agree. |
| AC-7.2-7 | Tests cover at least five confusable command pairs. |
| AC-7.2-8 | `COMMAND_PORTFOLIO_AUDIT.md` records canonical, alias, diagnostic, advanced, dev-only, and release-only decisions. |
| AC-7.2-9 | Default help and lifecycle help exclude non-canonical compatibility aliases from the primary path. |

## Validation

```bash
npm run test:focused -- tests/unit/lifecycle-guide.test.ts tests/unit/command-portfolio-audit.test.ts tests/unit/help.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help lifecycle
node dist/cli/main.js help lifecycle --json
node dist/cli/main.js commands --requiredness primary --json
```


---

# Phase 7.3 — Document Registry and Docs Doctor

## Status

Planned implementation specification.

## Problem

HADARA projects mix several document types:

```text
protocol docs
project state docs
active specs
historical specs
release docs
handoff docs
task capsule docs
optional integration docs
superseded planning docs
```

Agents need to know which docs are canonical, active, reference-only, historical, superseded, or archived. Required Reading must not accidentally include stale plans.

## Goal

Introduce a project-owned document registry and docs doctor.

The registry classifies documents by owner, kind, status, scope, read-time, update owner, and managed sections.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Rewrite existing docs broadly | Phase 7.3 is classification/doctor first. |
| Move or archive files | Phase 7.5 plans cleanup; execute archive is out of scope by default. |
| Implement managed patching | Phase 7.4. |
| Replace Task Capsules | Task Capsules remain the unit of work/evidence. |
| Make all historical docs invalid | Historical docs are preserved but not default required reading. |

## Registry Location

Use project-owned reproducible state:

```text
.hadara/docs-registry.json
```

Human-readable projection:

```text
docs/DOC_REGISTRY.md
```

Rules:

| Rule | Requirement |
|---|---|
| Registry source of truth | `.hadara/docs-registry.json` is the machine-readable source of truth. |
| Human projection | `docs/DOC_REGISTRY.md` summarizes registry state and can be regenerated/planned later. |
| Existing projects | If registry is missing, `docs list/doctor` may infer a read-only provisional view but must report `DOC_REGISTRY_MISSING`. |
| Fresh init | `hadara init` must create a registry seeded from the selected profile. |
| Init upgrade | `hadara init upgrade --execute` may add missing registry entries without rewriting unrelated docs. |

## Registry Schema

Implement an equivalent TypeScript model:

```ts
export type DocumentStatus =
  | 'canonical'
  | 'active'
  | 'reference'
  | 'historical'
  | 'superseded'
  | 'archived';

export type DocumentKind =
  | 'protocol'
  | 'project-state'
  | 'handoff'
  | 'task-board'
  | 'workflow-guide'
  | 'architecture'
  | 'decision-log'
  | 'test-strategy'
  | 'security-model'
  | 'roadmap'
  | 'release'
  | 'spec'
  | 'implementation-guide'
  | 'integration-guide'
  | 'task-capsule'
  | 'schema-reference'
  | 'historical-plan'
  | 'unknown';

export type ReadWhen =
  | 'session-start'
  | 'task-start'
  | 'task-close'
  | 'release-work'
  | 'docs-work'
  | 'debugging'
  | 'integration-work'
  | 'only-when-linked'
  | 'never-default';

export interface ManagedSectionRef {
  id: string;
  owner: string;
  kind: string;
  required: boolean;
}

export interface DocumentRegistryEntry {
  path: string;
  title: string;
  owner: string;
  kind: DocumentKind;
  status: DocumentStatus;
  scope: 'project' | 'task' | 'release' | 'integration' | 'repo' | 'local';
  profiles: Array<'basic' | 'standard' | 'governed' | 'hadara-dev'>;
  readWhen: ReadWhen[];
  requiredReading: boolean;
  updateOwner: 'human' | 'hadara-init' | 'hadara-task' | 'hadara-docs' | 'release-operator' | 'mixed';
  updatedByCommands: string[];
  managedSections: ManagedSectionRef[];
  closeSourceRole: 'included' | 'excluded' | 'task-dependent' | 'unknown';
  supersedes: string[];
  supersededBy?: string;
  generatedBy?: string;
  notes?: string;
}

export interface DocumentRegistryFile {
  schemaVersion: 'hadara.docs.registry.v1';
  registryVersion: number;
  projectProfile?: 'basic' | 'standard' | 'governed' | 'hadara-dev';
  generatedAt?: string;
  documents: DocumentRegistryEntry[];
}
```

## Fresh Init Seeding

Integrate with existing init profiles.

Minimum profile seed:

| Path | basic | standard | governed | Kind | Status | Read When |
|---|---:|---:|---:|---|---|---|
| `AGENTS.md` | yes | yes | yes | protocol | canonical | session-start |
| `docs/IMPLEMENTATION_SOP.md` | yes | yes | yes | protocol | canonical | session-start |
| `docs/TASK_WORKFLOW_COMMANDS.md` | yes | yes | yes | workflow-guide | canonical | task-start |
| `docs/PROJECT_STATE.md` | yes | yes | yes | project-state | canonical | session-start |
| `docs/AGENT_HANDOFF.md` | yes | yes | yes | handoff | canonical | session-start |
| `docs/TASK_BOARD.md` | yes | yes | yes | task-board | active | task-start |
| `docs/ARCHITECTURE.md` | no | yes | yes | architecture | reference | only-when-linked |
| `docs/DEVELOPMENT_SLICES.md` | no | yes | yes | roadmap | active | task-start |
| `docs/DECISIONS.md` | no | yes | yes | decision-log | reference | only-when-linked |
| `docs/TEST_STRATEGY.md` | no | yes | yes | test-strategy | reference | debugging |
| `docs/SECURITY_MODEL.md` | no | no | yes | security-model | reference | only-when-linked |
| `docs/REFACTOR_LOG.md` | no | no | yes | historical-plan | historical | never-default |
| `docs/ROADMAP.md` | no | no | yes | roadmap | reference | only-when-linked |

Phase 7.3 may adjust exact profile coverage if current init profile definitions differ, but tests must lock the chosen seed.

## Commands

Add:

```bash
hadara docs list --json
hadara docs list --status canonical --json
hadara docs list --read-when session-start --json
hadara docs doctor --json
hadara docs doctor --scope registry|profile|required-reading|links|all --json
hadara docs explain --path docs/PROJECT_STATE.md --json
```

No `--execute` command is required in Phase 7.3 except existing `init upgrade` integration if needed.

## JSON Contract: `hadara.docs.list.v1`

```json
{
  "schemaVersion": "hadara.docs.list.v1",
  "command": "docs.list",
  "ok": true,
  "source": {
    "registryPath": ".hadara/docs-registry.json",
    "registryPresent": true,
    "inferred": false
  },
  "filters": {
    "status": "canonical",
    "readWhen": null
  },
  "documents": [
    {
      "path": "docs/PROJECT_STATE.md",
      "title": "PROJECT_STATE",
      "kind": "project-state",
      "status": "canonical",
      "readWhen": ["session-start"],
      "requiredReading": true,
      "updateOwner": "mixed",
      "managedSections": []
    }
  ],
  "issues": []
}
```

## JSON Contract: `hadara.docs.doctor.v1`

```json
{
  "schemaVersion": "hadara.docs.doctor.v1",
  "command": "docs.doctor",
  "ok": true,
  "scope": "all",
  "summary": {
    "registryPresent": true,
    "registeredDocuments": 12,
    "missingRegisteredDocuments": 0,
    "unregisteredActiveLookingDocuments": 0,
    "requiredReadingIssues": 0,
    "canonicalConflicts": 0
  },
  "issues": []
}
```

Issue codes:

| Code | Severity | Meaning |
|---|---|---|
| `DOC_REGISTRY_MISSING` | warning | Registry missing; report is inferred. |
| `DOC_REGISTERED_FILE_MISSING` | error | Registry references a missing file. |
| `DOC_UNREGISTERED_REQUIRED_READING` | warning | Required Reading references an unregistered doc. |
| `DOC_SUPERSEDED_REQUIRED_READING` | warning | Superseded doc appears in default Required Reading. |
| `DOC_CANONICAL_CONFLICT` | error | Multiple canonical docs claim the same kind/scope. |
| `DOC_UNKNOWN_STATUS` | error | Registry status enum invalid. |
| `DOC_UNREGISTERED_ACTIVE_LOOKING` | warning | Active-looking spec/plan not registered. |
| `DOC_INIT_PROFILE_DRIFT` | warning/error | Init profile generated docs and registry disagree. |

## JSON Contract: `hadara.docs.explain.v1`

```json
{
  "schemaVersion": "hadara.docs.explain.v1",
  "command": "docs.explain",
  "ok": true,
  "path": "docs/PROJECT_STATE.md",
  "document": {
    "kind": "project-state",
    "status": "canonical",
    "readWhen": ["session-start"],
    "requiredReading": true,
    "updateOwner": "mixed",
    "closeSourceRole": "included",
    "supersededBy": null
  },
  "guidance": {
    "shouldReadNow": true,
    "reason": "Canonical project-state document used at session start.",
    "safeToAutoUpdate": false,
    "managedSections": []
  },
  "issues": []
}
```

## Required Reading Integration

Phase 7.3 must not rewrite Required Reading tables broadly. It should:

```text
- read Required Reading from AGENTS.md / IMPLEMENTATION_SOP.md when available;
- compare it with registry status;
- report drift through docs doctor;
- let Phase 7.4/7.5 handle managed patching and cleanup.
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.3-1 | Fresh `hadara init --profile basic|standard|governed` creates `.hadara/docs-registry.json`. |
| AC-7.3-2 | Registry seed matches profile-generated docs. |
| AC-7.3-3 | `docs list`, `docs doctor`, and `docs explain` return schema-valid JSON. |
| AC-7.3-4 | Missing registry produces a warning, not a crash, for existing projects. |
| AC-7.3-5 | `docs doctor` detects missing registered files, unregistered required reading, canonical conflicts, and invalid statuses. |
| AC-7.3-6 | `init doctor` and docs doctor do not conflict; they either share helpers or have documented boundaries. |
| AC-7.3-7 | New schemas are registered. |

## Validation

```bash
npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/docs-doctor.test.ts tests/unit/init.test.ts
npm run build
npm test
npm run dev:docker-sync-build

rm -rf /tmp/hadara-docs-registry-smoke
mkdir -p /tmp/hadara-docs-registry-smoke
node dist/cli/main.js init --project /tmp/hadara-docs-registry-smoke --profile standard --json
node dist/cli/main.js docs list --project /tmp/hadara-docs-registry-smoke --json
node dist/cli/main.js docs doctor --project /tmp/hadara-docs-registry-smoke --json
node dist/cli/main.js docs explain --project /tmp/hadara-docs-registry-smoke --path docs/PROJECT_STATE.md --json
```


---

# Phase 7.4 — Managed Sections and Safe Patch Plans

## Status

Planned implementation specification.

## Problem

Agents repeatedly update Markdown state docs manually. Manual updates are easy to skip, and post-close edits can invalidate close proof hashes.

But broad automatic Markdown rewriting is dangerous because docs contain user-authored prose, rationale, decisions, and historical evidence.

Phase 7.4 creates a bounded mechanism: HADARA may patch declared managed sections only, with dry-run-first and before-hash guards.

## Goal

Define managed Markdown sections, patch plan reports, and hash-guarded apply behavior.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Rewrite whole Markdown files | Only managed sections or existing bounded write paths are allowed. |
| Auto-convert all legacy docs | Legacy docs without markers remain usable and should receive suggestions/warnings, not destructive rewrites. |
| Auto-update freeform architecture/decision prose | Human-authored rationale remains outside managed sections. |
| Change close-proof model | Close-source edits after close still invalidate previous close proof. |
| Move/delete docs | Phase 7.5 cleanup planning only. |

## Managed Section Marker Format

Use HTML comments:

```md
<!-- hadara:managed:start task-board {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"replace","version":1} -->
| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0001 | Example | Draft | tasks/T-0001-example |  |
<!-- hadara:managed:end task-board -->
```

Rules:

| Rule | Requirement |
|---|---|
| Start/end required | A managed section is valid only if both markers exist and ids match. |
| JSON metadata required | Start marker must contain valid JSON metadata. |
| Unique per file | Duplicate section ids in one file are an error. |
| No nesting | Nested managed sections are invalid. |
| Preserve surrounding prose | Patch applies only between markers unless the section owner explicitly owns markers. |
| Hash guarded | Apply must verify target file before-hash and section before-hash. |

## Managed Section Metadata

```ts
export interface ManagedSectionMetadata {
  schema: 'hadara.managedSection.v1';
  owner: string;                 // e.g. 'task.finish', 'docs.registry', 'handoff.update'
  kind: 'markdown-table' | 'key-value-table' | 'markdown-list' | 'single-block' | 'json-code-block';
  mode: 'replace' | 'insert-row' | 'update-row' | 'append-block';
  version: number;
  required?: boolean;
  closeSourceRole?: 'included' | 'excluded' | 'task-dependent';
}
```

## Initial Managed Section Targets

Phase 7.4 must implement the complete initial managed-section target set, not a reduced target.

The project has already accumulated repeated close-source and status-document churn. Shrinking the initial target to only one or two files would likely create another refactor phase immediately after Phase 7.4. Therefore, Phase 7.4 should implement the full first useful set while still preserving strict write boundaries.

| File | Section ID | Owner | Patch Mode | Notes |
|---|---|---|---|---|
| `docs/TASK_BOARD.md` | `task-board` | `task.finish` / `task.create` | update-row | Existing bounded behavior can bridge to managed marker. |
| `tasks/T-XXXX/TASK.md` | `task-status-history` | `task.finish` | append-block/update-row | Only status/history block, not whole task prose. |
| `tasks/T-XXXX/HANDOFF.md` | `task-handoff-current-state` | `handoff.update` / `handoff.suggest` | replace/update-row | Task-local handoff current-state table only; not freeform handoff prose. |
| `docs/AGENT_HANDOFF.md` | `current-state` | `handoff.update` | replace/update-row | Prefer suggestion first; execute must be explicit. |
| `docs/PROJECT_STATE.md` | `project-state-metadata` | `project-state.update` or controlled patch planner | update-row | Metadata/latest/active state only; not full project history prose. |
| `docs/IMPLEMENTATION_SOP.md` | `required-reading` | `init.register-doc` / `docs.cleanup` | insert-row/update-row | Do not auto-prune until Phase 7.5. |
| `docs/DOC_REGISTRY.md` | `doc-registry-summary` | `docs.registry` | replace | Projection from `.hadara/docs-registry.json`. |

Do not mark broad `ARCHITECTURE.md`, `DECISIONS.md`, `SECURITY_MODEL.md`, release notes prose, project-specific specs, or freeform rationale as managed in Phase 7.4 unless the section is clearly tabular/generated and explicitly owned.

Full target does not mean broad rewrite. It means all first-class status/handoff/registry managed sections are included with narrow section ownership.

## Patch Plan Type

```ts
export interface ManagedPatchPlanReport {
  schemaVersion: 'hadara.docs.patchPlan.v1';
  command: string;
  mode: 'dry-run';
  ok: boolean;
  targetPath: string;
  targetBeforeHash: string;
  sections: ManagedSectionPatch[];
  executeCommand?: string;
  issues: ManagedPatchIssue[];
}

export interface ManagedSectionPatch {
  sectionId: string;
  owner: string;
  kind: string;
  operation: 'replace' | 'insert-row' | 'update-row' | 'append-block' | 'noop';
  sectionBeforeHash: string;
  sectionAfterHash: string;
  changed: boolean;
  preview: {
    beforeExcerpt?: string;
    afterExcerpt?: string;
    diffSummary: string;
  };
}

export interface ManagedPatchIssue {
  severity: 'info' | 'warning' | 'error';
  code: string;
  path?: string;
  sectionId?: string;
  message: string;
}
```

Issue codes:

| Code | Meaning |
|---|---|
| `MANAGED_SECTION_MISSING` | Requested section marker absent. |
| `MANAGED_SECTION_DUPLICATE` | Duplicate section id in one file. |
| `MANAGED_SECTION_NESTED` | Nested markers detected. |
| `MANAGED_SECTION_INVALID_METADATA` | Start marker JSON invalid or schema mismatch. |
| `MANAGED_PATCH_OUTSIDE_BOUNDARY` | Patch would change text outside managed region. |
| `MANAGED_PATCH_BEFORE_HASH_REQUIRED` | Execute requested without hash. |
| `MANAGED_PATCH_BEFORE_HASH_MISMATCH` | Target file changed since reviewed dry-run. |
| `MANAGED_PATCH_SECTION_HASH_MISMATCH` | Managed section changed since plan. |
| `MANAGED_PATCH_UNSUPPORTED_OWNER` | Command attempted to patch a section it does not own. |

## CLI Surfaces

Read-only inspection:

```bash
hadara docs managed list --json
hadara docs managed explain --path docs/TASK_BOARD.md --json
```

Patch service:

```bash
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --execute --before-hash sha256:... --json
```

Rules for `docs patch`:

| Rule | Requirement |
|---|---|
| Dry-run default | No write unless `--execute`. |
| Content file confined | `--content-file` must be inside project root or HADARA local state and must not be private evidence. |
| Managed body only | Content file supplies replacement body only, not arbitrary full file. |
| Owner respected | Generic manual patch owner should be `operator`; command-owned patches must use their command id. |
| Before hash required | Execute requires target file hash from dry-run. |
| No marker removal | Patch must not remove start/end markers. |

## Integration With Existing Commands

Phase 7.4 must not break current bounded writes.

| Command | Phase 7.4 Behavior |
|---|---|
| `task finish --json` | Include managed patch metadata for `TASK.md`/`TASK_BOARD.md` when markers exist. Legacy bounded behavior still works. |
| `task finish --execute` | May use managed section engine internally for marked files; must not broaden write boundary. |
| `handoff suggest --json` | May include patch plan fragments for `AGENT_HANDOFF.md`, but remains read-only. |
| `handoff update --execute` or current write path | If section markers exist, use managed section apply; if absent, preserve existing behavior or fail with explicit issue depending on current command contract. |
| `init register-doc` | May use managed required-reading section when present. |

## Legacy Compatibility

For existing docs without markers:

```text
- read commands must still work;
- doctor should report unmanaged sections as warnings only;
- existing bounded command writes may continue;
- no command should insert markers into many legacy docs without an explicit dry-run plan.
```

Optional marker bootstrap command may be added only if dry-run-first:

```bash
hadara docs managed bootstrap --path docs/TASK_BOARD.md --json
hadara docs managed bootstrap --path docs/TASK_BOARD.md --execute --before-hash sha256:... --json
```

If implemented, bootstrap must be limited to known generated/table docs.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.4-1 | Managed section parser handles valid markers, missing markers, duplicate ids, nesting, and invalid metadata. |
| AC-7.4-2 | Patch plans prove no changes occur outside managed markers. |
| AC-7.4-3 | `docs patch` dry-run returns `hadara.docs.patchPlan.v1`. |
| AC-7.4-4 | `docs patch --execute` requires matching `--before-hash`. |
| AC-7.4-5 | Hash mismatch fails closed with no write. |
| AC-7.4-6 | Existing task finish behavior remains compatible on legacy docs. |
| AC-7.4-7 | Fresh init docs include markers only for safe generated sections. |
| AC-7.4-8 | No broad prose docs are automatically rewritten. |

## Validation

```bash
npm run test:focused -- tests/unit/managed-sections.test.ts tests/unit/docs-patch.test.ts tests/unit/task-finish.test.ts tests/unit/handoff.test.ts tests/unit/init.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js docs managed list --json
node dist/cli/main.js docs managed explain --path docs/TASK_BOARD.md --json
node dist/cli/main.js docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json
```


---

# Phase 7.5 — Docs Cleanup Operations

## Status

Planned implementation specification.

## Problem

Once documents are registered and classified, HADARA needs a safe way to mark old plans/specs as historical or superseded so agents do not treat them as current instructions.

Cleanup must not delete evidence or erase history.

## Goal

Add dry-run-first document status operations that update the document registry and default reading guidance.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Delete documents | Deletion is not part of Phase 7.5. |
| Move files by default | Archive moves can break links and evidence references. |
| Rewrite historical docs | Status lives in registry; historical files are preserved. |
| Auto-prune Required Reading without managed support | Required Reading edits must use Phase 7.4 managed sections or remain suggestions. |
| Mark docs superseded without target | Superseded docs need a replacement target. |

## Status Transitions

Allowed transitions:

| From | To | Requirement |
|---|---|---|
| active | reference | No replacement required. |
| active | historical | Reason required. |
| active | superseded | `--by <path>` required. |
| reference | historical | Reason required. |
| reference | superseded | `--by <path>` required. |
| historical | archived | Dry-run only in Phase 7.5. |
| superseded | archived | Dry-run only in Phase 7.5. |

Disallowed by default:

| From | To | Reason |
|---|---|---|
| archived | canonical | Requires restoration capsule. |
| superseded | canonical | Requires review. |
| historical | active | Requires review. |
| any | deleted | Deletion not supported. |
| canonical | superseded | Requires `--force-canonical` or explicit task decision. |

## Commands

```bash
hadara docs mark --path <path> --status reference --reason <text> --json
hadara docs mark --path <path> --status historical --reason <text> --json
hadara docs mark --path <path> --status superseded --by <path> --reason <text> --json
hadara docs mark --path <path> --status superseded --by <path> --reason <text> --execute --before-hash sha256:... --json

hadara docs archive --status superseded --json
hadara docs archive --status historical --json

hadara docs required-reading --json
```

Phase 7.5 should not implement `docs archive --execute` unless the task makes an explicit decision with link-safety tests. Prefer dry-run-only archive plans.

## `docs mark` Behavior

Dry-run report:

```json
{
  "schemaVersion": "hadara.docs.mark.v1",
  "command": "docs.mark",
  "mode": "dry-run",
  "ok": true,
  "path": "docs/specs/old-plan.md",
  "beforeStatus": "active",
  "afterStatus": "superseded",
  "supersededBy": "docs/specs/new-plan.md",
  "reason": "Replaced by Phase 7 surface-refactor spec.",
  "registryPath": ".hadara/docs-registry.json",
  "beforeHash": "sha256:...",
  "impact": {
    "registryPatchPlanned": true,
    "defaultRequiredReading": "remove-after-execute",
    "managedRequiredReadingPatchAvailable": false,
    "archiveCandidate": true
  },
  "issues": []
}
```

Execute mode:

```text
- requires --before-hash matching the registry file hash;
- updates only `.hadara/docs-registry.json`;
- does not edit the target doc body;
- does not move files;
- may emit a managed patch suggestion for Required Reading if Phase 7.4 markers exist.
```

## `docs archive` Behavior

Dry-run report:

```json
{
  "schemaVersion": "hadara.docs.archivePlan.v1",
  "command": "docs.archive",
  "mode": "dry-run",
  "ok": true,
  "filters": { "status": "superseded" },
  "candidates": [
    {
      "path": "docs/specs/old-plan.md",
      "currentStatus": "superseded",
      "suggestedArchivePath": "docs/archive/specs/old-plan.md",
      "referencedByActiveDocs": [],
      "referencedByTaskEvidence": ["tasks/T-0001/EVIDENCE.md"],
      "risk": "evidence-link-reference",
      "executeSupported": false
    }
  ],
  "issues": []
}
```

If future work allows execute, it must fail when active/canonical docs or task evidence reference the file.

## Required Reading Rules

Statuses excluded from default Required Reading:

```text
historical
superseded
archived
```

`docs required-reading --json` returns effective default reading:

```json
{
  "schemaVersion": "hadara.docs.requiredReading.v1",
  "command": "docs.required-reading",
  "ok": true,
  "documents": [
    {
      "path": "docs/IMPLEMENTATION_SOP.md",
      "status": "canonical",
      "readWhen": ["session-start"],
      "reason": "canonical protocol doc"
    }
  ],
  "excluded": [
    {
      "path": "docs/specs/old-plan.md",
      "status": "superseded",
      "reason": "superseded docs are not default required reading"
    }
  ],
  "issues": []
}
```

If this schema is implemented, register it as `hadara.docs.requiredReading.v1`.

## Docs Doctor Additions

Add warnings/errors:

| Code | Meaning |
|---|---|
| `DOC_SUPERSEDED_REQUIRED_READING` | Superseded doc appears in Required Reading. |
| `DOC_HISTORICAL_REQUIRED_READING` | Historical doc appears in Required Reading. |
| `DOC_SUPERSEDES_MISSING_TARGET` | Superseded doc points to missing replacement. |
| `DOC_ARCHIVE_CANDIDATE` | Superseded/historical doc can be considered for archive planning. |
| `DOC_CLEANUP_INVALID_TRANSITION` | Requested status transition is not allowed. |
| `DOC_CLEANUP_CANONICAL_REVIEW_REQUIRED` | Attempt to supersede canonical doc without explicit review flag. |

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.5-1 | `docs mark` dry-run validates allowed transitions and reports impact. |
| AC-7.5-2 | `docs mark --execute` requires matching registry before-hash. |
| AC-7.5-3 | Execute updates only `.hadara/docs-registry.json` unless a separate managed patch command is explicitly run. |
| AC-7.5-4 | Superseded/historical/archived docs are excluded from effective default required reading. |
| AC-7.5-5 | `docs archive` is dry-run by default and does not move files. |
| AC-7.5-6 | `docs doctor` detects stale docs in Required Reading and missing supersededBy targets. |
| AC-7.5-7 | Tests cover invalid transitions, stale hash, canonical review guard, and missing replacement target. |

## Validation

```bash
npm run test:focused -- tests/unit/docs-mark.test.ts tests/unit/docs-archive.test.ts tests/unit/docs-required-reading.test.ts tests/unit/docs-doctor.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js docs mark --path docs/specs/old-plan.md --status superseded --by docs/specs/new-plan.md --reason "Replaced" --json
node dist/cli/main.js docs archive --status superseded --json
node dist/cli/main.js docs required-reading --json
node dist/cli/main.js docs doctor --json
```


---

# Phase 7.6 — 0.3.0 Release Hardening and Installed-Package Recycle

## Status

Planned release-hardening specification.

## Goal

Prepare the next HADARA external release only after all Phase 7.0 through Phase 7.5 work is complete, validated, documented, and validated through an installed-package path.

Phase 7.6 is the first phase where a new external release artifact may be considered.

This phase is not a repeat of the earlier comparative with/without evaluation. It is release validation through installed-package recycle, fresh-init workflow validation, and package/release readiness checks for the completed Phase 7 surface.

## Required Completed Inputs

| Phase | Required Output |
|---|---|
| 7.0 | Specs staged and current repo release/docs state reconciled. |
| 7.1 | Command registry and structured help. |
| 7.2 | Lifecycle guide and command portfolio audit. |
| 7.3 | Document registry and docs doctor. |
| 7.4 | Managed sections and safe patch plans. |
| 7.5 | Docs mark/archive dry-run cleanup operations. |

If any required phase is incomplete, Phase 7.6 must stop and report the missing input. Do not hide incomplete scope under release hardening.

## Release Theme

```text
HADARA 0.3.0 turns the existing task/evidence/proof workflow into a coherent agent operating surface.
```

0.3.0 is not:

```text
a full agent runtime,
a Rack/enterprise release,
a Dashboard/TUI redesign,
a broad document rewrite engine,
a historical document deletion release,
or a release automation expansion.
```

## Release Validation Matrix

| Validation | Required | Notes |
|---|---:|---|
| Full TypeScript build | yes | `npm run build`. |
| Full test suite | yes | `npm test` after build. |
| Docker baseline | yes | `npm run dev:docker-sync-build`. |
| Package smoke | yes | Packed artifact installed in disposable workspace. |
| Clean-checkout smoke | yes | Fresh checkout installs/builds/checks. |
| Fresh init basic/standard/governed | yes | Verify docs registry, managed markers, and help guidance. |
| Structured help smoke | yes | `hadara`, `hadara help lifecycle`, `hadara commands --json`. |
| Lifecycle guide smoke | yes | Primary path and diagnostics render correctly. |
| Docs registry smoke | yes | `docs list/doctor/explain/required-reading`. |
| Managed patch smoke | yes | Dry-run and execute hash-guarded patch on disposable project. |
| Docs cleanup smoke | yes | `docs mark` dry-run/execute on disposable registry, archive dry-run. |
| Installed package recycle | yes | Use packed or published package, not repo source path. |
| External installed-package recycle | yes | Fresh small project using only public installed CLI. |
| Release dry-run | yes | No blockers. |
| Publish dry-run | yes | No mutation. |

## Installed Package Recycle

Use a disposable workspace. Verify at least:

```bash
hadara version --json
hadara help
hadara help lifecycle
hadara help command task.close
hadara commands --json
hadara commands --family capsule-lifecycle --json

hadara init --profile standard --json
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path docs/PROJECT_STATE.md --json
hadara docs required-reading --json

hadara task create "recycle task" --json
hadara task status --task T-0001 --json
hadara evidence add-command --task T-0001 --summary "Recycle validation passed." --result passed --json
hadara task finish --task T-0001 --json
hadara task ready --task T-0001 --level done --json
hadara proof status --task T-0001 --json
hadara ci gate --mode advisory --task T-0001 --json
```

If the installed package path does not include source tests, do not substitute repo-local commands for installed CLI smokes.

## Fresh Init Installed-Package Recycle Scenario

Run this scenario for at least one `standard` project and smoke basic/governed profile creation:

```text
1. Initialize a fresh standard project.
2. Read only structured help and effective Required Reading.
3. Create one task.
4. Make a trivial project-local change or validation placeholder.
5. Record evidence.
6. Finish, ready, close, and audit where feasible.
7. Use docs registry to explain what was read.
8. Use docs doctor to confirm no required-reading drift.
9. Use managed patch dry-run and one safe execute in a disposable managed section.
10. Use docs mark dry-run/execute on a disposable non-canonical doc entry.
```

Evaluation questions:

| Question | Expected Signal |
|---|---|
| Did the agent know the primary lifecycle without reading every CLI command? | yes |
| Did diagnostics stay optional? | yes |
| Did release/dev/UI/integration commands stay out of the primary path? | yes |
| Did document registry identify canonical docs? | yes |
| Did docs doctor catch intentionally introduced drift? | yes |
| Did managed patches avoid freeform prose? | yes |
| Did docs cleanup avoid moving/deleting history? | yes |

## Release Notes Required Content

`docs/RELEASE_NOTES.md` must include implemented 0.3.0 highlights only after Phase 7.6 validation:

```text
- structured command help and command registry
- canonical capsule lifecycle guidance
- command portfolio audit and non-overlap rules
- document registry and docs doctor
- managed Markdown section patch plans
- docs cleanup status marking and required-reading pruning
- installed package recycle and installed-package recycle results
```

Boundaries:

```text
- not a full agent runtime
- not Rack/enterprise
- not automatic broad doc rewriting
- not automatic historical deletion
- release/publish mutation remains operator-approved
```

## README Required Content

By Phase 7.6, README should be reshaped around the primary surface:

```md
# HADARA

## Release Status
## Install
## What HADARA Gives You
## Start Here
## Primary Capsule Lifecycle
## Proof and Diagnostics
## Document Governance
## Managed Markdown Safety
## Release and Advanced Surfaces
## Safety Boundaries
## Development / Contributing
```

README must not dump the full command inventory near the top. It should point to:

```bash
hadara help
hadara help lifecycle
hadara commands --json
```

## Versioning and Publish Boundary

Phase 7.6 may prepare one integrated external release candidate or stable release according to operator decision.

Rules:

| Rule | Requirement |
|---|---|
| No per-phase publish | Phase 7.1-7.5 do not publish. |
| Version consistency | `package.json`, `package-lock.json`, README, release notes, and release artifacts agree. |
| Publish mutation | Requires explicit operator approval and existing HADARA release discipline. |
| Registry verification | After publish, verify package version through registry query and attach reduced evidence. |
| GitHub Release/Docker/PyPI | Optional/separate unless explicitly in scope. |

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.6-1 | All Phase 7.0-7.5 acceptance criteria are complete and evidenced. |
| AC-7.6-2 | Full build, full test suite, and Docker baseline pass. |
| AC-7.6-3 | Package smoke and clean-checkout smoke pass. |
| AC-7.6-4 | Installed package recycle passes using installed CLI, not source-only commands. |
| AC-7.6-5 | Fresh init basic/standard/governed include expected command/docs registry surfaces. |
| AC-7.6-6 | Structured help and lifecycle help reduce command-selection ambiguity in installed-package recycle. |
| AC-7.6-7 | Docs registry prevents stale/historical/superseded docs from default Required Reading. |
| AC-7.6-8 | Managed patch plans are hash-guarded and do not overwrite freeform prose. |
| AC-7.6-9 | Docs cleanup marks status without deleting or moving historical files by default. |
| AC-7.6-10 | README and release notes describe implemented behavior only. |
| AC-7.6-11 | Release dry-run and publish dry-run pass with no unintended mutation. |
| AC-7.6-12 | No publish mutation occurs without explicit operator approval. |

## Validation

```bash
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help
node dist/cli/main.js help lifecycle
node dist/cli/main.js commands --json
node dist/cli/main.js docs doctor --json
node dist/cli/main.js docs required-reading --json

node dist/cli/main.js package smoke --execute --task T-XXXX --attach-evidence --json
node dist/cli/main.js smoke clean-checkout --execute --task T-XXXX --attach-evidence --json
node dist/cli/main.js release gate --mode strict --json
node dist/cli/main.js release dry-run --json
node dist/cli/main.js release publish --mode dry-run --json
```

## Definition of Done

0.3.0 is ready only when a fresh agent can run:

```bash
hadara help lifecycle
```

and correctly understand:

```text
what to do first,
what is required,
what is diagnostic,
what is advanced,
which docs to read,
which docs are historical/superseded,
and what HADARA can safely update.
```


---

# Phase 7 Spec Authoring Rules

## Purpose

Phase 7 specs must give implementers a concrete frame, not vague feature requests.

Every Phase 7 spec should answer:

```text
What files change?
What types are expected?
What CLI commands exist?
What JSON schemas are introduced?
What behavior is explicitly allowed/disallowed?
What tests prove the behavior?
What acceptance criteria close the task?
```

## Required Sections for New Phase 7 Specs

Use this structure:

```md
# Phase 7.x — Name

## Status
## Problem
## Goal
## Non-Goals
## Existing Surface Integration
## Files to Add or Change
## Type / Schema Model
## CLI Behavior
## JSON Contracts
## Safety and Boundary Rules
## Tests
## Documentation Updates
## Acceptance Criteria
## Validation
```

## Required Specificity

Avoid vague language:

```text
Bad: Implement a docs registry.
Good: Add `.hadara/docs-registry.json` with `schemaVersion: hadara.docs.registry.v1`, implement `docs list/doctor/explain`, seed it from init profiles, and test missing registry/missing file/canonical conflict cases.
```

```text
Bad: Improve help.
Good: Replace default flat help with registry-backed lifecycle help; add `hadara commands --json`; assert every public dispatchable command has one registry entry.
```

## Schema Rule

Every new public JSON report needs:

```text
- schema fixture under src/schemas/
- schema-index entry
- docs/SCHEMAS.md update
- focused contract test
- CLI smoke evidence
```

## Write Boundary Rule

Every write-capable command must state:

```text
- default mode: dry-run or execute
- exact files it may write
- whether before-hash is required
- what happens on hash mismatch
- whether it can touch user-authored prose
- whether it can run external subprocesses
```

## Documentation Honesty Rule

Docs must distinguish:

```text
planned
implemented
published
operator-approved
```

Do not describe planned commands as available.
Do not describe source candidates as published unless publish evidence exists.
Do not imply Phase 7.x labels are npm prerelease labels.


---

# README Update Instructions for Phase 7 / HADARA 0.3.0

## Purpose

This guide tells workers how to update `README.md` without claiming unimplemented behavior.

## Main Rule

README must describe what is implemented now and what is planned separately.

Do not advertise Phase 7.1+ commands as available until their implementation task closes valid.

## Immediate Phase 7.0 README Note

Add under Release Status or near it:

```md
### Planned 0.3.0 Direction

The planned 0.3.0 line is Phase 7 Surface Refactor. It organizes HADARA's existing task, evidence, proof, lifecycle, release, and document surfaces so agents can distinguish primary lifecycle commands, diagnostics, advanced surfaces, canonical documents, historical documents, and safe Markdown update boundaries.

Phase 7.x labels are internal implementation phases, not npm release-candidate labels. A new external release should be prepared only after all required Phase 7.x work passes Phase 7.6 hardening and installed-package validation.
```

Before Phase 7.1, do not say `hadara help lifecycle` exists.
Before Phase 7.3, do not say `hadara docs list` exists.
Before Phase 7.4, do not say managed patches exist.

## Target README Structure by Phase 7.6

```md
# HADARA

## Release Status
## Install
## What HADARA Gives You
## Start Here
## Primary Capsule Lifecycle
## Proof and Diagnostics
## Document Governance
## Managed Markdown Safety
## Release and Advanced Surfaces
## Safety Boundaries
## Development / Contributing
```

## Section Rules

### Start Here

After Phase 7.1:

```bash
hadara help
hadara help lifecycle
hadara task next --json
```

### Primary Capsule Lifecycle

After Phase 7.2:

```bash
hadara task next --json
hadara task create "implement a focused change" --json
hadara task status --task T-0001 --json
hadara evidence add-command --task T-0001 --summary "Focused validation passed." --result passed --json
hadara task finish --task T-0001 --json
hadara task finish --task T-0001 --execute --json
hadara task ready --task T-0001 --level done --json
hadara task close --task T-0001 --json
hadara task close --task T-0001 --execute --json
hadara task audit-close --task T-0001 --json
hadara handoff suggest --task T-0001 --json
```

### Proof and Diagnostics

Current diagnostic commands may be documented, but do not present them as required lifecycle steps:

```bash
hadara evidence lint --task T-0001 --json
hadara proof status --task T-0001 --json
hadara proof explain --task T-0001 --json
hadara ci gate --mode advisory --task T-0001 --json
hadara ci gate --mode strict --task T-0001 --json
```

### Document Governance

After Phase 7.3:

```bash
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path docs/PROJECT_STATE.md --json
hadara docs required-reading --json
```

If `docs required-reading` is implemented in Phase 7.5, introduce it there rather than Phase 7.3.

### Managed Markdown Safety

After Phase 7.4:

```md
HADARA can update declared managed sections only. Managed patch execution is dry-run-first and hash-guarded. User-authored prose remains outside automated writes.
```

### Release and Advanced Surfaces

Do not show release/package/dashboard/tui/mcp/run commands inside the primary lifecycle. Place them under advanced or release-only surfaces.

## Anti-Patterns

Do not:

```text
- dump the entire CLI command list near the top;
- present release commands as ordinary lifecycle commands;
- present diagnostics as required steps;
- claim planned commands exist early;
- imply old docs are auto-deleted;
- imply HADARA is a full agent runtime;
- imply Rack/enterprise behavior is part of 0.3.0.
```

## Validation

README-only:

```bash
git diff --check README.md
```

README tied to help changes:

```bash
npm run test:focused -- tests/unit/help.test.ts tests/unit/command-registry.test.ts
npm run build
npm test
```


---

# Worker Agent Instructions for Phase 7 Surface Refactor

## Purpose

This guide tells the worker agent how to stage and implement the rewritten Phase 7 specs.

## Operating Rule

Phase 7.x labels are internal implementation phases. They are not external npm RC labels.

Do not publish after an individual Phase 7.x task. The next external release is considered only during Phase 7.6.

## Initial Task: Phase 7.0

Suggested title:

```bash
hadara task create "Stage Phase 7 surface refactor specs" --json
```

Scope:

```text
- Add docs/specs/0.3.0/ Phase 7 files.
- Reconcile current release-state docs.
- Update README with planned 0.3.0 direction only.
- Update Project State, Agent Handoff, Development Slices, and optional Decisions.
- Do not change runtime behavior.
```

## Required Reading for Phase 7.0

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
docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
docs/specs/0.3.0/01_Phase_7_0_Repo_State_Reconciliation_and_Planning_Staging.md
```

## Required Reading for Phase 7.1

```text
docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md
docs/TASK_WORKFLOW_COMMANDS.md
src/cli/main.ts
src/services/capability-registry.ts
src/services/tools-list.ts
docs/SCHEMAS.md
src/schemas/schema-index.json
```

## Task Capsule Discipline

For each Phase 7.x implementation task:

```text
- Create or select a Task Capsule.
- Record phase-specific scope in TASK.md.
- Keep changes narrow to that phase.
- Record focused test evidence.
- Run broader validation as required by the spec.
- Finish, ready, close, and audit through current HADARA lifecycle.
```

## Do Not

```text
- Do not implement future phases early without documenting cross-phase dependency.
- Do not use rc4-rc9 naming in new docs.
- Do not create a command registry that duplicates capability-registry without projection tests.
- Do not mark docs superseded before document registry exists.
- Do not rewrite broad Markdown prose automatically.
- Do not archive/delete historical docs in Phase 7.0-7.5.
- Do not publish without Phase 7.6 release hardening and operator approval.
```

## Evidence Expectations

Minimum per implementation phase:

```bash
git diff --check
npm run test:focused -- <phase tests>
npm run build
npm test
```

Docker baseline is required unless unavailable:

```bash
npm run dev:docker-sync-build
```

If Docker is unavailable, record fallback path and residual risk.

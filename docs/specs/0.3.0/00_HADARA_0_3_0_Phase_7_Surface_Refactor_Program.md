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
| Post-7.6 rc.1 adoption | Protocol Migration for 0.3 Adoption | Existing HADARA projects and selected Task Capsules can dry-run-first migrate onto 0.3 command/docs/managed-section surfaces before a later rc.1 final readiness capsule. |

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
  -> rc.1 adoption migration before later final readiness/publish
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

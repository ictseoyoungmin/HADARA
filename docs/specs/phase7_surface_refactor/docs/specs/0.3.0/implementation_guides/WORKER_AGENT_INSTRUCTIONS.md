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

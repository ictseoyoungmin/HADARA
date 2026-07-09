# T-0547 0.4.2 stable installed package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0547 |
| Title | 0.4.2 stable installed package recycle |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify stable `hadara@0.4.2` from installed consumer paths. | Use package recycle to install `hadara@latest`, confirm it resolves to `0.4.2`, and exercise the installed CLI workflow without publishing or changing source metadata. |

## Scope

| Boundary | Items |
|---|---|
| In | Registry metadata check, isolated installed package recycle for `hadara@latest` expected `0.4.2`, installed CLI smoke surfaces, evidence attachment, shared release-state updates. |
| Out | npm publish, GitHub Release mutation, source package version changes, source code changes, broad toy MVP dogfood beyond recycle smokes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the installed-package recycle contract. | Done |
| 2 | Run dry-run and execute recycle for `hadara@latest` expected `0.4.2`. | Done |
| 3 | Update release state docs and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Registry metadata resolves `hadara@latest` to `0.4.2` while preserving `next=0.4.2-rc.0`. | Met | `ev:T-0547:bb537cb84fd6482192255ecf` | npm registry |
| AC-2 | Installed package recycle executes in isolated consumer paths and verifies installed `packageVersion=0.4.2`. | Met | `ev:T-0547:bb537cb84fd6482192255ecf` | `hadara package recycle` |
| AC-3 | Installed CLI smoke surfaces pass through the recycle helper, including init, task status, session/finalize, context pack, context slice, and cleanup. | Met | `ev:T-0547:bb537cb84fd6482192255ecf` | recycle report |
| AC-4 | Release state docs record stable `0.4.2` installed-package recycle as complete and route next work away from release publish/recycle. | Met | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| package recycle dry-run | Yes | Passed | `ev:T-0547:8eb1722fe60f435e991924f9` |
| package recycle execute | Yes | Passed | `ev:T-0547:bb537cb84fd6482192255ecf` |
| git diff hygiene | Yes | Passed | `ev:T-0547:44a840e0a5df4e0ab2d4c704` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0546 post-publish evidence sync | reference | active | Confirms npm/GitHub publication is complete before installed recycle. |
| `docs/RELEASE_READINESS.md` | reference | active | Defines the standard post-publish recycle command and current `0.4.2` release state. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Finalize and evidence-write semantics for this capsule. |

## Changes

| Area | Summary |
|---|---|
| Release verification | Completed installed-package recycle for `hadara@latest` expected `0.4.2`. |
| Shared state docs | Updated release readiness, project state, and agent handoff to mark stable `0.4.2` recycle complete. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | No release-line blocker remains for stable `0.4.2`; next work can return to ordinary backlog or explicitly selected command portfolio reductions. | Closed | `docs/AGENT_HANDOFF.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Installed-package recycle contract authored. |
| 2026-07-09 | In Progress | Dry-run passed; sandbox execute failed on npm registry metadata lookup and was resolved by approved network execute. |
| 2026-07-09 | In Progress | Shared release state docs updated for stable `0.4.2` recycle completion. |

# T-0538 0.4.2 rc0 pre-release dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0538 |
| Title | 0.4.2 rc0 pre-release dogfood |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the current development `dist` before `0.4.2-rc.0` readiness. | Use a fresh `/tmp` project to validate init, generated docs, task lifecycle, status/session-start behavior, removed command boundaries, and release-candidate friction. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh `/tmp` project dogfood using `node dist/cli/main.js`, generated scaffold review, task create/status/session-start/context-pack/validation/finalize flow, removed-command spot checks, dogfood report. |
| Out | Changing product code, bumping package version, release artifact creation, npm/GitHub publish, installed npm-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define dogfood contract and planned command matrix. | Done |
| 2 | Refresh or verify development `dist`, then initialize a fresh `/tmp` governed project. | Done |
| 3 | Exercise current lifecycle and representative read/diagnostic surfaces. | Done |
| 4 | Review generated Markdown for stale removed-command or HADARA-dev-only guidance. | Done |
| 5 | Record `DOGFOOD_REPORT.md`, evidence, and release-readiness recommendation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh project initializes and generated docs do not route new users to removed lifecycle commands. | Done | `ev:T-0538:2c1048d705db4f6fbbb873ff` | `DOGFOOD_REPORT.md` |
| AC-2 | A toy task can be created, validated, and closed through current `task status` / `validation run` / `task finalize --execute --auto` surfaces. | Done | `ev:T-0538:2c1048d705db4f6fbbb873ff` | `DOGFOOD_REPORT.md` |
| AC-3 | Current removed/retired commands are absent or fail through ordinary unknown/default-help behavior, not misleading lifecycle guidance. | Done | `ev:T-0538:2c1048d705db4f6fbbb873ff` | `DOGFOOD_REPORT.md` |
| AC-4 | `0.4.2-rc.0` readiness recommendation is documented with blockers, residual risks, and positives. | Done | `ev:T-0538:2c1048d705db4f6fbbb873ff` | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded for dogfood execution and report review. | Done | `ev:T-0538:2c1048d705db4f6fbbb873ff` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run dev:docker-sync-build -- --smoke-command "version --json"` | Yes | Passed | `ev:T-0538:2c1048d705db4f6fbbb873ff` |
| Fresh `/tmp` governed project dogfood command matrix | Yes | Passed | `ev:T-0538:2c1048d705db4f6fbbb873ff` |
| Generated docs stale-command scan | Yes | Passed | `ev:T-0538:2c1048d705db4f6fbbb873ff` |
| `DOGFOOD_REPORT.md` review | Yes | Passed | `ev:T-0538:2c1048d705db4f6fbbb873ff` |
| 0.4.2 rc0 fresh project dogfood | Yes | Passed | ev:T-0538:2c1048d705db4f6fbbb873ff |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | implementation-source | active | Current post-0.4.1 cleanup and latest validation baseline. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Current lifecycle command routing and Docker/dist expectations. |
| `docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md` | reference | active | Historical dogfood acceptance shape and release boundary reminders. |

## Changes

| Area | Summary |
|---|---|
| Dogfood | Added `DOGFOOD_REPORT.md` with command matrix, positives, residuals DF-1 through DF-4, and RC readiness recommendation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | This capsule dogfoods development `dist`, not the future npm-published `0.4.2-rc.0` package. Installed-package recycle remains separate after publish. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Fresh project `context pack` leaks source/release warnings for files that only exist in HADARA-dev source checkouts. | Open | `.hadara/local/feedback/T-0538-fresh-project-context-pack-internal-warnings.md` |
| RF-3 | Follow-up | Fresh project `status --summary-json` derives `done=1` but leaves `lastCompleted=[]` when generated handoff remains initial scaffold text. | Open | `.hadara/local/feedback/T-0538-fresh-project-context-pack-internal-warnings.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | Done | Dogfooded current development dist in a fresh governed project and documented release-readiness recommendation. |

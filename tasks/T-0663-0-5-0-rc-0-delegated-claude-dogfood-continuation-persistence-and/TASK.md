# T-0663 0.5.0-rc.0 delegated Claude dogfood: continuation persistence and adoption-baseline nextWork retirement

## Identity

| Field | Value |
|---|---|
| ID | T-0663 |
| Title | 0.5.0-rc.0 delegated Claude dogfood: continuation persistence and adoption-baseline nextWork retirement |
| Status | Done |
| Created | 2026-07-20T18:37 |
| Updated | 2026-07-20T18:40 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0663 --json`.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the latest built `dist` (0.5.0-rc.0, including T-0658 through T-0662) with delegated Claude subagents in a fresh external project, specifically to observe whether the continuation model (T-0661) and precedence chain hold up across a deliberate cold-started "new session" boundary. | Focus: does a fresh agent, given only a short "read AGENTS.md and proceed" prompt, correctly resume work using only persisted HADARA state? |

## Scope

| Boundary | Items |
|---|---|
| In | Build latest `dist`, pack current source, initialize a fresh external governed project under `/mnt/f/NowWorking/dev`, delegate real feature work to independent Claude subagents across multiple deliberately-isolated sessions, collect output/UX/persistence findings, and report stable/blocker status. |
| Out | Publishing, broad new 0.5.x implementation beyond what T-0658-T-0662 already delivered, modifying the external project after delegated dogfood except for setup/install/init/PATH fixture. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Build/pack latest source; init a fresh external governed project. | Done |
| 2 | Delegate an initial workflow to a fresh Claude subagent; inspect results. | Done |
| 3 | Delegate a second, independently-started Claude subagent (no shared context with step 2) with only a short "read AGENTS.md and proceed" prompt; observe cold-start persistence. | Done |
| 4 | Classify findings and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Latest source `dist` is built and packaged for dogfood. | Met | ev:T-0663:be062fced01e42739aafe693 | `npm run build`, `/tmp/hadara-0.5.0-rc.0.tgz` |
| AC-2 | Fresh external project initializes successfully from the packaged candidate. | Met | ev:T-0663:1f58adf7d7c0409599ef33b4 | `/mnt/f/NowWorking/dev/driftlog` |
| AC-3 | A second, independently-delegated agent (no shared conversation context with the first) completes at least one capsule or clearly reports a blocker, using only a short prompt and persisted HADARA state. | Met | ev:T-0663:1f58adf7d7c0409599ef33b4 | `DOGFOOD_REPORT.md` |
| AC-4 | Findings are classified by severity with recommendations. | Met | ev:T-0663:48ea8a8b50f84dd793c26ade | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0663:48ea8a8b50f84dd793c26ade | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run build` + `npm pack` | Yes | Passed | ev:T-0663:be062fced01e42739aafe693 |
| External project install/init/multi-session dogfood | Yes | Passed | ev:T-0663:1f58adf7d7c0409599ef33b4 |
| Independent verification of delegated agents' claims (test suite, CLI smoke, git log, file inspection) | Yes | Passed | ev:T-0663:48ea8a8b50f84dd793c26ade |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | requirement | active | Fix RF-3 first, then dogfood the current build with Claude-delegated sessions, deliberately testing a cold-started "new session" persistence boundary. |
| T-0661 `tasks/T-0661-continuation-model-task-close-promotion-and-idle-precedence-fix-/TASK.md` | reference | active | The continuation model under test. |
| T-0643, T-0647, T-0654 | reference | active | Prior dogfood task format/methodology precedent followed here. |

## Changes

| Area | Summary |
|---|---|
| External dogfood | Installed the 0.5.0-rc.0 candidate in a fresh governed project (`/mnt/f/NowWorking/dev/driftlog`) and delegated 3 task capsules of real feature work to two independently-started Claude subagents. |
| Report | Added `DOGFOOD_REPORT.md` with severity-classified findings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `hasBootstrapNextWork()` does not recognize the adoption-baseline bootstrap phrase, letting stale `nextWork` get permanently stuck if its one retirement opportunity is missed. | Open | `DOGFOOD_REPORT.md` F-2 |
| RF-2 | Follow-up | `task-selection-status-v2`'s continuation fallback is fully shadowed by any existing recommendation, even a stale review-only one, resurfacing the T-0661 problem one level up. | Open | `DOGFOOD_REPORT.md` F-3 |
| RF-3 | Follow-up | No PATH/version-mismatch warning when a differently-versioned `hadara` shadows a project-local candidate. | Open | `DOGFOOD_REPORT.md` F-1 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | Two-session, three-capsule delegated Claude dogfood completed; found and classified F-1 (PATH shadowing), F-2 (stuck adoption-baseline nextWork), F-3 (continuation shadowed by stale nextWork), F-4 (cross-version HANDOFF template drift, informational). |

# T-0615 0.4.6-rc.0 installed package multi-scenario delegated dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0615 |
| Title | 0.4.6-rc.0 installed package multi-scenario delegated dogfood |
| Status | Done |
| Created | 2026-07-15 |
| Updated | 2026-07-15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood installed `hadara@0.4.6-rc.0` in fresh external projects under `/mnt/f/NowWorking/dev`, delegate actual project work to Codex from those project directories, and record onboarding/workflow/CLI/document UX findings. | I install HADARA and run init; delegated Codex acts like a normal agent user after init. The main scenario is a quant trading battle arena built through multiple Task Capsules. |

## Scope

| Boundary | Items |
|---|---|
| In | Installed-package setup, fresh `hadara init` projects, scenario specs, delegated Codex prompts, multi-capsule toy implementation, HADARA CLI output/UX review, and structured findings. |
| Out | Publishing npm/GitHub releases, changing HADARA source before findings are classified, production trading correctness, real brokerage integration, private credentials, or committing external toy project files into HADARA-dev. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define dogfood scenarios, project locations, and delegation policy. | Done |
| 2 | Install `hadara@0.4.6-rc.0` into an external tool prefix and initialize scenario projects. | Done |
| 3 | Delegate scenario work to Codex from each project directory and capture outputs/findings. | Done |
| 4 | Classify findings into blockers, polish, and positive signals. | Done |
| 5 | Record evidence and close the capsule without pulling external project artifacts into HADARA-dev. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | At least three fresh external projects are initialized with installed `hadara@0.4.6-rc.0` and documented by scenario/profile. | Met | ev:T-0615:51b6972798484d7c82616cae | `DOGFOOD_PLAN.md` |
| AC-2 | The quant trading battle arena scenario has a concrete spec and capsule budget covering data collection, DB/API, frontend visualization, strategy templates, and agent accessibility. | Met | ev:T-0615:51b6972798484d7c82616cae | `DOGFOOD_PLAN.md` |
| AC-3 | Delegated Codex performs post-init work from external project directories rather than from HADARA-dev internals. | Met | ev:T-0615:51b6972798484d7c82616cae | `DOGFOOD_REPORT.md` |
| AC-4 | Findings include confusing/unnecessary CLI output, document scaffold issues, lifecycle friction, validation/evidence behavior, and positive signals. | Met | ev:T-0615:51b6972798484d7c82616cae | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence records installed package version/init success and delegated workflow outcomes. | Done | ev:T-0615:1a32f59d394944b3b4ca284c | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Installed package smoke | Yes | Passed | ev:T-0615:51b6972798484d7c82616cae |
| Fresh init scenario setup | Yes | Passed | ev:T-0615:51b6972798484d7c82616cae |
| Delegated Codex dogfood | Yes | Passed | ev:T-0615:a7138b1fa10f45ae90e7562b |
| Findings report review | Yes | Passed | ev:T-0615:51b6972798484d7c82616cae |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | reference | active | Current release/task/baseline. |
| `docs/HADARA_WORKFLOW.md` | reference | active | Required lifecycle and installed-project workflow rules. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Task status/finalize/evidence semantics. |
| `tasks/T-0614-0-4-6-rc-0-release-readiness-and-publish-preparation/EVIDENCE.md` | reference | active | Confirms `0.4.6-rc.0` npm/GitHub publication evidence. |

## Changes

| Area | Summary |
|---|---|
| External dogfood | Installed package fallback succeeded, three projects initialized, basic and standard delegated Codex scenarios closed `T-0001` as `closed-valid`; after T-0616 patched task-create serialization, the governed quant retry completed four capsules to `closed-valid`. |
| Findings | `DOGFOOD_REPORT.md` records the original task-create blocker, the retry outcome, remaining polish issues, and positive signals from delegated workflow completion. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | `/mnt/f/NowWorking/dev` is outside the normal workspace write root, so setup commands need explicit approval/escalation. | Open | `/mnt/f/NowWorking/dev` |
| RF-2 | Risk | Delegated agent may overfit to prompt instructions instead of generated HADARA docs; prompt must be user-like and avoid HADARA internals beyond normal init usage. | Open | `DOGFOOD_PLAN.md` |
| RF-3 | Follow-up | Parallel `task create` duplicate identities were fixed in T-0616; retain regression coverage and monitor delegated agents that create tasks concurrently. | Closed | `tasks/T-0616-serialize-task-create-allocation-and-managed-board-writes/TASK.md` |
| RF-4 | Follow-up | Delegated Codex used bare `hadara` during later lifecycle commands, so exact-package dogfood should inject PATH or use the dist entrypoint explicitly. | Open | `DOGFOOD_REPORT.md` |
| RF-5 | Follow-up | Task risk rows using `Type=None` are natural for agents but rejected; consider an alias or clearer scaffold example. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-15 | Draft | Initial task scaffold. |
| 2026-07-15 | In Progress | Defined external installed-package multi-scenario dogfood contract. |
| 2026-07-15 | In Progress | Basic and standard delegated scenarios closed successfully; governed quant scenario stopped after parallel task-create duplicate-id blocker. |
| 2026-07-15 | Done | Repacked T-0616 task-create serialization fix, reran governed quant dogfood, and completed all four retry capsules to closed-valid. |

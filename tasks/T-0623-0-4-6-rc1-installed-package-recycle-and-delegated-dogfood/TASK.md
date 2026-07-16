# T-0623 0.4.6 rc1 installed package recycle and delegated dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0623 |
| Title | 0.4.6 rc1 installed package recycle and delegated dogfood |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify published `hadara@0.4.6-rc.1` from an installed package and delegate a fresh project dogfood to Codex under `/mnt/f/NowWorking/dev`. | Installation/init is performed by the HADARA maintainer agent; project work is delegated with ordinary-user instructions so onboarding friction is observable. |

## Scope

| Boundary | Items |
|---|---|
| In | Installed-package recycle using npm `next`, Windows-mounted prefix fallback observation, fresh project init, delegated Codex dogfood, generated docs/task capsule review, and findings report. |
| Out | Publishing a new HADARA version, fixing findings discovered by this dogfood, or committing generated external project artifacts into HADARA-dev. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Install and verify `hadara@0.4.6-rc.1` from npm in an external prefix. | Done |
| 2 | Initialize delegated dogfood project(s) under `/mnt/f/NowWorking/dev`. | Done |
| 3 | Run Codex as the delegated development agent and capture project/output findings. | Done |
| 4 | Review generated docs/tasks and record recycle findings. | Done |
| 5 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed package recycle verifies `hadara@0.4.6-rc.1` and records any environment fallback. | Met | ev:T-0623:88b6ce09e51641f7b0365a33 | `DOGFOOD_REPORT.md` |
| AC-2 | At least one fresh project under `/mnt/f/NowWorking/dev` is initialized with the installed package and delegated to Codex for HADARA-guided work. | Met | ev:T-0623:64250c2cbc8d4a4995179db1 | `DOGFOOD_REPORT.md` |
| AC-3 | Generated docs/tasks are reviewed for onboarding friction, stale instructions, missing docs updates, or command-surface issues. | Met | ev:T-0623:64250c2cbc8d4a4995179db1 | `DOGFOOD_REPORT.md` |
| AC-4 | Validation evidence is recorded in the capsule. | Met | ev:T-0623:88b6ce09e51641f7b0365a33, ev:T-0623:64250c2cbc8d4a4995179db1 | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Installed package version check | Yes | Passed | ev:T-0623:88b6ce09e51641f7b0365a33 |
| Delegated Codex dogfood | Yes | Passed | ev:T-0623:64250c2cbc8d4a4995179db1 |
| Capsule report review | Yes | Passed | ev:T-0623:64250c2cbc8d4a4995179db1 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `hadara@0.4.6-rc.1` npm package | reference | active | Installed from npm `next` into `/mnt/f/NowWorking/dev/.../prefix`. |
| `/mnt/f/NowWorking/dev` | constraint | active | External dogfood workspace outside HADARA-dev. |
| `tasks/T-0615-.../DOGFOOD_REPORT.md` | reference | active | Prior multi-scenario dogfood and known delegation issues. |

## Changes

| Area | Summary |
|---|---|
| Installed package recycle | Verified `hadara@0.4.6-rc.1` from npm `next`; first install hit mounted-prefix symlink `EPERM`, then `--no-bin-links` fallback succeeded. |
| Delegated dogfood | Initialized external governed project and delegated development to Codex with ordinary-user instructions and installed package entrypoint. |
| Findings report | Captured command-entrypoint, governed optional-doc warning, context-pack startup, lifecycle ownership, and sandbox socket-smoke findings in `DOGFOOD_REPORT.md`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Codex delegation may fail due local CLI auth/model/interactive behavior; record honestly if blocked. | Closed | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Align governed profile diagnostics with minimal-init optional docs policy. | Open | `DOGFOOD_REPORT.md` |
| RF-3 | Follow-up | Consider command-entrypoint awareness for no-bin-links installs where generated read-model commands are not directly executable. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Started installed-package recycle and delegated dogfood setup. |
| 2026-07-16 | Done | Completed installed-package recycle, delegated Codex dogfood, report, and evidence capture. |

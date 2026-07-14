# Codex Delegated Onboarding Dogfood

## Setup

| Field | Value |
|---|---|
| Agent | Codex CLI |
| Model | gpt-5.4-mini |
| Reasoning | medium |
| Project | `/tmp/hadara-codex-onboarding-v2` |
| HADARA package | global `hadara@0.4.5` |
| Profile | `standard` |

## Scenario

A delegated Codex session was given a general user-style instruction in a small brownfield Node project. The instruction did not explain HADARA internals beyond saying the public `hadara` CLI was installed and that the agent should initialize HADARA, follow the generated workflow, create a capsule, implement a small feature, validate, and write a report.

The project was a tiny daily-note CLI. The delegated agent added `-h` / `--help` support and kept the original note creation behavior.

## Outcome

| Check | Result | Evidence |
|---|---|---|
| `hadara init --profile standard` adoption | Passed | Project scaffold created in `/tmp/hadara-codex-onboarding-v2`. |
| Task capsule creation | Passed | `tasks/T-0001-add-help-option-to-daily-note-cli/` |
| Feature implementation | Passed | `index.js` supports `-h` / `--help`. |
| Project validation | Passed | `npm test` returned `ok`. |
| HADARA capsule close | Passed | T-0001 reached `closed-valid`. |
| HADARA-dev evidence | Passed | `ev:T-0607:2981bf28318f4915817f5acb` |

## Positive Findings

| Area | Finding |
|---|---|
| Root isolation | Codex honored the absolute `-C /tmp/hadara-codex-onboarding-v2` project root. This was materially better than the earlier Antigravity run, which drifted across unrelated directories. |
| Public workflow | The generated `docs/HADARA_WORKFLOW.md` was enough for a fresh agent to complete init, create a capsule, validate, and finalize. |
| Task status | `hadara task status --task T-0001 --json` gave useful next actions and guided the agent from authoring to finalize. |
| Finalize auto | `hadara task finalize --task T-0001 --execute --auto --json` completed the close path once the capsule contract was fixed. |
| Evidence recovery | After wrapper validation was blocked, `validation run --direct-result passed` cleanly resolved the failed/blocked evidence chain. |

## Friction / Bugs Observed

| ID | Severity | Finding | Notes |
|---|---|---|---|
| F-1 | Medium | `validation run` wrapper hit `spawnSync npm EPERM` even though direct `npm test` passed. | HADARA correctly recorded blocked evidence, but this remains a recurring delegated-agent environment friction. |
| F-2 | Medium | `spawnSync(process.execPath, [cli, "--help"])` returned empty piped stdout in this environment while direct shell output worked. | Not a HADARA bug by itself, but it caused the delegated test to fail until the agent switched to file-backed capture. |
| F-3 | Medium | The agent naturally wrote invalid Inputs / Constraints Role tokens: `project manifest`, `implementation target`, `validation target`, `workflow constraint`, `task driver`. | `task status` / finalize gave enough diagnostics to fix them, but the first authoring attempt still fell into vocabulary friction. |
| F-4 | Low | The generated current state still suggests the adoption baseline after the feature task is closed. | This may be correct for brownfield adoption, but it reads stale after a real task succeeds unless the operator intentionally accepts that baseline as remaining work. |

## Reviewer Notes

This run is a stronger onboarding signal than the Antigravity attempt because the delegated agent respected the project boundary, used the installed public CLI, and reached `closed-valid` without HADARA-specific coaching. The remaining weak points are not fatal for 0.4.6, but they are exactly the same first-user friction class we have seen before: command wrapper launch behavior, controlled vocabulary, and "what next" guidance after a successful first capsule.

# T-0643 Dogfood Report

## Summary

Verdict: the latest built `dist` passed the delegated end-to-end workflow, but the dogfood did not recommend stable promotion without follow-up UX fixes.

Delegated Codex initialized a fresh governed project from the packaged candidate, closed the adoption-baseline capsule, implemented a small dependency-free Quant Battle Arena MVP, validated it with real command evidence, registered dogfood notes, and closed the MVP capsule. The final project status was healthy and idle.

## Setup

| Item | Value |
|---|---|
| External project | `/mnt/f/NowWorking/dev/hadara-050-latest-dist-codex-dogfood` |
| Package source | `/tmp/hadara-0.4.6.tgz` packed from current source after `npm run build` |
| Installed entrypoint | `.hadara-install/node_modules/hadara/dist/cli/main.js` |
| Init profile | governed |
| Delegated agent | Codex CLI |
| Final status schema | `hadara.project.status.v2` |

## What Worked

| Area | Result |
|---|---|
| Candidate install | Installed under `.hadara-install` with `--no-bin-links`; direct entrypoint worked. |
| Init/adoption | `init --profile governed --adopt` dry-run and execute completed successfully. |
| Status v2 ingress | `status --json` selected the adoption-baseline task, then ended healthy/idle after completion. |
| Task lifecycle | T-0001 and T-0002 both reached `Done` / `closed-valid` without hand-editing lifecycle-owned status. |
| Context routing | `context pack` and `context slice` were usable from generated workflow guidance. |
| Evidence | `validation run --update-task` appended evidence and updated validation rows. |
| MVP output | Quant Battle Arena generated a runnable Python package, tests, CLI, and self-contained HTML report. |

## External Capsule Results

| Task | Outcome | Evidence |
|---|---|---|
| T-0001 `Establish HADARA adoption baseline` | Done / closed-valid | `ev:T-0001:c039d88e3d52497cac79ed53` |
| T-0002 `Build Quant Battle Arena MVP` | Done / closed-valid | `ev:T-0002:47b6e62813af4987a61d70c7`, `ev:T-0002:056943ada3744a8da39f3380`, `ev:T-0002:35f74da6c5bc497090616358` |

## MVP Result

| Component | Result |
|---|---|
| Python package | `quant_battle_arena/` with strategy templates, synthetic data, backtest, report rendering, and CLI. |
| Tests | Four standard-library unit tests passed through HADARA validation evidence. |
| Report | `quant-battle-report.html` generated through CLI smoke validation. |
| Docs | `docs/PROJECT_STATE.md` updated for Quant Battle Arena and `DOGFOOD_NOTES.md` registered. |

## Findings

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| F-1 | High | Finalize dry-run reported an executable plan while done-level controlled-token checks were deferred; execute then blocked on invalid agent-owned tokens. | Run the same controlled-token checks in dry-run before recommending execute. |
| F-2 | High | `status --json` still said no validation baseline existed after the adoption-baseline task closed with doctor evidence. | Clarify and/or update trusted validation baseline projection after baseline validation. |
| F-3 | Medium | `docs/PROJECT_STATE.md` says managed owner is `project-state.update`, but no discoverable public command exists for that owner. | Add a discoverable update command or change the owner label/documentation. |
| F-4 | Medium | `task status --detail full` on a complete Draft capsule reports command-owned Draft statuses as blockers, while finalize is expected to own those writes. | Make the status wording distinguish "finalize-owned pending writes" from user-repair blockers. |
| F-5 | Low | `context slice` clamp warnings are noisy for normal short whole-file reads. | Suppress or downgrade expected clamp notices when the request safely resolves to the full file. |
| F-6 | Low | `validation run --json` placement around `--` is not obvious from generated examples. | Add one example showing JSON mode before the child-command separator. |

## Stable Readiness

| Gate | Result |
|---|---|
| Latest built dist package install | Passed |
| Fresh governed init/adoption | Passed |
| Delegated agent closes baseline capsule | Passed |
| Delegated agent completes MVP feature capsule | Passed |
| Final status v2 health | Passed |
| Stable promotion confidence | Caution: follow-up UX fixes recommended before treating 0.5.0 as stable-ready |

The core loop is materially better than the previous delegated dogfood: no permanent lifecycle blocker remained, and both capsules closed without lifecycle-owned hand edits. The remaining issues are mostly predictability/discoverability problems, not data corruption.

# T-0628 Dogfood Report

## Summary

Verdict: `0.4.6-rc.1` plus the current T-0626/T-0627 source fixes is stable-candidate quality for the previously blocking lifecycle close path.

Delegated Codex initialized a fresh governed project, closed the adoption baseline capsule, created and closed a Quant Battle Arena MVP feature capsule, and did not hand-edit lifecycle-owned `TASK.md` Identity Status or `docs/TASK_BOARD.md` Status to force closure.

## Setup

| Item | Value |
|---|---|
| External project | `/mnt/f/NowWorking/dev/hadara-046-current-dogfood-rerun` |
| Package tarball | `/tmp/hadara-0.4.6-rc.1.tgz` |
| Source commit packed | `fcbd83f5` |
| Installed entrypoint | `.hadara-install/node_modules/hadara/dist/cli/main.js` |
| Init profile | `governed` |
| Delegated agent | Codex CLI, `gpt-5.4-mini`, medium effort |

## Results

| Gate | Result | Evidence |
|---|---|---|
| Install current package | Passed | `npm install --prefix .hadara-install --no-bin-links /tmp/hadara-0.4.6-rc.1.tgz` |
| Governed init/adoption | Passed | `init --adopt --execute`; `init doctor` returned ok |
| Baseline capsule close | Passed | External `T-0001` closed-valid; `ev:T-0001:b640f476c00f4b8bb18a9438` |
| MVP feature capsule close | Passed | External `T-0002` closed-valid; `ev:T-0002:f1444383bf974354a55a6fb7` |
| Independent MVP smoke | Passed | `python3 -m quant_battle_arena ...` returned exit 0 |

## Built MVP

| Area | Output |
|---|---|
| CLI/backend | `quant_battle_arena/` stdlib CSV loader, strategy loader, backtest engine, and report renderer |
| Data | `data/sample_prices.csv` |
| Agent strategy surface | `strategies/momentum_template.py` and `strategies/momentum_template.md` |
| Frontend | `web/report.html` static HTML/JS report |
| Project docs | `docs/PROJECT_STATE.md` updated with product name, purpose, phase, and validation status |

## Stable Readiness

The T-0625 blocker is resolved:

- `task finalize --execute --auto --json` closed the first adoption-baseline capsule without manual lifecycle status edits.
- The same finalize path closed a real feature capsule after validation.
- The final `task status --task T-0002 --detail full --json` report showed `closed-valid`, blockers `0`, warnings `0`, and valid close proof.

## Residual UX Findings

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| R-1 | Medium | Agents naturally used descriptive Inputs / Constraints tokens such as `workflow reference`, `current-state canon`, and `planned`; the harness rejected them until the agent switched to canonical tokens. | Add CLI input aliases or stronger schema hints for source role/state tokens. Persist canonical tokens only. |
| R-2 | Medium | The delegated agent’s first validation wrapper attempt used `python`, but the environment only had `python3`; it recovered with direct-result evidence. | Prefer command examples that use `python3` when scaffolding Python-oriented examples, or improve wrapper/runtime hinting when `python` is missing. |
| R-3 | Low | After closing MVP work, `.hadara/state/current.json` still described the initial validation baseline rather than the latest trusted MVP smoke. | Consider a public baseline-update helper or clearer convention for when task close should refresh `validationBaseline`. |

## Conclusion

No stable blocker remained in this rerun. The close-boundary fixes should be treated as validated for 0.4.6 stable preparation, with the token alias and validation-baseline UX items kept as follow-up polish.

# T-0506 Fresh Toy Dogfood Resolution Report

## Environment

| Field | Value |
|---|---|
| HADARA CLI | `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js` |
| Toy project | `/tmp/hadara-t0506-toy-Yi5Yw6` |
| Profile | governed |
| Toy capsule | `T-0001 Implement toy calculator CLI` |
| Result | Toy capsule reached `closed-valid` with `task finalize --execute --auto`. |

## T-0505 Finding Resolution

| Finding | Result | Evidence |
|---|---|---|
| F-1 stale `handoff suggest` | Resolved. `handoff suggest` and `handoff stale-problems` return `hadara.commandRemoved.v1` stubs pointing to `task status` / `task finalize`; fresh generated handoff no longer drives work selection through stale fragments. | Fresh stub smoke: `handoff suggest --json` exit 6 with replacement `hadara task status --task <task-id> --json`. |
| F-2 closed-valid summary contradiction | Resolved. `task status --summary-json` for the closed toy capsule reports `phase: closed-valid`, `readiness.status: closed-valid`, `ready: true`, `closeProofValid: true`, and no issues. | Fresh command: `task status --task T-0001 --summary-json`. |
| F-3 `docs mark --help` validation ordering | Resolved. Help renders successfully with exit 0 before required-argument validation. | Fresh command: `docs mark --help`. |
| F-4 `validation run --update-task` duplicate inline-code row | Resolved. The toy `TASK.md` initially used a Validation row written as `` `node tests/calculator.test.js` ``. `validation run --update-task` normalized the check label, updated the row, and reported `appended: false`. | Wrapper report: `taskValidationRow.mode=updated`, `updated=true`, `appended=false`. |
| F-5 wrapper launch friction | Mitigated, not eliminated. `validation run` still hit `spawnSync node EPERM` in this tool environment, but the generated workflow now gives the direct-result fallback, the command report includes `nextActions`, and direct `node tests/calculator.test.js` plus `evidence add-command` completed the task. | Evidence `ev:T-0001:782b059efa5a458385ffb716`; generated `docs/HADARA_WORKFLOW.md` fallback section. |
| F-6 missing `DEVELOPMENT_SLICES.md` noise | Resolved. `task status --json` has no missing-slices warning; `state verify --json` now reports missing slices as info (`STATE_DEVELOPMENT_SLICES_MISSING`) and remains `consistent: true` after close. | Fresh state verify after close: warning count 0, info count 2. |
| F-7 `state verify` ok/consistent surprise and release readiness warning | Improved. `state verify` explicitly documents `ok: report-generated`; missing release readiness is info, not warning, and the closed toy project is `consistent: true`. | Fresh state verify after close: `ok: true`, `consistent: true`, `STATE_RELEASE_READINESS_MISSING` info. |

## Command Surface Cleanup

Removed or redirected public surfaces found from old task-number implementation lines:

| Removed surface | Replacement |
|---|---|
| `task show` | `task status --task <task-id> --json` |
| `task next` | `task status --json` |
| `task upgrade-scaffold` | `protocol remediate` / `harness validate` diagnostics |
| `evidence collect` | `evidence add-command` / `validation run` |
| `write preflight` | `policy preflight*` |
| `policy check-shell` | `policy preflight-shell` |
| `ops status` | `status --json` |
| `handoff suggest` | `task status` / deliberate handoff doc edits before finalize |
| `handoff stale-problems` | `doctor` / manual handoff review |
| `init register-doc` | `docs register` |
| `docs archive` | `docs list` / `docs doctor` |
| `harness replay` | `validation run` / `harness validate` |
| `run`, `run scaffold` | `validation run` / `evidence add-command` |
| `run-state show`, `run-state resume` | `status --json` |
| `package smoke` | `smoke package` |

`commands --json` no longer lists the removed ids and contains no `deprecatedCandidate` markers. Top-level removed stubs that must remain routable for one minor release are excluded from registry/routing parity by an explicit removed-stub allowlist.

## Fresh Lifecycle Notes

| Step | Result |
|---|---|
| `init --profile governed` | Generated current docs with `--auto`, `hadara slice`, removed lifecycle stub guidance, and validation fallback guidance. |
| `task create` | Created v2 minimal `TASK.md` capsule with schema hint. |
| validation | Wrapper EPERM reproduced, fallback direct command passed, durable evidence recorded. |
| first finalize auto | Partially executed finish bookkeeping, then stopped at ready with controlled token blockers. |
| second finalize auto | Recovered by rerunning finalize after token fixes; closed with valid close proof. |
| closed status | Compact summary is non-contradictory. |

## Residual Feedback

| ID | Summary | Disposition |
|---|---|---|
| RF-1 | `validation run` still cannot launch child commands in this Codex/tool environment, even for `node`, while direct shell execution works. | Keep fallback docs for 0.4.1; investigate wrapper launch permissions separately. |
| RF-2 | `smoke package --dry-run` keeps schema field `command: package.smoke` for compatibility even though the public command is now `smoke package`. | Accept for 0.4.1; revisit schema naming only with a compatibility plan. |
| RF-3 | Removed top-level stubs need a special routing-parity allowlist while they remain callable for one minor release. | Accept as explicit transitional debt. |

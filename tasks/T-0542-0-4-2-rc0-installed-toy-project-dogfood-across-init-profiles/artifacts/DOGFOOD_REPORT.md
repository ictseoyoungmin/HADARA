# HADARA 0.4.2-rc.0 Installed Package Dogfood Report

## Setup

| Field | Value |
|---|---|
| Package | `hadara@next` |
| Observed version | `0.4.2-rc.0` |
| CLI path | `/tmp/hadara-t0542-install/bin/hadara` |
| Workspace | `/tmp/hadara-t0542-dogfood` |
| Full lifecycle profile | `governed` |

## Init Profile Results

| Profile | Init | Init Doctor | Docs Doctor | Status Summary | Notes |
|---|---|---|---|---|---|
| `basic` | Passed | Passed | Passed; 5 registered docs | `health: ok` | Minimal scaffold is clean. Empty `task status --json` gives no next action. |
| `standard` | Passed | Passed | Passed; 8 registered docs | `health: ok` | Standard docs are clean. Empty `task status --json` gives no next action. |
| `governed` | Passed | Passed | Passed; 10 registered docs | `health: ok` | Full lifecycle toy app completed through 3 capsules. |

## Toy Project

Taskflow Toy is a dependency-free browser task board built in the governed profile.

| Capsule | Goal | Result |
|---|---|---|
| T-0001 | Define app scaffold, spec, source shell, and tests. | Closed valid. |
| T-0002 | Implement add/move/persist/summary behavior. | Closed valid. |
| T-0003 | Final profile audit and dogfood report. | Closed valid. |

The resulting MVP includes:

- browser UI in `src/index.html` and `src/styles.css`
- state, render, and localStorage behavior in `src/app.js`
- dependency-free Node behavior tests in `tests/app.test.js`
- README and app spec under project docs

## Commands Exercised

| Area | Commands |
|---|---|
| Install/version | `npm install -g --prefix /tmp/hadara-t0542-install hadara@next`, `hadara version --json`, `hadara doctor --json` |
| Init/profile | `hadara init --profile basic`, `hadara init --profile standard`, `hadara init --profile governed`, `hadara init doctor --json` |
| Task lifecycle | `task create`, `task status --json`, `task status --task --detail full --json`, `task finalize --execute --auto --json` |
| Evidence/validation | `validation run --direct-result ... --update-task --json` |
| Docs/context | `docs doctor --json`, `docs list --json`, `schema --json`, `context pack --task --json`, `context slice --path --from --to --json` |
| Product checks | `npm run check`, `npm test` |

## Good Findings

| ID | Finding | Impact |
|---|---|---|
| G-1 | All three init profiles scaffolded successfully and `init doctor` accepted them. | Fresh installs are usable across profile sizes. |
| G-2 | Generated `HADARA_WORKFLOW.md` no longer instructs agents to run removed lifecycle commands; it points to `task status` and `task finalize`. | The stale-doc issue from earlier dogfood is fixed for new projects. |
| G-3 | `task finalize --execute --auto` closed clean capsules in one call and produced clear step-by-step output. | Low-ritual close works well for routine capsules. |
| G-4 | `schema --json` exposes controlled vocabulary comprehensively. | It removes the old "learn by validation error" loop. |
| G-5 | `doctor --json` includes install location and exact package version. | Installed-package debugging is much easier. |
| G-6 | `validation run --direct-result` is a practical recovery path when command spawning is blocked. | Evidence still stays task-local and structured. |

## Problems And Improvements

| ID | Severity | Finding | Evidence / Repro | Suggested Fix |
|---|---|---|---|---|
| P-1 | High | `context pack` leaks source-checkout assumptions in a consumer project. It warned about missing `src/services/capability-registry.ts` and `docs/RELEASE_READINESS.md` even though an installed package project should not have HADARA source files. | In governed toy project, `hadara context pack --task T-0003 --json` returned `STATE_UNKNOWN` for `src/services/capability-registry.ts` and release-readiness source files. | Gate source-checkout projections behind a source-project detector, or downgrade them to package-internal metadata when running from npm installs. |
| P-2 | Medium | Empty-project `task status --json` returns no next action in basic/standard profiles. | `basic` and `standard` both returned `TASK_SELECTION_NO_RECOMMENDATION` with `nextActions: []`. | When no tasks exist, suggest `hadara task create '<first task title>'` or a profile-specific first-task workflow. |
| P-3 | Medium | Handoff recommendation title must match an existing task too exactly. After T-0003 was created, governed `task status --json` still recommended `hadara task create 'Create final polish and dogfood report'` because `AGENT_HANDOFF.md` used a similar but non-identical title. | Existing task: `T-0003 Finalize taskflow toy dogfood report`; handoff text: `Create final polish and dogfood report`. | Prefer existing open Task Board rows when a handoff recommendation is semantically close, or include a task id once created. |
| P-4 | Medium | `validation run -- npm ...` previously reported `spawnSync npm EPERM` in this environment while direct `npm run check` and `npm test` passed. | T-0001 wrapper evidence was blocked; direct-result recovery evidence passed. | Improve spawn error diagnostics and document direct-result as the official recovery path for restricted environments. |
| P-5 | Low | `context slice` reports `summary.truncated: true` when the requested range is only clamped to file length and all file lines are returned. | `context slice --path docs/APP_SPEC.md --from 1 --to 80 --json` returned all 21 lines, `CONTEXT_SLICE_RANGE_CLAMPED`, and `truncated: true`. | Separate `rangeClamped` from actual output truncation. |
| P-6 | Low | Evidence append serialization is easy for agents to violate accidentally. | During T-0001, two direct-result evidence commands were initially launched in parallel; locks prevented visible corruption but this conflicts with the protocol. | Consider a stronger CLI warning when same-task evidence append contention is detected, and keep docs emphasizing serialization. |

## Final Assessment

`hadara@0.4.2-rc.0` is usable from a fresh npm install for real capsule-driven development. The core loop of `init -> task create -> task status -> validation evidence -> finalize --execute --auto` works and the generated workflow docs are materially better than the 0.4.1 dogfood baseline.

The biggest remaining product issue is installed-package context routing: consumer projects should not see missing HADARA source checkout warnings. The next most important usability fix is empty-project first-task guidance.

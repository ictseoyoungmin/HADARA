# PRIMARY_WORKFLOW_BUDGET

## Decision

HADARA's ordinary post-init Task Capsule workflow is frozen at four unique public commands and six CLI invocations.
This is a product boundary, not a claim that every diagnostic or integration command should disappear.

## Four-command surface

| Command ID | Role | Ordinary use |
|---|---|---|
| `task.status` | Select and inspect work. | Before create and after selecting a capsule. |
| `task.create` | Create one bounded Task Capsule. | Once when no suitable capsule exists. |
| `validation.run` | Execute or honestly record validation evidence. | At least once before close. |
| `task.finalize` | Review and execute guarded close. | Once for review and once for execution. |

`evidence.add-command` remains a conditional fallback for an already-run result. Diagnostics, release, UI, and integration families remain available only when their task needs them.

## Six-invocation budget

Bootstrap `hadara init` and human/agent implementation edits are outside this count.

| Order | Invocation | Expected result |
|---|---|---|
| 1 | `hadara task status --json` | One safe next action. |
| 2 | `hadara task create "..." --json` | One capsule id and path. |
| 3 | `hadara task status --task T-XXXX --json` | Current phase, blockers, and next action. |
| 4 | `hadara validation run ...` | Durable command-log evidence. |
| 5 | `hadara task finalize --task T-XXXX --json` | Read-only reviewed close plan, including bounded finish work when needed. |
| 6 | `hadara task finalize --task T-XXXX --execute --auto --json` | `closed-valid` or a specific actionable blocker. |

The ordinary path budget is `<= 6` invocations after init. Recovery calls caused by a real failed check are reported separately rather than hidden.

## Measurement contract

`node scripts/primary-workflow-measurement.mjs` creates a disposable project in the OS temp directory and executes the six-invocation path using the selected CLI. The v2 JSON report records seven product metrics:

1. installation/available-CLI start to first capsule;
2. generated-instruction routing time to the first correct current-state file;
3. primary CLI calls to clean close, separated from setup and measurement probes;
4. manual document edit count and paths;
5. stale command/version/current-state references from `docs doctor`;
6. the first profile dropout stage, or `null` on completion;
7. command recommendation accepted/ignored/corrected counts and acceptance rate.

The first-file metric is an explicit generated-instruction-following simulation, not a claim about human reading speed. The default built-CLI run reports `includesPackageInstallation:false`; release readiness must repeat the measurement with an installed package and pass its real install duration via `--installation-mode installed-package --installation-duration-ms <ms>`.

Setup (`init`) and the post-close `docs doctor` measurement probe appear in `cliCalls` but do not consume the six-call primary lifecycle budget. Manual edits count operator/agent-authored Task Capsule documents; CLI-owned evidence, Task Board, structured state, and managed projections are not mislabeled as manual edits.

The initial observational target on a local temp filesystem is `<= 15,000 ms` total for the six CLI calls and `closed-valid` on the first clean finalize execution. Mounted-workspace timings are environment signals, not correctness gates.

## Capability freeze

Do not add another stable, canonical, default-help Task Capsule command unless evidence shows the four-command surface cannot express a required user outcome.
An exception must update this document and the command portfolio audit, include a migration or overlap decision, and deliberately change the regression budget.
New behavior should first fit an existing command, a conditional diagnostic, or a repository-local measurement script.

## Product metrics

| Metric | Healthy signal |
|---|---|
| Installation to first capsule | Installed-package run records the real install duration and reaches the first capsule without intervention. |
| First correct file | Generated instructions route first to `.hadara/state/current.json`; method and elapsed time are explicit. |
| Calls to clean close | Six or fewer primary post-init invocations; setup/probes are reported separately. |
| Manual document edits | Ordinary clean work edits only task-owned `TASK.md` and `HANDOFF.md`; shared current facts remain CLI-projected. |
| Stale references | `currentnessIssues:0`, `semanticDriftIssues:0`, and `currentnessVerdict:clean`. |
| Profile dropout | `point:null`; failures preserve the first failed stage and completed-stage list. |
| Recommendation behavior | Every observed command recommendation records accepted, ignored, or corrected; ordinary clean toys target 100% accepted. |

Blocker clarity, proof completion, and surface growth remain release invariants: failed stages emit a structured dropout issue, a clean toy reaches `closed-valid`, and the public primary surface remains four command ids.

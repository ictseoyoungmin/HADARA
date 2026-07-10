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

`node scripts/primary-workflow-measurement.mjs` creates a disposable standard-profile project in the OS temp directory and executes the six-invocation path using the built CLI. Its JSON report records:

- exact invocation count and command ids;
- duration for each invocation and the total measured lifecycle;
- final lifecycle state;
- the disposable project path for inspection.

The initial observational target on a local temp filesystem is `<= 15,000 ms` total for the six CLI calls and `closed-valid` on the first clean finalize execution. Mounted-workspace timings are environment signals, not correctness gates.

## Capability freeze

Do not add another stable, canonical, default-help Task Capsule command unless evidence shows the four-command surface cannot express a required user outcome.
An exception must update this document and the command portfolio audit, include a migration or overlap decision, and deliberately change the regression budget.
New behavior should first fit an existing command, a conditional diagnostic, or a repository-local measurement script.

## Product metrics

| Metric | Healthy signal |
|---|---|
| Time to first safe action | The first `task.status` returns one explicit next action. |
| Calls to clean close | Six or fewer post-init invocations. |
| Blocker clarity | A failed invocation names the issue and next action without raw-log archaeology. |
| Proof completion | A clean measured toy reaches `closed-valid`. |
| Surface growth | Four unique primary lifecycle command ids. |

# HADARA 0.5 Pre-Stable Lifecycle Simplification

## Status

Accepted for implementation before `0.5.0` stable.

## Problem

HADARA currently exposes two lifecycle ingress commands:

- `hadara status` computes project/session routing;
- `hadara task status` computes work selection without a selected capsule and
  task-local lifecycle state with a selected capsule.

The no-task forms now evaluate the same active-task, next-work, continuation,
and task-selection inputs. Keeping both creates two routing authorities which
can disagree while recommending the same action.

The generated project scaffold also exposes HADARA-dev release concerns as
generic project state. In particular, a new consumer project receives the
installed HADARA package version as its `currentRelease`, a validation baseline
before it has validation, and several synchronized projections of the same
bootstrap instruction.

## Product Boundary

HADARA owns:

- bounded Task Capsules;
- task selection and task-local lifecycle guidance;
- validation evidence and guarded close;
- explicit, inspectable read routing;
- consistency checks for lifecycle-owned state.

HADARA does not own a consumer project's research method, release train,
roadmap, package ecosystem, or general development framework. Those concerns
are project-authored documents and optional integrations.

## Stable Lifecycle

The public lifecycle is:

```text
hadara init
  -> hadara task status
  -> hadara task create (only when needed)
  -> hadara task status [--task T-XXXX]
  -> validation/evidence
  -> hadara task close
```

`task close` is terminal for the closed capsule. Its successful report is the
final lifecycle result; agents must not run `task status` merely to reconfirm a
successful close.

## Status Contract

### Default command

`hadara task status --json` is the only primary lifecycle ingress.

- If an active Task Capsule exists, it returns the selected-task cockpit.
- If no active Task Capsule exists, it returns the task-selection cockpit.
- `--task T-XXXX` explicitly inspects that capsule, including completed or
  non-active capsules.
- `--detail full` enables heavier consistency and provenance diagnostics.

The default report remains compact. It contains only:

- schema, command, scope/mode, phase, health, and readiness;
- selected or recommended task identity when present;
- required reading paths needed for the next action;
- one primary next action;
- compact source attribution and issues.

Full precedence tables, nested compatibility reports, raw backing state, broad
repository diagnostics, and legacy payloads are not part of the default report.

### Compatibility command

During the `0.5.x` compatibility window, `hadara status` remains a deprecated
read-only alias of the no-explicit-task `hadara task status` evaluator.

It must not retain an independent phase, readiness, or next-action evaluator.
Text and JSON output must identify the preferred replacement.

Project-wide diagnostics belong to an explicit doctor or full-detail surface,
not to a second lifecycle router. State mutation such as validation-baseline
promotion must not remain nested under the compatibility status alias.

## State Ownership

Human-inspectable Markdown and Task Capsules own project intent and read
routing:

```text
AGENTS.md
  -> HADARA_CONTEXT.md
     -> PROJECT_STATE.md / TASK_BOARD.md when no task is active
     -> tasks/T-XXXX/TASK.md when a task is active
        -> HANDOFF.md, evidence, and TASK.md Source Documents
```

The graph is expressed through small known Markdown tables and explicit paths.
HADARA may parse, validate, and explain these routes, but it must not require a
general predicate/DAG runtime to decide the ordinary lifecycle.

`.hadara/state/current.json` is not Required Reading and is not a human
authoring surface. During migration it may remain a command-owned checkpoint,
but every decision-bearing value must be either:

- derivable from Task Capsules or human-readable project documents; or
- projected with an explicit source path and consistency check.

The target state is a disposable cache/checkpoint which can be rebuilt without
losing project meaning. Fields already derivable from task status, Task Board,
profile metadata, or handoff must not be duplicated indefinitely.

## Generated Scaffold

Profiles represent real increments in governance cost:

| Profile | Initial surface |
|---|---|
| `basic` | Agent contract, compact workflow, Task Board, Task Capsules, evidence |
| `standard` | Basic plus human-readable project state and read routing |
| `governed` | Standard plus global handoff and stronger continuity/close guidance |

Architecture, roadmap, security, release, package, and provider documents remain
optional until the project creates and registers them.

A new consumer project must not inherit the HADARA package version as its own
release. Project release defaults to absent/`unversioned`; the generating HADARA
version remains scaffold metadata such as `createdWith`.

Generated workflow prose must describe the portable Task Capsule lifecycle.
HADARA-dev Docker, npm recycle, WSL package-install, release-candidate, and
publisher guidance belongs in HADARA-dev or product documentation, not every
consumer scaffold.

## Migration Sequence

Implementation is split into three substantial capsules:

1. Freeze this contract, make `task status` the single evaluator, and reduce
   `status` to a compatibility alias.
2. Demote structured current state from public authority, move routing authority
   to inspectable Markdown/Task Capsule sources, and remove redundant fields.
3. Make profile scaffolds materially distinct, remove HADARA-dev leakage, and
   complete source-level/profile validation before installed-package dogfood.

Existing projects must remain readable during `0.5.x`. Migration may preserve
old state files and schema readers while new init output and public guidance use
the simplified contract.

## Acceptance Gates

| ID | Criterion |
|---|---|
| PS-1 | `task status` owns both no-active-task selection and active-task cockpit behavior. |
| PS-2 | `status` has no independent lifecycle evaluator and clearly routes to `task status`. |
| PS-3 | A successful `task close` is terminal and no generated guidance asks for a confirming status call. |
| PS-4 | Raw `current.json` is absent from normal Required Reading and public first-use guidance. |
| PS-5 | Default status output is compact; full provenance and compatibility payloads are opt-in. |
| PS-6 | Basic, standard, and governed scaffolds have intentional, test-covered differences. |
| PS-7 | New scaffolds do not treat the installed HADARA version as the consumer project release. |
| PS-8 | Generated consumer docs contain no HADARA-dev-only release, Docker, npm recycle, or WSL workflow requirements. |
| PS-9 | Source validation passes before installed-package dogfood begins. |

## Autonomous Dogfood Findings

T-0682 exercised the current built CLI in three fresh projects (`basic`,
`standard`, and `governed`). Each project completed three substantive capsules
through separate Codex CLI sessions. Sessions two and three received only
`AGENTS.md를 읽고 다음 작업 진행.`; all six recovered the project state and
closed the next capsule without coordinator implementation.

The run validates the core design:

- `task status` is sufficient as both the no-task selector and selected-task
  cockpit; a separate lifecycle `status` authority is unnecessary;
- Task Board, capsule Markdown, and HANDOFF prose preserve useful cross-session
  continuity without making raw `current.json` normal reading;
- the cumulative profile scaffolds are doctor-clean and Markdown read routing
  remains understandable to an unbriefed agent;
- validation evidence plus guarded close gives meaningful proof across all
  three profiles.

The following findings must be addressed before `0.5.0` stable:

| Priority | Finding | Required direction |
|---|---|---|
| P0 | HANDOFF `Step` prose is reused as a new task title, producing sentence-length titles and truncated capsule paths. | Do not add a structured next-title field. Treat HANDOFF as review input, read routed project/development sources, apply current human/reviewer direction first, decide whether a capsule is warranted, and let the agent choose a concise behavior-focused title. |
| P0 | `docs register` dry-run `executeCommand` drops requested metadata, so executing the suggested command can register `unknown`/`reference` instead of the reviewed kind, tier, authority, and approval values. | Preserve all reviewed metadata flags in the execute command and add round-trip tests. |
| P0 | Agents still run `task status` after a successful close in some sessions. | Make successful close output explicitly terminal, omit status-based confirmation guidance, and keep generated agent/workflow prose consistent with that result. |
| P1 | `task status --detail full` reports lifecycle-owned Draft/Task Board fields as blockers immediately before a close that owns those mutations. | Separate operator-fixable blockers from close-transaction writes so readiness guidance is not circular. |
| P1 | A basic-profile agent invented `PROJECT_STATE.md` and expanded Required Reading even though the scaffold was doctor-clean. | State profile boundaries explicitly: optional governance documents may be added for a real project need, not merely to satisfy assumed HADARA ceremony. |
| P1 | Close accepted a malformed Markdown table in HANDOFF. | Validate required table shape, separator placement, and row widths before close proof. |
| P1 | Unknown help families print an error but return exit code 0. | Return a non-zero usage exit for unknown command families. |
| P2 | Governed agents ran parallel same-task evidence writers; append locks prevented corruption. | Treat the task-scoped append lock as the safety authority and remove caller-side serialization instructions. Independent validation/evidence commands may run concurrently. |

T-0683 root-cause review refined three observations:

- Basic init output itself did not require `PROJECT_STATE.md`; the false requirement came from stale profile/doc-set logic reached by `task status --detail full`, which still classified that Standard document as universal.
- Successful close returned an empty `nextActions` list. Agents invoked status on their own to reconfirm or select follow-up work because the terminal boundary was not explicit enough in the top-level close report and generated rules.
- HANDOFF continuation is useful provenance, but it is neither current reviewer authority nor a task-title generator. When persisted plans and current review conflict, current review wins. When planned milestone work is exhausted, the agent should review for defects or optimizations and propose or request direction instead of manufacturing a task.

An external Codex sandbox observation is not a HADARA release blocker: a direct
`rm -f` smoke command was rejected while a nested shell inside a validation
wrapper could execute an equivalent temporary-file cleanup. HADARA examples
should continue to prefer unique temporary directories, but command-host safety
policy belongs to the host runtime.

## Deferred Until Evidence Exists

- a general declarative DAG runtime for ordinary lifecycle routing;
- dynamic predicate or adapter registries for Markdown reads;
- a new project/session status command under another name;
- automatic inference of research, roadmap, or release intent.

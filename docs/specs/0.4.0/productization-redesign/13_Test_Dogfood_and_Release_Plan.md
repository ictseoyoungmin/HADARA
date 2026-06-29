# 13 Test, Dogfood, and Release Plan

## Goal

Validate the 0.4 productization redesign as a breaking protocol line.

## Test Groups

| Group | Coverage |
|---|---|
| Init scaffold tests | basic/standard/governed trees, scaffold metadata, registries, merged docs. |
| Agent entry tests | `AGENTS.md` contains compact Required Reading, tiers, safety/reference rules, and no lifecycle/context command cookbook. |
| Workflow doc tests | `HADARA_WORKFLOW.md` explains minimal loop, read authority, project start, session start, context pack/slice next actions, lifecycle entry gate, evidence truthfulness, finalize dry-run review, repair, docs read-map, task document timing, common failure modes, and useful CLI by situation. |
| Task capsule tests | `task create` generates exactly `TASK.md`, `HANDOFF.md`, `evidence.jsonl`, `EVIDENCE.md`. |
| Task template simplification tests | Fresh `TASK.md` has no `Scope`, `Out of Scope`, or task-local `Decision` kind by default. |
| Controlled value tests | Invalid status/result/disposition/read-tier tokens are rejected. |
| Source document tests | TASK source document hashes detect changes. |
| Evidence tests | `evidence add-command`, `task finalize`, and proposed `evidence project` keep `EVIDENCE.md` as a projection; close proof projects to `EVIDENCE.md`, not `TASK.md` or `HANDOFF.md`. |
| Close-source tests | Whole `TASK_BOARD.md`, task-local `HANDOFF.md` raw hash, and raw evidence file hashes are not default close-source. |
| Legacy boundary tests | 0.3-like projects fail closed for mutation commands. |
| Context routing tests | session start/context pack respect docs registry read tiers and drift warnings. |
| Authoring guidance tests | `task status`/lifecycle reports tell agents what to write next without silently mutating agent-owned prose. |
| Release tests | readiness/publish/recycle remain approval-gated and separated. |
| Product-default tests | Generated scaffold does not mention HADARA-dev-specific Node/npm/Docker/release conventions. |

## Baseline Current CLI Smoke

```bash
node dist/cli/main.js init --profile basic --json
node dist/cli/main.js session start --json
node dist/cli/main.js task create "0.4 productization smoke" --json
node dist/cli/main.js task status --task T-0001 --json
node dist/cli/main.js context pack --task T-0001 --json
node dist/cli/main.js evidence summary --task T-0001 --json
node dist/cli/main.js task lifecycle --task T-0001 --json
node dist/cli/main.js task finalize --task T-0001 --json
```

No `--layout` or migration smoke exists.

## Proposed 0.4 Smoke After Implementation

```bash
node dist/cli/main.js docs read-map --task T-0001 --json
node dist/cli/main.js docs inbox --json
node dist/cli/main.js docs register --path docs/specs/0.4.0/example.md --json
node dist/cli/main.js evidence project --task T-0001 --json
```

## Dogfood Plan

Create a new disposable HADARA 0.4 project and perform:

```text
1. init basic
2. add design source doc
3. create task from user request
4. update TASK.md derived fields
5. satisfy lifecycle entry gate
6. run focused validation
7. append evidence
8. verify evidence summary and projection
9. run context pack
10. finalize dry-run and inspect plan hash
11. finalize execute
12. audit close
```

Dogfood acceptance:

```text
No user-facing layout flag.
No expanded scaffold files.
No direct evidence edit.
No close proof in TASK.md.
No Scope / Out of Scope sections in fresh TASK.md.
No task-local Decision kind in fresh TASK.md.
No HANDOFF TaskStatus/CloseState.
No same-capsule lifecycle chores in HANDOFF Next Recommended Step.
No whole TASK_BOARD close-source.
No task-local HANDOFF raw close-source hash by default.
Read map excludes unrelated implemented/superseded specs.
Legacy project mutation fails closed.
Generated docs remain generic and contain no HADARA-dev-specific validation or release commands.
Authoring guidance is read-only and no command silently writes task-specific prose.
Evidence records real executed checks, not assumptions.
```

## Release Sequence

Keep release work split.

```text
0.4.0-rc.0 readiness
0.4.0-rc.0 approval-gated publish
0.4.0-rc.0 installed-package recycle
0.4.0 stable decision
0.4.0 stable readiness
0.4.0 stable approval-gated publish
0.4.0 stable installed-package recycle
```

Do not combine readiness, publish, and recycle into one capsule.

## Release Note Required Statement

```text
HADARA 0.4 is a breaking project protocol line intended for new productized HADARA projects. It does not mutate or migrate 0.3.x HADARA projects. Use the 0.3.x package line for existing 0.3 projects.
```

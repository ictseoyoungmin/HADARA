# CLI_JSON_CONTRACT

This document defines HADARA CLI JSON output behavior for external agents and future MCP bridge adapters.

## Stability Rule

HADARA CLI commands may expose command-specific JSON schemas. External agents should inspect `schemaVersion`, `command`, and `ok` before reading command-specific fields.

Failure output has two layers:

1. Normal command failures use the command-specific schema for that command.
2. Early CLI parse, global option, or validation failures use the shared fallback schema `hadara.cli.error.v1`.

## Command-Specific Failures

If a command can safely construct its normal report, it should return that command's JSON schema even when `ok` is `false`.

Examples include:

- `hadara.doctor.v1`
- `hadara.task.list.v1`
- `hadara.task.show.v1`
- `hadara.task.upgrade_scaffold.v1`
- `hadara.policy.check.v1`
- `hadara.policy.preflight.v1`
- `hadara.hermes.detect.v1`
- `hadara.hermes.export-context.v1`
- `hadara.evidence.collect.v1`
- `hadara.evidence.list.v1`
- `hadara.operational_debt.v1`
- `hadara.operational_debt.show.v1`
- `hadara.tools.list.v1`
- `hadara.harness.validate.v1`
- `hadara.harness.replay.v1`
- `hadara.agent.loop.v1`
- `hadara.ops.status.v1`
- `hadara.active_run.projection.v1`
- `hadara.active_run.resume.v1`
- `hadara.protocol.consistency.v1`
- `hadara.protocol.remediation.v1`
- `hadara.releaseGate.v1`
- `hadara.context.export.v1` (MCP read-only memory payload)

Agents should treat `issues` as the primary machine-readable failure detail when present.

`hadara version --verbose --json` returns `hadara.runtime.version.v1`. It is a read-only runtime origin report for distinguishing the currently executed CLI entry from other possible builds such as Docker temp-copy `dist`, workspace `dist`, or a globally installed `hadara`. It reports `cliEntry`, `cwd`, `projectRoot`, package version, git branch/head when available, Node version, `build.distMtime`, `build.sourceMtime`, and `build.distLooksStale`.

`hadara protocol doctor --json` defaults to the broad read-only all-scope protocol report. It returns `hadara.protocol.consistency.v1` with `scope: "all"`, aggregating docs, profile, and active-task detail without writing files.

`hadara task upgrade-scaffold --task <id> --json` returns `hadara.task.upgrade_scaffold.v1` in dry-run mode by default. It previews missing Task Capsule v2 frame insertions and missing standard capsule file creation; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Writes also use per-action before-hash/existence checks and must not delete user-authored content.

`hadara protocol remediate --fix <name> --json` returns `hadara.protocol.remediation.v1` in dry-run mode by default. It previews only allowlisted bounded fixes; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Execute keeps per-action before-hash/existence checks, temp-file writes, rollback-attempt issue reporting, and no broad document rewrite behavior.

`hadara task status --task <id> --json` returns `hadara.task.workbench.v1`. It is the Phase 3 read-only task operator console projection and aggregates task identity, Task Board status from `docs/TASK_BOARD.md`, evidence list/lint summary, task close dry-run readiness, task protocol doctor summary, docs/profile protocol summaries, close state, and next actions. Its top-level `ok` means the report was generated for an existing task, not that the task is ready or closable; readiness is represented by `state.ready`, `summary.blockers`, and `issues`. Task Board fields are split as `task.taskStatus`, `task.taskBoardStatus`, `task.taskBoardPath`, and `task.taskBoardPresent`, and close state is split as `state.closeEvidenceFound`, `state.closedValid`, `state.closeState`, and the compatibility alias `state.closed`. It must not append evidence, mutate Task Capsule files, update project docs, run shell commands, call providers, or rerun done-level harness validation separately from the close dry-run source.

`hadara task finish --task <id> --json` returns `hadara.task.finish.v1` in dry-run mode by default. It plans the bounded bookkeeping needed to mark a Task Capsule done: `TASK.md` status and the matching `docs/TASK_BOARD.md` row status/path. Planned writes include `expectedBeforeExists`, `expectedBeforeHash`, and `afterHash` so execute mode can detect stale plans. The report also includes `stateDocs` advisory diagnostics for `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`, with current/pending/missing state and recommendations. Writes require `--execute`; execute mode writes through temp-file/rename with rollback-attempt behavior, rejects malformed `docs/TASK_BOARD.md` table frames, rejects duplicate Task Board rows, and must not update those broad state docs, evidence files, or close evidence. Those broader state updates remain advisory/manual until a later capsule explicitly expands the finish boundary.

`hadara task close --task <id> --json` and `--execute --json` return `hadara.task.close.v1`. The report may include additive `lifecycle` guidance that states the three-layer close model: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. `lifecycle.closeEvidenceLoopBoundary.excludedFromCurrentValidationLoop` remains true because close evidence is appended after validation. `hadara task audit-close --task <id> --json` returns `hadara.task.audit_close.v1` and may include additive `auditVerdict` fields for recorded/current report hashes, source hashes, read-only status, and the post-close verdict.

`hadara task next --json` returns `hadara.task.next.v1`. It is a read-only recommendation report that prefers the actionable current next step in `docs/AGENT_HANDOFF.md`, then incomplete planned rows in `docs/DEVELOPMENT_SLICES.md`, then `docs/TASK_BOARD.md` fallback rows. Handoff-only recommendations may return `taskId: "TBD"` when the recommended work has no Task Capsule yet; consumers must inspect `sourceKind`, `createCommand`, `taskCapsulePresent`, and `backlog` instead of assuming every recommendation has a concrete task id. The report includes required-reading guidance plus a `createCommand` for capsule creation, and may expose non-primary legacy/open Task Board rows in additive `backlog` metadata. It must not create tasks, update project docs, append evidence, or infer completion.

`hadara evidence from-command` is intentionally not implemented. The design boundary lives in `docs/EVIDENCE_FROM_COMMAND_DESIGN.md`; until a future capsule implements it, shell-executing evidence capture must not be inferred from `evidence add-command`.

`hadara evidence migrate --task <id> --to v2 --json` returns `hadara.evidence.migration_preview.v1`. Dry-run mode is read-only and reports `beforeHash`, planned v2 transforms, skipped records, warning issues, and execution metadata. Execute mode requires `--execute --before-hash <hash>`, rewrites only the selected task's `evidence.jsonl` through temp-file/rename when the hash matches and no blocking skipped records exist, preserves existing v2 records, and must not rewrite `EVIDENCE.md`, other tasks, artifacts, or project docs. Migration is operator-selected per task; agents should not infer broad historical migration as the default next step.

`hadara run-state resume --json` returns read-only resume guidance. It does not update active-run state, execute commands, call providers, or resume an agent process.

## Task Workflow Command Semantics

The task workflow surface is intentionally staged. `docs/TASK_WORKFLOW_COMMANDS.md` is the operator-facing source for the full loop.

| Command | JSON Schema | Write Policy | `ok` Semantics |
|---|---|---|---|
| `task next --json` | `hadara.task.next.v1` | Read-only. | Recommendation report was generated. |
| `task status --task T-XXXX --json` | `hadara.task.workbench.v1` | Read-only. | Report generation succeeded for an existing task; not a readiness gate. |
| `evidence add-command --task T-XXXX ... --json` | `hadara.evidence.collect.v1` evidence append response | Writes command-log evidence only. | Evidence append succeeded. |
| `task ready --task T-XXXX --level done --json` | `hadara.task.ready.v1` | Read-only. | Requested readiness level passed. |
| `task finish --task T-XXXX --json` | `hadara.task.finish.v1` | Read-only dry-run. | Bounded finish plan has no blockers. |
| `task finish --task T-XXXX --execute --json` | `hadara.task.finish.v1` | Writes only `TASK.md` and `docs/TASK_BOARD.md` status/path changes. | Bounded writes succeeded or no write was needed. |
| `task close --task T-XXXX --json` | `hadara.task.close.v1` | Read-only dry-run. | Close preconditions passed. |
| `task close --task T-XXXX --execute --json` | `hadara.task.close.v1` | Appends close evidence only. | Close evidence append succeeded. |
| `task audit-close --task T-XXXX --json` | `hadara.task.audit_close.v1` | Read-only. | Valid close evidence exists and no audit blockers remain. |

## Early Failure Fallback

If parsing or validation fails before a command-specific report can be built, JSON mode returns:

```json
{
  "schemaVersion": "hadara.cli.error.v1",
  "command": "cli.error",
  "ok": false,
  "input": {
    "command": "run",
    "subcommand": null
  },
  "issues": [
    {
      "severity": "error",
      "code": "PERMISSION_MODE_UNSUPPORTED",
      "message": "unsupported permission mode: banana"
    }
  ]
}
```

Known fallback issue codes include:

| Code | Meaning |
|---|---|
| `PERMISSION_MODE_UNSUPPORTED` | `--mode` is not one of `readonly`, `assisted`, `trusted`, `auto`, or `release`. |
| `EVIDENCE_RESULT_UNSUPPORTED` | `--result` is not one of `passed`, `failed`, `blocked`, or `unknown`. |
| `EVIDENCE_VISIBILITY_UNSUPPORTED` | `--visibility` is not one of `public` or `private`. |
| `HARNESS_LEVEL_UNSUPPORTED` | `--level` is not one of `draft` or `done`. |
| `CLI_ARGS_*` | Strict CLI argument parsing rejected a malformed option. |
| `WORKSPACE_*` | Workspace/project path resolution rejected an unsafe or invalid path. |
| `CLI_COMMAND_FAILED` | Fallback for unexpected command failure. |

## Exit Codes

JSON shape and process exit code are related but separate.

| Category | Exit Code |
|---|---:|
| Generic CLI parse/global failure | 1 |
| Policy denied or invalid policy input | 2 |
| Run, evidence, harness, and task-style failures | 6 |
| Doctor failure | 7 |

External agents should use both `ok` and the process exit code. When they disagree due to a transport or host issue, treat the command as failed and surface the raw stderr/stdout to the operator.

## MCP Bridge Implication

The MCP bridge should preserve these CLI semantics where it delegates to existing command/report builders:

- MCP tool success should wrap a valid HADARA command report.
- MCP tool failure should preserve the underlying `schemaVersion`, `command`, `ok`, and `issues` fields when available.
- Early adapter validation failures may use MCP protocol errors, but the response payload should still prefer HADARA issue codes when possible.

## TUI Implication

The planned terminal TUI may use CLI JSON reports as a mockup or compatibility data source, but the integrated production TUI should prefer shared TypeScript read-model services so it does not depend on subprocess CLI transport for normal rendering. If a CLI adapter remains, it must call read-only JSON commands or `hadara write preflight ... --json` previews only.

## Planned v1.0 JSON Surfaces

The following schemas are planned or partial and should not be treated as stable until their Task Capsules complete:

- `hadara.redaction.report.v1`

Detailed target schemas live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

# CLI_JSON_CONTRACT

This document defines HADARA CLI JSON output behavior for external agents and future MCP bridge adapters.

## Stability Rule

HADARA CLI commands may expose command-specific JSON schemas. External agents should inspect `schemaVersion`, `command`, and `ok` before reading command-specific fields.

Phase 6 workflow-compression reports should also expose common multi-agent-compatible metadata where applicable:

| Common Schema | Purpose |
|---|---|
| `hadara.actor_context.v1` | Actor/run identity with default `unknown` / `local` / `operator` / `null` values when optional CLI actor metadata is absent. |
| `hadara.plan_context.v1` | Dry-run plan identity, affected files, optional before-hash, optional idempotency key, and `reviewed:false`. |
| `hadara.next_action.v1` | Structured next command guidance with write boundary, recommended actor role, before-hash requirement, and stale-plan risk. |

Phase 6.1 workflow-compression commands use optional actor CLI option names consistently: task finish/ready/close/audit-close/complete, handoff suggest, and dev docker-check accept `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id`. Existing defaults remain valid when the options are absent. Future reviewed-plan commands should use `--idempotency-key` where a command contract accepts caller-supplied idempotency metadata.

T-0254 adds this common metadata to task lifecycle reports (`hadara.task.finish.v1`, `hadara.task.ready.v1`, `hadara.task.close.v1`, and `hadara.task.audit_close.v1`) as additive report fields. Existing command invocations still do not accept actor options; reports use the default local operator actor context until later command-specific adoption.

Failure output has two layers:

1. Normal command failures use the command-specific schema for that command.
2. Early CLI parse, global option, or validation failures use the shared fallback schema `hadara.cli.error.v1`.

## Command-Specific Failures

If a command can safely construct its normal report, it should return that command's JSON schema even when `ok` is `false`.

Examples include:

- `hadara.init.v1`
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
- `hadara.handoff.update.v1`
- `hadara.harness.validate.v1`
- `hadara.harness.replay.v1`
- `hadara.agent.loop.v1`
- `hadara.ops.status.v1`
- `hadara.active_run.projection.v1`
- `hadara.active_run.resume.v1`
- `hadara.protocol.consistency.v1`
- `hadara.protocol.remediation.v1`
- `hadara.protocol.migration.v1`
- `hadara.releaseGate.v1`
- `hadara.context.export.v1` (MCP read-only memory payload)

Agents should treat `issues` as the primary machine-readable failure detail when present.

`hadara version --verbose --json` returns `hadara.runtime.version.v1`. It is a read-only runtime origin report for distinguishing the currently executed CLI entry from other possible builds such as Docker temp-copy `dist`, workspace `dist`, or a globally installed `hadara`. It reports `cliEntry`, `cwd`, `projectRoot`, package version, git branch/head when available, Node version, `build.distMtime`, `build.sourceMtime`, and `build.distLooksStale`.

`hadara protocol doctor --json` defaults to the broad read-only all-scope protocol report. It returns `hadara.protocol.consistency.v1` with `scope: "all"`, aggregating docs, profile, and active-task detail without writing files.

`hadara init [--profile basic|standard|governed] --json` returns `hadara.init.v1`. It creates missing scaffold files without overwriting existing files, reports relative scaffold file actions as `created` or `exists`, and keeps text initialization logs out of JSON output. `hadara init doctor --json`, `init upgrade`, `init register-doc`, and `init enable-integration` remain follow-up reports under `hadara.init.followup.v1`.

`hadara task upgrade-scaffold --task <id> --json` returns `hadara.task.upgrade_scaffold.v1` in dry-run mode by default. It previews missing Task Capsule v2 frame insertions and missing standard capsule file creation; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Writes also use per-action before-hash/existence checks and must not delete user-authored content.

`hadara task create <title> [--from <template-id>] --json` returns `hadara.task.create.v1`. It creates a Draft Task Capsule and matching Task Board row, and may include additive `template` metadata when `--from` selects a supported template. Templates prefill capsule docs with expected evidence and out-of-scope boundaries, but they must not mark the task Done, attach evidence, run validation, or close the task. Unknown templates return `TASK_TEMPLATE_UNKNOWN` with `supportedTemplates` and create no capsule. T-0265 adds bounded collision retry for sequential task ids; exhausted directory/Task Board id collisions return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED` instead of silently reusing an id.

`hadara protocol remediate --fix <name> --json` returns `hadara.protocol.remediation.v1` in dry-run mode by default. It previews only allowlisted bounded fixes; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Execute keeps per-action before-hash/existence checks, temp-file writes, rollback-attempt issue reporting, and no broad document rewrite behavior.

`hadara protocol migrate --target 0.3.0 --json` returns `hadara.protocol.migration.v1` in dry-run mode by default. It detects pre-0.3, partial-0.3, and 0.3 scaffold signals, then plans bounded project-scope adoption writes for docs registry, command-surface docs, managed Required Reading markers, and protocol version metadata. `--task <task-id>` limits migration to the selected Task Capsule. Execute mode requires `--execute --before-hash <hash>` from the reviewed dry-run report and rechecks per-action before existence/hash before writing.

`hadara task status --task <id> --json` returns `hadara.task.workbench.v1`. It is the Phase 3 read-only task operator console projection and aggregates task identity, Task Board status from `docs/TASK_BOARD.md`, evidence list/lint summary, task close dry-run readiness, task protocol doctor summary, docs/profile protocol summaries, close state, and next actions. Its top-level `ok` means the report was generated for an existing task, not that the task is ready or closable; readiness is represented by `state.ready`, `summary.blockers`, and `issues`. Task Board fields are split as `task.taskStatus`, `task.taskBoardStatus`, `task.taskBoardPath`, and `task.taskBoardPresent`, and close state is split as `state.closeEvidenceFound`, `state.closedValid`, `state.closeState`, and the compatibility alias `state.closed`. It must not append evidence, mutate Task Capsule files, update project docs, run shell commands, call providers, or rerun done-level harness validation separately from the close dry-run source.

`hadara task complete --task <id> --json` returns `hadara.task.complete_flow.v1`. It is a read-only workflow compression report over the existing `task finish`, `task ready`, `task close`, and `task audit-close` read models. It returns default actor context, a current `stage`, lifecycle `steps`, shared-doc `stateDocs` counts when applicable, conflicts, issues, and exactly one `primaryNextAction` while incomplete. It must not write files, append evidence, update handoff/state docs, run shell commands, or execute the reported next action. `--execute` is intentionally unsupported and returns a blocked complete-flow report with `TASK_COMPLETE_EXECUTE_UNSUPPORTED`.

`hadara handoff suggest --task <id> --json` returns `hadara.handoff.suggestion.v1`. It is a read-only shared-doc suggestion report for `docs/AGENT_HANDOFF.md`; it includes default actor context, target before-hash, `writeBoundary: "shared-doc"`, `recommendedActorRole: "coordinator"`, task snapshot metadata, section fragments, and issues. Section fragments include additive coordinator-review fields for exact target before-hash, section title, and suggested replacement Markdown while preserving the compatibility `suggestedMarkdown` field. It must not write the handoff, Task Capsule files, project state docs, evidence, or Task Board rows. `--execute` is intentionally unsupported and returns the same schema with `ok:false` and `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED`.

`hadara handoff update --task <id> --summary <text> --next <text> --json` returns `hadara.handoff.update.v1`. It writes `docs/AGENT_HANDOFF.md` through the existing CLI-owned handoff update path, reports the shared-doc write boundary, and summarizes whether task id, summary, and next-step inputs were provided. This is a write command, not a dry-run suggestion surface; use `handoff suggest --json` for read-only coordinator-reviewed fragments.

`hadara dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` returns `hadara.dev.docker_check.v1`. It is the official Phase 6 Docker validation wrapper for reproducible temp-copy validation. It runs Docker as an external subprocess, creates a run-scoped temp workspace with `.git`, `.hadara`, `node_modules`, and `dist` excluded, runs `npm ci`, then focused tests, a full check, or both. `--sync-dist` must be explicit before the wrapper copies Docker-built `dist` back to the workspace, and T-0263 requires the reviewed `--before-hash` to match the current workspace `dist/cli/main.js` hash before the copy executes. If no pre-sync hash exists, operators must use explicit `--allow-missing-before-hash`; otherwise the report returns `HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED` or `HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH` with `distSync.conflictDetected:true` and no output mutation. Reports include dist sync before/after hashes, `reviewedBeforeHash`, `beforeHashMatched`, `allowMissingBeforeHash`, and conflict metadata. T-0261 clarifies mutation fields: compatibility `execution.projectMutation:false` means no project source mutation, `execution.projectSourceMutation:false` says that directly, and `execution.outputMutation:true` means workspace output such as `dist` was changed. JSON output omits raw subprocess logs, private paths, and environment secrets, and includes an evidence-ready summary.

`hadara task finish --task <id> --json` returns `hadara.task.finish.v1` in dry-run mode by default. It plans the bounded bookkeeping needed to mark a Task Capsule done: `TASK.md` status and the matching `docs/TASK_BOARD.md` row status/path. Planned writes include `expectedBeforeExists`, `expectedBeforeHash`, and `afterHash` so execute mode can detect stale plans. The report also includes `stateDocs` advisory diagnostics for `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`, with current/pending/missing state and recommendations. Writes require `--execute`; execute mode writes through temp-file/rename with rollback-attempt behavior, rejects malformed `docs/TASK_BOARD.md` table frames, rejects duplicate Task Board rows, and must not update those broad state docs, evidence files, or close evidence. Those broader state updates remain advisory/manual until a later capsule explicitly expands the finish boundary.

As of T-0254, task lifecycle reports expose additive `actor`, `nextActions`, and optional `primaryNextAction` metadata. `nextActions` preserve existing human-friendly fields such as `kind`, `message`, and `command`, and add Phase 6 fields: `summary`, `writeBoundary`, `recommendedActorRole`, `requiresBeforeHash`, and `stalePlanRisk`.

`hadara task close --task <id> --json` and `--execute --json` return `hadara.task.close.v1`. The report may include additive `lifecycle` guidance that states the three-layer close model: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. `lifecycle.closeEvidenceLoopBoundary.excludedFromCurrentValidationLoop` remains true because close evidence is appended after validation. As of T-0256, reports may also include additive `closeEvidenceWrite` metadata with an idempotency key, duplicate detection, no-op/append/warning action, and superseded evidence ids. Execute mode does not append another close proof when the same task/source/report hash is already recorded. T-0264 adds optional `closeEvidenceWrite.executeRecheck` metadata for execute mode; the command re-reads task evidence immediately before append and no-ops stale same-key execute reports.

`hadara task audit-close --task <id> --json` returns `hadara.task.audit_close.v1` and may include additive `auditVerdict` fields for recorded/current report hashes, source hashes, read-only status, and the post-close verdict. As of T-0256, audit reports may also include `closeEvidenceAudit` with the latest non-superseded close evidence id, superseded close evidence ids, duplicate close evidence count, and a compact idempotency verdict.

`hadara task next --json` returns `hadara.task.next.v1`. It is a read-only recommendation report that prefers the actionable current next step in `docs/AGENT_HANDOFF.md`, then incomplete planned rows in `docs/DEVELOPMENT_SLICES.md`, then `docs/TASK_BOARD.md` fallback rows. Handoff-only recommendations may return `taskId: "TBD"` when the recommended work has no Task Capsule yet; consumers must inspect `sourceKind`, `createCommand`, `taskCapsulePresent`, and `backlog` instead of assuming every recommendation has a concrete task id. The report includes required-reading guidance plus a `createCommand` for capsule creation, and may expose non-primary legacy/open Task Board rows in additive `backlog` metadata. It must not create tasks, update project docs, append evidence, or infer completion.

`hadara evidence from-command` is intentionally not implemented. The design boundary lives in `docs/EVIDENCE_FROM_COMMAND_DESIGN.md`; until a future capsule implements it, shell-executing evidence capture must not be inferred from `evidence add-command`.

`hadara evidence list --task <id> --json` returns `hadara.evidence.list.v1`. Each record exposes the persisted evidence shape plus id-discovery fields: `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, `tags`, and `legacy`. Persisted v2 records use durable `ev:` ids with `idSource: "persisted"` and `idStability: "durable"`; legacy compatibility ids are exposed for inspection and are not the preferred durable reference for `resolves:` or `supersedes:` examples.

`hadara evidence migrate --task <id> --to v2 --json` returns `hadara.evidence.migration_preview.v1`. Dry-run mode is read-only and reports `beforeHash`, planned v2 transforms, skipped records, warning issues, and execution metadata. Execute mode requires `--execute --before-hash <hash>`, rewrites only the selected task's `evidence.jsonl` through temp-file/rename when the hash matches and no blocking skipped records exist, preserves existing v2 records, and must not rewrite `EVIDENCE.md`, other tasks, artifacts, or project docs. Migration is operator-selected per task; agents should not infer broad historical migration as the default next step.

0.3.2 does not define a JSON schema for `hadara evidence rebuild` and does not implement rebuild preview or execute behavior. `evidence.jsonl` remains the canonical append-only evidence source, while `EVIDENCE.md` is a non-canonical human summary. Future rebuild design must define whether a reported `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before exposing preview semantics, and any later execute path must be dry-run-first and before-hash guarded.

Deferred Evidence v2 items remain future candidate scope unless a later contract explicitly adds them: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id. Current consumers should rely on `evidence list` for durable id discovery and `evidence add-command` v1 collect reports with additive v2 metadata.

`hadara run-state resume --json` returns read-only resume guidance. It does not update active-run state, execute commands, call providers, or resume an agent process.

## Task Workflow Command Semantics

The task workflow surface is intentionally staged. `docs/TASK_WORKFLOW_COMMANDS.md` is the operator-facing source for the full loop.

| Command | JSON Schema | Write Policy | `ok` Semantics |
|---|---|---|---|
| `task next --json` | `hadara.task.next.v1` | Read-only. | Recommendation report was generated. |
| `task create <title> [--from <template-id>] --json` | `hadara.task.create.v1` | Writes a Draft Task Capsule and Task Board row only. | Capsule creation succeeded. |
| `task status --task T-XXXX --json` | `hadara.task.workbench.v1` | Read-only. | Report generation succeeded for an existing task; not a readiness gate. |
| `task complete --task T-XXXX --json` | `hadara.task.complete_flow.v1` | Read-only; no execute mode. | Task is fully closed and audited. |
| `handoff update --task T-XXXX ... --json` | `hadara.handoff.update.v1` | Writes `docs/AGENT_HANDOFF.md`. | Handoff update write succeeded. |
| `handoff suggest --task T-XXXX --json` | `hadara.handoff.suggestion.v1` | Read-only; no execute mode. | Handoff suggestion report was generated without blocking issues. |
| `dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` | `hadara.dev.docker_check.v1` | Runs Docker subprocess; writes workspace `dist` only when `--sync-dist` is explicit and the reviewed before-hash guard passes. | Requested Docker validation completed without blocking issues, including any requested dist-sync freshness guard. |
| `evidence list --task T-XXXX [--json]` | `hadara.evidence.list.v1` | Read-only evidence id discovery; no evidence append or rebuild. | Evidence list report was generated. |
| `evidence add-command --task T-XXXX ... [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | `hadara.evidence.collect.v1` evidence append response | Writes command-log evidence only; explicit v2 metadata/tags are additive, result/outcome mismatches fail before append, and an explicit idempotency key returns an existing same-key record without appending duplicates. | Evidence append succeeded or returned the existing keyed record. |
| `proof status --task T-XXXX --json` | `hadara.proof.status.v1` | Read-only. | Proof status was generated; `verdict` and `freshness.status` carry confidence. |
| `proof explain --task T-XXXX --json` | `hadara.proof.explain.v1` | Read-only. | Proof explanation was generated; blockers/warnings and explanation rules describe the verdict. |
| `ci gate --mode advisory|strict [--task T-XXXX] [--allow-empty] --json` | `hadara.ci.gate.v1` | Read-only. | CI gate report was generated; strict mode returns `ok:false` on blockers, advisory mode keeps blockers advisory. An unknown `--task` is a `CI_GATE_TASK_NOT_FOUND` blocker; an empty Done scope is a `CI_GATE_NO_DONE_TASKS` blocker in strict mode unless `--allow-empty` is set (warning otherwise). `scope.allowEmpty` echoes the flag. |
| `context graph [--task T-XXXX] [--include-code] --json` | `hadara.contextGraph.v1` | Read-only projection; no evidence append, validation execution, document patch, cache write, or local-state mutation. `--include-code` additively includes C2 SourceFile/TestFile/FixtureFile/ConfigFile/Symbol nodes and code relation edges. | Context graph report was generated; warning-level degradation is reported in `summary.degraded`/`issues`, while graph or state projection errors return `ok:false`. |
| Internal code index read model | `hadara.codeIndex.v1` | Read-only internal projection used by `context graph --include-code`; no dedicated public `hadara code` command, cache write, source mutation, or validation execution is added. | Schema-valid code index reports can be produced by internal helpers and projected into `hadara.contextGraph.v1` when code inclusion is requested. |
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
| `EVIDENCE_RESULT_OUTCOME_MISMATCH` | `evidence add-command` received incompatible explicit `--result` and `--outcome` values. |
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

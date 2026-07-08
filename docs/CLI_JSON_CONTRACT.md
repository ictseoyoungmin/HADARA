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
- `hadara.ops.status.v1`
- `hadara.protocol.consistency.v1`
- `hadara.protocol.remediation.v1`
- `hadara.protocol.migration.v1`
- `hadara.releaseGate.v1`
- `hadara.context.export.v1` (MCP read-only memory payload)

Agents should treat `issues` as the primary machine-readable failure detail when present.

`hadara version --verbose --json` returns `hadara.runtime.version.v1`. It is a read-only runtime origin report for distinguishing the currently executed CLI entry from other possible builds such as Docker temp-copy `dist`, workspace `dist`, or a globally installed `hadara`. It reports `cliEntry`, `cwd`, `projectRoot`, package version, git branch/head when available, Node version, `build.distMtime`, `build.sourceMtime`, and `build.distLooksStale`.

`hadara protocol doctor --json` defaults to the broad read-only all-scope protocol report. It returns `hadara.protocol.consistency.v1` with `scope: "all"`, aggregating docs, profile, and active-task detail without writing files.

`hadara init [--profile basic|standard|governed] --json` returns `hadara.init.v1`. It creates missing scaffold files without overwriting existing files, reports relative scaffold file actions as `created` or `exists`, and keeps text initialization logs out of JSON output. `hadara init doctor --json`, `init upgrade`, and `init enable-integration` remain follow-up reports under `hadara.init.followup.v1`. `init register-doc` was removed; use `docs register`.

`hadara task upgrade-scaffold --task <id> --json` has been fully removed from public routing; use `protocol doctor` and `protocol remediate`.

`hadara task create <title> [--from <template-id>] --json` returns `hadara.task.create.v1`. It creates a Draft Task Capsule and matching Task Board row, and may include additive `template` metadata when `--from` selects a supported template. Templates prefill capsule docs with expected evidence and out-of-scope boundaries, but they must not mark the task Done, attach evidence, run validation, or close the task. Unknown templates return `TASK_TEMPLATE_UNKNOWN` with `supportedTemplates` and create no capsule. T-0265 adds bounded collision retry for sequential task ids; exhausted directory/Task Board id collisions return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED` instead of silently reusing an id.

`hadara protocol remediate --fix <name> --json` returns `hadara.protocol.remediation.v1` in dry-run mode by default. It previews only allowlisted bounded fixes; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Execute keeps per-action before-hash/existence checks, temp-file writes, rollback-attempt issue reporting, and no broad document rewrite behavior.

`hadara protocol migrate --target 0.3.0 --json` returns `hadara.protocol.migration.v1` in dry-run mode by default. It detects pre-0.3, partial-0.3, and 0.3 scaffold signals, then plans bounded project-scope adoption writes for docs registry, command-surface docs, managed Required Reading markers, and protocol version metadata. `--task <task-id>` limits migration to the selected Task Capsule. Execute mode requires `--execute --before-hash <hash>` from the reviewed dry-run report and rechecks per-action before existence/hash before writing.

`hadara task status --json` returns `hadara.task.status.v1`. It is the read-only next-work selection cockpit used when no Task Capsule is selected. It embeds the internal task-selection projection under `sources.taskSelection`, exposes `recommendations`, and reports `loop.phase: "select-work"` plus one primary next action to create or inspect a capsule. It must not create tasks, update project docs, append evidence, infer completion, or execute the reported action.

`hadara task status --task <id> --json` returns `hadara.task.workbench.v1`. It is the read-only selected-capsule task cockpit and reports task identity, Task Board status from `docs/TASK_BOARD.md`, evidence summary, close state, loop phase, and next actions. The default CLI path is a fast loop cockpit and may skip close-grade readiness/protocol diagnostics; use `hadara task status --task <id> --detail full --json` for the heavier selected-task diagnostic projection, or `hadara task finalize --task <id> --json` for close planning. Its top-level `ok` means the report was generated for an existing task, not that the task is ready or closable; readiness is represented by `state.ready`, `summary.blockers`, `issues`, and `loop.phase`. Task Board fields are split as `task.taskStatus`, `task.taskBoardStatus`, `task.taskBoardPath`, and `task.taskBoardPresent`, close state is split as `state.closeEvidenceFound`, `state.closedValid`, `state.closeState`, and the compatibility alias `state.closed`, and loop guidance is represented by `loop.phase`, `loop.summary`, `loop.primaryNextAction`, and `loop.deprecatedCommands`. It must not append evidence, mutate Task Capsule files, update project docs, run shell commands, call providers, or write task prose.

Removed lifecycle surface: `hadara task complete --task <id> --json` is no longer routed as a public command. Use `hadara task status --task <id> --json` for selected-task guidance. The historical `hadara.task.complete_flow.v1` shape remains implementation history only.

Removed lifecycle surface: `hadara task lifecycle --task <id> --json` is no longer routed as a public command. Use `hadara task status --task <id> --json` for selected-task guidance. The historical `hadara.task.lifecycle.v1` shape remains implementation history only.

`hadara task finalize --task <id> --json` returns `hadara.task.finalize.v1`. It is a read-only reviewed lifecycle plan over finish, ready, close, and audit-close. It also owns close-proof repair planning when existing close evidence is stale, invalid, duplicate, or no longer matches current close-source hashes. It reports ordered steps, step status, command, mode, write boundary, expected write paths, `alreadySatisfied`, and a stable `planHash` for review. `hadara task finalize --task <id> --execute --plan-hash <hash> --json` rechecks the current plan hash before writing, refuses missing or stale hashes, executes phases serially, stops on the first blocker, preserves underlying write boundaries, appends fresh close evidence when the reviewed plan requires repair, and returns `ok:true` only when final audit is `closed-valid`.

When audit evidence exists but close-source hashes drift after close, `task finalize` keeps the task repair-required: the close step becomes required, `primaryNextAction` points to guarded `task finalize --execute --plan-hash <hash>`, and issues include `TASK_FINALIZE_CLOSE_SOURCE_DRIFT_GUIDANCE`. Operators should finish close-source edits before executing that repair plan.

Removed handoff surface: `hadara handoff suggest --task <id> --json` is no longer routed as a public command. Use `hadara task status --task <id> --json` and `hadara task finalize --task <id> --json` for diagnostics, then edit shared handoff docs deliberately before finalize when needed. The historical `hadara.handoff.suggestion.v1` shape remains implementation history only.

`hadara handoff stale-problems --json` has been fully removed from public routing. Use `hadara status --json`, `hadara task status --json`, and deliberate shared handoff edits instead.

`hadara dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` returns `hadara.dev.docker_check.v1`. It is the official Phase 6 Docker validation wrapper for reproducible temp-copy validation. It runs Docker as an external subprocess, creates a run-scoped temp workspace with `.git`, `.hadara`, `node_modules`, and `dist` excluded, runs `npm ci`, then focused tests, a full check, or both. `--sync-dist` must be explicit before the wrapper copies Docker-built `dist` back to the workspace, and T-0263 requires the reviewed `--before-hash` to match the current workspace `dist/cli/main.js` hash before the copy executes. If no pre-sync hash exists, operators must use explicit `--allow-missing-before-hash`; otherwise the report returns `HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED` or `HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH` with `distSync.conflictDetected:true` and no output mutation. Reports include dist sync before/after hashes, `reviewedBeforeHash`, `beforeHashMatched`, `allowMissingBeforeHash`, and conflict metadata. T-0261 clarifies mutation fields: compatibility `execution.projectMutation:false` means no project source mutation, `execution.projectSourceMutation:false` says that directly, and `execution.outputMutation:true` means workspace output such as `dist` was changed. JSON output omits raw subprocess logs, private paths, and environment secrets, and includes an evidence-ready summary.

`hadara release closeout --version <version> --task <id> --json` returns `hadara.releaseCloseout.v1`. It is a read-only release closeout planning report over release readiness, release notes, shared state docs, and the selected release capsule docs. It classifies surfaces as `current`, `stale`, or `missing`, reports expected/matched/missing signals and surface roles, and returns suggested Markdown fragments. It must not write files, append evidence, build artifacts, publish packages, or create GitHub releases.

`hadara package recycle [--execute] [--package <specifier>] [--expected-version <version>] [--include-graph] --json` returns `hadara.packageRecycle.v1`. Dry-run mode is the default and plans the post-publish consumer-path recycle without registry access or install mutation. Execute mode explicitly runs npm registry metadata checks, isolated-prefix package install, installed `hadara version --json`, installed `hadara commands --json` command-surface discovery, lifecycle help, disposable `hadara init`, task read-model smoke, session-start, task finalize dry-run, task-scoped context pack, context slice, and cleanup. Current installed packages use `task status --task <id> --json`; legacy installed packages may fall back to `task lifecycle --task <id> --json` only when the installed command surface does not expose `task.status`. Broad installed `context graph --json` smoke is opt-in via `--include-graph`. Reports must not include raw npm logs, package contents, private paths, environment secrets, publish execution, or release mutation markers.

Fully removed compatibility surfaces: `task next`, `task show`, `task upgrade-scaffold`, `handoff stale-problems`, `handoff suggest`, `evidence collect`, `ops status`, `init register-doc`, `docs archive`, `task finish`, `task ready`, `task close`, `task audit-close`, `task complete`, `task lifecycle`, `write preflight`, `policy check-shell`, `harness replay`, `run`, `run scaffold`, `run-state show`, `run-state resume`, and `package smoke` are no longer routed as public commands and do not have a stable JSON response contract. Consumer migration: read the close audit verdict from `task finalize --task <id> --json` `state` or from `task status --task <id> --detail full --json` `state.closeState`; use `task status --json` for next-work selection, `task status --task <id> --json` for selected-task reads, `validation run` or `evidence add-command` for evidence, `policy preflight-shell` for shell policy reads, `status --json` for project status, `docs register/list/doctor/mark` for docs governance, `smoke package` for package smoke validation, and `protocol remediate` for scaffold remediation.

The historical `hadara.task.finish.v1` report shape remains an internal finalize engine contract. It plans the bounded bookkeeping needed to mark a Task Capsule done: `TASK.md` status and the matching `docs/TASK_BOARD.md` row status/path. Planned writes include `expectedBeforeExists`, `expectedBeforeHash`, and `afterHash` so execute mode can detect stale plans. The report also includes `stateDocs` advisory diagnostics for `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`, with current/pending/missing state and recommendations. Public callers should use `hadara task finalize`, not standalone `task finish`.

As of T-0254, task lifecycle reports expose additive `actor`, `nextActions`, and optional `primaryNextAction` metadata. `nextActions` preserve existing human-friendly fields such as `kind`, `message`, and `command`, and add Phase 6 fields: `summary`, `writeBoundary`, `recommendedActorRole`, `requiresBeforeHash`, and `stalePlanRisk`.

The historical `hadara.task.close.v1` report shape remains an internal finalize engine contract. The report may include additive `lifecycle` guidance that states the three-layer close model: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. `lifecycle.closeEvidenceLoopBoundary.excludedFromCurrentValidationLoop` remains true because close evidence is appended after validation. As of T-0256, reports may also include additive `closeEvidenceWrite` metadata with an idempotency key, duplicate detection, no-op/append/warning action, and superseded evidence ids. Public callers should use guarded `hadara task finalize` execution for close evidence writes.

The historical `hadara.task.audit_close.v1` report shape remains an internal finalize/status audit contract and may include additive `auditVerdict` fields for recorded/current report hashes, source hashes, read-only status, and the post-close verdict. As of T-0256, audit reports may also include `closeEvidenceAudit` with the latest non-superseded close evidence id, superseded close evidence ids, duplicate close evidence count, and a compact idempotency verdict. Public callers should read current audit state from `task finalize --json` or `task status --detail full --json`.

The historical next-work projection is now internal to `task status --json`; public `hadara task next --json` is no longer routed.

`hadara evidence from-command` is intentionally not implemented. The design boundary lives in `docs/EVIDENCE_FROM_COMMAND_DESIGN.md`; until a future capsule implements it, shell-executing evidence capture must not be inferred from `evidence add-command`.

`hadara evidence list --task <id> --json` returns `hadara.evidence.list.v1`. Each record exposes the persisted evidence shape plus id-discovery fields: `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, `tags`, and `legacy`. Persisted v2 records use durable `ev:` ids with `idSource: "persisted"` and `idStability: "durable"`; legacy compatibility ids are exposed for inspection and are not the preferred durable reference for `resolves:` or `supersedes:` examples.

`hadara evidence migrate --task <id> --to v2 --json` returns `hadara.evidence.migration_preview.v1`. Dry-run mode is read-only and reports `beforeHash`, planned v2 transforms, skipped records, warning issues, and execution metadata. Execute mode requires `--execute --before-hash <hash>`, rewrites only the selected task's `evidence.jsonl` through temp-file/rename when the hash matches and no blocking skipped records exist, preserves existing v2 records, and must not rewrite `EVIDENCE.md`, other tasks, artifacts, or project docs. Migration is operator-selected per task; agents should not infer broad historical migration as the default next step.

0.3.2 does not define a JSON schema for `hadara evidence rebuild` and does not implement rebuild preview or execute behavior. `evidence.jsonl` remains the canonical append-only evidence source, while `EVIDENCE.md` is a non-canonical human summary. Future rebuild design must define whether a reported `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before exposing preview semantics, and any later execute path must be dry-run-first and before-hash guarded.

Deferred Evidence v2 items remain future candidate scope unless a later contract explicitly adds them: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id. Current consumers should rely on `evidence list` for durable id discovery and `evidence add-command` v1 collect reports with additive v2 metadata.

The historical active-run projection/resume reports remain internal service and MCP read-model shapes. Public `hadara run-state show/resume` is no longer routed; use `hadara status --json`.

## Task Workflow Command Semantics

The task workflow surface is intentionally staged. `docs/TASK_WORKFLOW_COMMANDS.md` is the operator-facing source for the full loop.

| Command | JSON Schema | Write Policy | `ok` Semantics |
|---|---|---|---|
| `status --json` | `hadara.ops.status.v1` | Read-only fast project-status snapshot; skips debt, known-problem, broad capsule, and state-consistency scans by default. | Project status report was generated. Missing source docs are warning issues, not command failure. |
| `status --detail full --json` | `hadara.ops.status.v1` | Read-only full operations-status snapshot including debt, known problems, capsule status counts, and state-consistency advisory. | Full operations status report was generated. |
| `status --summary-json` | `hadara.ops.statusSummary.v1` | Read-only compact project-status snapshot. | Summary status report was generated. |
| `status --state-only --json` | `hadara.ops.statusState.v1` | Read-only state-consistency advisory; no lifecycle writes. | State advisory report was generated; `ok:true` does not mean `consistent:true`. |
| `task status --json` | `hadara.task.status.v1` | Read-only. | Selection report was generated; not that a capsule exists. |
| `task create <title> [--from <template-id>] --json` | `hadara.task.create.v1` | Writes a Draft Task Capsule and Task Board row only. | Capsule creation succeeded. |
| `task status --task T-XXXX --json` | `hadara.task.workbench.v1` | Read-only. | Report generation succeeded for an existing task; not a readiness gate. |
| `task finalize --task T-XXXX --json` | `hadara.task.finalize.v1` | Read-only reviewed lifecycle and close-proof repair plan by default; guarded execute requires matching `--plan-hash`. | The plan is satisfied or executable without current blockers, or guarded execute reaches `closed-valid`. |
| `dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` | `hadara.dev.docker_check.v1` | Runs Docker subprocess; writes workspace `dist` only when `--sync-dist` is explicit and the reviewed before-hash guard passes. | Requested Docker validation completed without blocking issues, including any requested dist-sync freshness guard. |
| `evidence list --task T-XXXX [--json]` | `hadara.evidence.list.v1` | Read-only evidence id discovery; no evidence append or rebuild. | Evidence list report was generated. |
| `evidence add-command --task T-XXXX ... [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | `hadara.evidence.collect.v1` evidence append response | Writes command-log evidence only; explicit v2 metadata/tags are additive, result/outcome mismatches fail before append, and an explicit idempotency key returns an existing same-key record without appending duplicates. | Evidence append succeeded or returned the existing keyed record. |
| `context graph [--task T-XXXX] [--include-code] --json` | `hadara.contextGraph.v1` | Read-only projection; no evidence append, validation execution, document patch, cache write, or local-state mutation. `--include-code` additively includes C2 SourceFile/TestFile/FixtureFile/ConfigFile/Symbol nodes and code relation edges, including code-index budget/degraded metadata in the code-index state source. | Context graph report was generated; warning-level degradation is reported in `summary.degraded`/`issues`, while graph or state projection errors return `ok:false`. |
| `context pack --task T-XXXX [--include-code] [--budget <tokens>] [--max-items <count>] [--max-read-first <count>] --json` | `hadara.contextPack.v1` | Read-only projection; no evidence append, validation execution, document patch, cache write, source mutation, or C4 slicing. `--include-code` builds the underlying graph with C2 code projections; `--budget` records `targetTokens`, while item caps bound output selection. `readFirst`/`readIfNeeded` items may include graph-relevant non-sliceable paths and expose additive `sourceAccess.rawSlice`; raw-sliceable items prefer the current item file hash in `sourceHash`; only `sliceCandidates` and additive `agentActions` should be treated as raw `context slice` command suggestions. Explicit-range slice candidates use bounded source windows when only a single source line is known and preserve real multi-line metadata ranges. `agentActions` are read-only, prioritized, and expose structured `commandArgs` where shell-safe argument arrays are available. | Context pack report was generated. Missing task or state projection errors return `ok:false`; budget/code-index degradation is explicit in `issues` and `sourceSummary.degraded`. |
| `session start [--task T-XXXX] [--include-code] [--budget <tokens>] [--max-items <count>] [--max-read-first <count>] [--live] --json` | `hadara.sessionStart.v1` | Read-only C5 startup packet; no evidence append, validation execution, document patch, cache write, source mutation, raw slice read, or hidden background work. Default mode may consume proven-fresh source-manifest, graph-core, and code-index cache read-only; when warm freshness cannot be proven without broad scanning, it returns a bounded no-live context-pack envelope. `--live` explicitly permits the underlying context-pack graph read. Guidance includes additive `primaryAction`, `whyThisNow`, `avoidForNow`, and `nextCommandArgs`; with a task id, the primary action is the selected-task status/finalize path. | Session start report was generated. Missing task errors return `ok:false`; default bounded fallback reports degradation explicitly in `issues`, `summary.degraded`, and `sourceSummary.degraded`, while warm hits report cache metadata such as `graph-core` or `graph-core+code-index`. |
| `context cache status --json` | `hadara.context.cacheStatus.v1` | Read-only cache-status projection; no cache creation, warm execution, evidence append, validation execution, document patch, source mutation, or graph/code-index consumption. It performs metadata-first source discovery and compares it with any cached source manifest. | Cache status report was generated. Missing cache is an `ok:true` miss; stale/corrupt states are explicit in `summary.mode`, `manifest.status`, and `issues`. |
| `context cache warm [--execute] --json` | `hadara.context.cacheWarm.v1` | Dry-run by default. `--execute` writes only the local source-manifest cache at `.hadara/local/cache/context/source-manifest.json` when missing, stale, corrupt, or schema-mismatched; no graph/code-index/context-pack/context-slice cache writes, evidence append, validation execution, document patch, or source mutation. | Warm report was generated. Dry-run reports planned writes without mutating the workspace; execute either refreshes the source-manifest cache or reports a fresh no-op. |
| `package recycle [--execute] [--package <specifier>] [--expected-version <version>] [--include-graph] --json` | `hadara.packageRecycle.v1` | Dry-run by default. Execute mode runs npm registry reads, isolated-prefix install, installed command-surface discovery, current-or-legacy installed CLI smokes, and temp cleanup; it never publishes or mutates release targets. Broad context graph smoke is opt-in via `--include-graph`. | Recycle report was generated; execute returns `ok:true` only when registry metadata, installed version, command-surface/init/task/session/finalize/context smokes, and cleanup pass. |
| Internal code index read model | `hadara.codeIndex.v1` | Read-only internal projection used by `context graph --include-code`; default file/byte/single-file budgets can produce explicit degraded partial output, but no dedicated public `hadara code` command, cache write, source mutation, or validation execution is added. | Schema-valid code index reports can be produced by internal helpers and projected into `hadara.contextGraph.v1` when code inclusion is requested. |

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

The planned terminal TUI may use CLI JSON reports as a mockup or compatibility data source, but the integrated production TUI should prefer shared TypeScript read-model services so it does not depend on subprocess CLI transport for normal rendering. If a CLI adapter remains, it must call current read-only JSON commands; the removed `hadara write preflight ... --json` route is no longer public routing.

## Planned v1.0 JSON Surfaces

The following schemas are planned or partial and should not be treated as stable until their Task Capsules complete:

- `hadara.redaction.report.v1`

Detailed target schemas live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

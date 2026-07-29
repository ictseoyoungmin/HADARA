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

Phase 6.1 workflow-compression commands use optional actor CLI option names consistently: task close and dev docker-check accept `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id`. Existing defaults remain valid when the options are absent. Future reviewed-plan commands should use `--idempotency-key` where a command contract accepts caller-supplied idempotency metadata.

T-0254 adds this common metadata to task close reports as additive report fields. Existing command invocations still do not accept actor options; reports use the default local operator actor context until later command-specific adoption.

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

`hadara init [--preset minimal|standard|governed] --json` returns `hadara.init.report.v1` with a deterministic zero-write plan. Apply requires `--execute --plan-hash <hash>`. Re-running base init without configuration arguments is a no-op on a complete Init v1 project; explicit `--preset` or `--profile` is rejected once initialized. `hadara init upgrade --json` uses the same report schema and only plans missing core artifacts, HADARA-managed template/block refreshes, read-map regeneration, and the runtime-local ignore rule. It never changes presets, features, document packs, configuration, the document registry, or optional user-authored documents. `hadara init doctor --json` and `init enable-integration` remain compatibility follow-up reports under `hadara.init.followup.v1`. `init register-doc` was removed; use `docs register`.

`hadara task upgrade-scaffold --task <id> --json` has been fully removed from public routing; use `protocol doctor` and `protocol remediate`.

`hadara task create <title> [--target <namespace:id>]... [--from <template-id>] --json` returns `hadara.task.create.v1`. It creates a Draft Task Capsule and matching Task Board row. Init v1 Boards default targets to `project`; repeated `--target` values preserve caller order and accept `project`, `release:<id>`, `milestone:<id>`, `component:<id>`, or `task:<id>`. The report may include additive `template` metadata when `--from` selects a supported template. Templates prefill capsule docs with expected evidence and out-of-scope boundaries, but they must not mark the task Done, attach evidence, run validation, or close the task. Unknown templates return `TASK_TEMPLATE_UNKNOWN` with `supportedTemplates` and create no capsule. T-0265 adds bounded collision retry for sequential task ids; exhausted directory/Task Board id collisions return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED` instead of silently reusing an id.

`hadara protocol remediate --fix <name> --json` returns `hadara.protocol.remediation.v1` in dry-run mode by default. It previews only allowlisted bounded fixes; planned writes expose `summary.beforeHash`, and execute mode requires `--execute --before-hash <hash>` with the reviewed dry-run hash before applying writes. Execute keeps per-action before-hash/existence checks, temp-file writes, rollback-attempt issue reporting, and no broad document rewrite behavior.

`hadara protocol migrate --target 0.3.0 --json` returns `hadara.protocol.migration.v1` in dry-run mode by default. It detects pre-0.3, partial-0.3, and 0.3 scaffold signals, then plans bounded project-scope adoption writes for docs registry, command-surface docs, managed Required Reading markers, and protocol version metadata. `--task <task-id>` limits migration to the selected Task Capsule. Execute mode requires `--execute --before-hash <hash>` from the reviewed dry-run report and rechecks per-action before existence/hash before writing.

`hadara status --json` is a deprecated `0.5.x` compatibility alias for `hadara task status --json`. The default alias invokes the same evaluator and emits the same compact `hadara.task.status.summary.v1` projection; it has no independent lifecycle phase, readiness, or next-action logic. Explicit `--detail full`, `--compat v1`, `--summary-json`, and `--state-only` diagnostics remain temporarily available for legacy consumers. New agents and integrations must use `hadara task status`.

`hadara task status --json` is the single read-only lifecycle ingress. Its default `hadara.task.status.summary.v1` projection contains the selected task or recommendation, phase/readiness, one next action, and a `focus` block with only the documents to read and concrete edit points. `--detail full --json` returns the complete `hadara.task.status.v2` or `hadara.taskSelection.status.v2` diagnostic report. It must not create tasks, update project docs, append evidence, infer completion, or execute the reported action. `--task <id>` explicitly inspects a particular active, inactive, or completed capsule. Legacy `hadara.task.status.v1` selection output is available through `hadara task status --compat v1 --json`.

`hadara task status --task <id> --json` returns compact `hadara.task.status.summary.v1`. It reports task identity, phase, health, readiness, counts, one primary next action, focused reads/edits, and at most five compact issues. The default CLI path is fast and may skip close-grade readiness/protocol diagnostics. Use `hadara task status --task <id> --detail full --json` for the complete `hadara.task.status.v2` projection, or `hadara task close --task <id> --dry-run --json` for close planning. The compatibility `hadara.task.workbench.v1` report remains available through `hadara task status --task <id> --compat v1 --json`.

`hadara task close --task <id> --json` returns compact `hadara.task.close.summary.v1` and suppresses phase-by-phase progress. It contains the close state, terminal/plan state, plan hash, write summary, next action, compact issues, and a `detailCommand`; proof-last semantics are unchanged. `hadara task close --task <id> --detail full --json` returns the complete `hadara.task.close.v3` transaction, including locks, operation state, close-plan source, and progress diagnostics. Dry-run and reviewed-plan forms support the same detail switch.

Removed lifecycle surface: `hadara task complete --task <id> --json` is no longer routed as a public command. Use `hadara task status --task <id> --json` for selected-task guidance. The historical `hadara.task.complete_flow.v1` shape remains implementation history only.

`hadara task close --task <id> --detail full --json` exposes `source.closePlan` as internal diagnostic metadata for the close plan used by `task close`.

When audit evidence exists but close-source hashes drift after close, the internal close-plan source keeps the task repair-required: the close step becomes required, internal diagnostic actions may mention recovery metadata, and issues include `TASK_CLOSE_PLAN_CLOSE_SOURCE_DRIFT_GUIDANCE`. Public callers should follow the top-level `task close` recovery action, finish close-source edits before executing the repair plan, and treat `source.closePlan` actions as diagnostic internal metadata.

Removed handoff surface: `hadara handoff suggest --task <id> --json` is no longer routed as a public command. Use `hadara task status --task <id> --json` for selected-task guidance and `hadara task close --task <id> --dry-run --json` for close diagnostics, then edit shared handoff docs deliberately before task close when needed. The historical `hadara.handoff.suggestion.v1` shape remains implementation history only.

`hadara handoff stale-problems --json` has been fully removed from public routing. Use `hadara task status --json` and deliberate shared handoff edits instead.

`hadara dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` returns `hadara.dev.docker_check.v1`. It is the official Phase 6 Docker validation wrapper for reproducible temp-copy validation. It runs Docker as an external subprocess, creates a run-scoped temp workspace with `.git`, `.hadara`, `node_modules`, and `dist` excluded, runs `npm ci`, then focused tests, a full check, or both. `--sync-dist` must be explicit before the wrapper copies Docker-built `dist` back to the workspace, and T-0263 requires the reviewed `--before-hash` to match the current workspace `dist/cli/main.js` hash before the copy executes. If no pre-sync hash exists, operators must use explicit `--allow-missing-before-hash`; otherwise the report returns `HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED` or `HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH` with `distSync.conflictDetected:true` and no output mutation. Reports include dist sync before/after hashes, `reviewedBeforeHash`, `beforeHashMatched`, `allowMissingBeforeHash`, and conflict metadata. T-0261 clarifies mutation fields: compatibility `execution.projectMutation:false` means no project source mutation, `execution.projectSourceMutation:false` says that directly, and `execution.outputMutation:true` means workspace output such as `dist` was changed. JSON output omits raw subprocess logs, private paths, and environment secrets, and includes an evidence-ready summary.

`hadara release closeout --version <version> --task <id> --json` returns `hadara.releaseCloseout.v1`. It is a read-only release closeout planning report over release readiness, release notes, optional shared docs, and the selected release capsule docs. It classifies surfaces as `current`, `stale`, or `missing`, reports expected/matched/missing signals and surface roles, and returns suggested Markdown fragments. It must not write files, append evidence, build artifacts, publish packages, or create GitHub releases.

`hadara release artifact --execute [--source-root <dir>] [--evidence-root <dir>] [--output <dir>] [--journal <file>] --json` returns `hadara.releaseArtifact.v1`. `sourceRoot` is the clean source tree used for package staging and `npm pack`; `evidenceRoot` is the project where evidence may later be attached. Reports expose `rootRoles`, source git metadata when available, and `selfInvalidationRisk`. If `--attach-evidence` is requested while `sourceRoot == evidenceRoot` and the source requires a clean git preflight, the command fail-closes with `RELEASE_ARTIFACT_SELF_INVALIDATION_RISK` unless an explicit override is supplied. `--journal <file>` writes the reduced result JSON outside the source tree first; `--from-journal <file> --evidence-root <dir> --attach-evidence --task <id>` can later attach that report without rebuilding artifacts.

`node --import tsx tools/dev-surfaces.ts smoke package [--dry-run|--execute] [--from <tarball|dir>] [--source-root <dir>] [--evidence-root <dir>] [--smoke-project-root <dir>] --json` returns `hadara.packageSmoke.v1`. Reports expose `rootRoles.sourceRoot`, `rootRoles.evidenceRoot`, and `rootRoles.smokeProjectRoot`. `sourceRoot` is the checkout/package source used for `npm pack`; `evidenceRoot` is the project that receives attached evidence; `smokeProjectRoot` is the disposable consumer project used by installed smoke subprocesses. Compatibility `--project` still aliases source and evidence roots and reports a warning when explicit root roles are omitted. Installed smoke subprocesses must not inherit source `HADARA_PROJECT_ROOT`. npm package smoke uses per-step timeout accounting with default/effective seconds and `timeoutStepIds`; the default npm timeout is 300 seconds unless `--timeout` is supplied.

`hadara package recycle [--execute] [--package <specifier>] [--expected-version <version>] [--source-root <dir>] [--evidence-root <dir>] [--smoke-project-root <dir>] [--include-graph] --json` returns `hadara.packageRecycle.v1`. Dry-run mode is the default and plans the post-publish consumer-path recycle without registry access or install mutation. Reports expose `rootRoles.sourceRoot`, `rootRoles.evidenceRoot`, and `rootRoles.smokeProjectRoot`; compatibility `--project` aliases source and evidence roots with a warning. Execute mode explicitly runs npm registry metadata checks, isolated-prefix package install, installed `hadara version --json`, installed `hadara commands --json` command-surface discovery, lifecycle help, disposable `hadara init`, project status ingress, task read-model smoke, public task-close dry-run smoke, context slice, and cleanup inside `smokeProjectRoot` without inherited source `HADARA_PROJECT_ROOT`. Current installed packages use `status --json`, `task status --task <id> --json`, and `task close --task <id> --dry-run --json`; legacy installed packages may fall back to `task lifecycle --task <id> --json` only when the installed command surface does not expose the current routes. Broad installed `context graph --json` smoke is opt-in via `--include-graph`. Reports include per-step timeout policy and identify slow timeout steps through `timeoutStepIds`; the default recycle timeout is 300 seconds unless `--timeout` is supplied. Reports must not include raw npm logs, package contents, private paths, environment secrets, publish execution, or release mutation markers.

Compatibility surfaces outside the current public command set do not have stable JSON response contracts. Consumer migration: read the close audit verdict from public `task close --task <id> --json`/`--dry-run --json` or from `task status --task <id> --detail full --json` `state.closeState`; use `task status --json` for next-work selection, `task status --task <id> --json` for selected-task reads, `validation run` or `evidence add-command` for evidence, `policy preflight-shell` for shell policy reads, `status --json` for project status, `docs register/list/doctor/mark` for docs governance, repo-local `node --import tsx tools/dev-surfaces.ts smoke package` for package smoke validation, and `protocol remediate` for scaffold remediation.

As of T-0254, task lifecycle reports expose additive `actor`, `nextActions`, and optional `primaryNextAction` metadata. `nextActions` preserve existing human-friendly fields such as `kind`, `message`, and `command`, and add Phase 6 fields: `summary`, `writeBoundary`, `recommendedActorRole`, `requiresBeforeHash`, and `stalePlanRisk`.

The historical `hadara.task.close.v1` report shape remains an internal finalize engine contract. The report may include additive `lifecycle` guidance that states the three-layer close model: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. `lifecycle.closeEvidenceLoopBoundary.excludedFromCurrentValidationLoop` remains true because close evidence is appended after validation. As of T-0256, reports may also include additive `closeEvidenceWrite` metadata with an idempotency key, duplicate detection, no-op/append/warning action, and superseded evidence ids. Public callers should use `hadara task close --task <id> --json`; `hadara.task.close.v1` is historical/internal source metadata.

The historical `hadara.task.audit_close.v1` report shape remains an internal finalize/status audit contract and may include additive `auditVerdict` fields for recorded/current report hashes, source hashes, read-only status, and the post-close verdict. As of T-0256, audit reports may also include `closeEvidenceAudit` with the latest non-superseded close evidence id, superseded close evidence ids, duplicate close evidence count, and a compact idempotency verdict. Public callers should read current audit state from `task close --task <id> --dry-run --json`, `task close --task <id> --json`, or `task status --task <id> --detail full --json`.

The historical next-work projection is now internal to `task status --json`; public `hadara task next --json` is no longer routed.

`hadara evidence from-command` is intentionally not implemented. The design boundary lives in `docs/archive/retired-2026-07-26/EVIDENCE_FROM_COMMAND_DESIGN.md`; until a future capsule implements it, shell-executing evidence capture must not be inferred from `evidence add-command`.

`hadara validation run ... --json` returns `hadara.validation.run.v2`. v2 exposes `argvHash`, redacted bounded `argvPreview`, `argvRedacted`, `argvPreviewLimitBytes`, `argvPreviewTruncated`, and `argvOmittedBytes`; it does not expose legacy raw `argv` unless the caller explicitly opts into `rawArgv` with `--show-raw-argv`. Legacy consumers that still require raw `argv` must call `hadara validation run --compat v1 --json`, which returns additive `hadara.validation.run.v1` compatibility output: it retains raw `argv` while also carrying v2 argv metadata, and is not a byte-for-byte historical exact-key projection. `status` is the controlled `Passed|Failed|Blocked` token and `detail` is a bounded human explanation; consumers must not parse detail text to infer state. `result` remains a deprecated compatibility alias for `status`. New Task Capsules use `Check | Gate | Status | Detail | Evidence`; legacy Result tables remain readable and writable without forced migration.

`hadara evidence list --task <id> --json` returns `hadara.evidence.list.v1`. Each record exposes the persisted evidence shape plus id-discovery fields: `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, `tags`, and `legacy`. Persisted v2 records use durable `ev:` ids with `idSource: "persisted"` and `idStability: "durable"`; legacy compatibility ids are exposed for inspection and are not the preferred durable reference for `resolves:` or `supersedes:` examples.

`hadara evidence migrate --task <id> --to v2 --json` returns `hadara.evidence.migration_preview.v1`. Dry-run mode is read-only and reports `beforeHash`, planned v2 transforms, skipped records, warning issues, and execution metadata. Execute mode requires `--execute --before-hash <hash>`, rewrites only the selected task's `evidence.jsonl` through temp-file/rename when the hash matches and no blocking skipped records exist, preserves existing v2 records, and must not rewrite `EVIDENCE.md`, other tasks, artifacts, or project docs. Migration is operator-selected per task; agents should not infer broad historical migration as the default next step.

0.3.2 does not define a JSON schema for `hadara evidence rebuild` and does not implement rebuild preview or execute behavior. `evidence.jsonl` remains the canonical append-only evidence source, while `EVIDENCE.md` is a non-canonical human summary. Future rebuild design must define whether a reported `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before exposing preview semantics, and any later execute path must be dry-run-first and before-hash guarded.

Deferred Evidence v2 items remain future candidate scope unless a later contract explicitly adds them: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id. Current consumers should rely on `evidence list` for durable id discovery and `evidence add-command` v1 collect reports with additive v2 metadata.

The historical active-run projection/resume reports remain internal service and MCP read-model shapes. Public `hadara run-state show/resume` is no longer routed; use `hadara task status --json`.

## Task Workflow Command Semantics

The task workflow surface is intentionally staged. `docs/TASK_WORKFLOW_COMMANDS.md` is the operator-facing source for the full loop.

| Command | JSON Schema | Write Policy | `ok` Semantics |
|---|---|---|---|
| `status --json` | `hadara.task.status.summary.v1` | Deprecated 0.5.x alias for compact adaptive `task status`; no independent evaluator. | The delegated task-status report was generated. |
| `status --detail full --json` | `hadara.taskSelection.status.v2` or `hadara.task.status.v2` | Deprecated alias for adaptive full-detail `task status`. Legacy operations diagnostics remain available with `--compat v1`. | The delegated full-detail task-status report was generated. |
| `status --summary-json` | `hadara.ops.statusSummary.v1` | Read-only compact project-status snapshot. | Summary status report was generated. |
| `status --state-only --json` | `hadara.ops.statusState.v1` | Read-only state-consistency advisory; no lifecycle writes. | State advisory report was generated; `ok:true` does not mean `consistent:true`. |
| `docs doctor [--scope <scope>] --json` | `hadara.docs.doctor.v1` | Read-only registry, required-reading, and active-guidance currentness diagnostics. Existing `health: healthy|warning|drifted` remains compatibility metadata; additive `currentnessVerdict: clean|warning|drifted` is the explicit product verdict, and `semanticDriftIssues` counts stale command/version guidance drift. | `ok:true` means no error-severity doctor issue; it does not imply `currentnessVerdict:clean`. |
| `task status --json` | `hadara.task.status.summary.v1` | Compact adaptive lifecycle ingress with focused reads/edits and one next action. Use `--detail full` for the complete v2 report. | Status report was generated; not that work is ready to close. |
| `task create <title> [--target <namespace:id>]... [--from <template-id>] --json` | `hadara.task.create.v1` | Writes a Draft Task Capsule and Task Board row only. | Capsule creation succeeded. |
| `task status --task T-XXXX --json` | `hadara.task.status.summary.v1` | Read-only compact selected-task cockpit with focused reads/edits. Use `--detail full` for `hadara.task.status.v2`. | Report generation succeeded for an existing task; not a readiness gate. |
| `task close --task T-XXXX --json` | `hadara.task.close.summary.v1` | Compact result of the default proof-last close transaction. Use `--detail full` for `hadara.task.close.v3`. | Final audit reaches `closed-valid`; blocked reports include recovery guidance and use task-style failure exit 6. |
| `dev docker-check [--focused <test...>] [--full] [--sync-dist --before-hash <hash>] --json` | `hadara.dev.docker_check.v1` | Runs Docker subprocess; writes workspace `dist` only when `--sync-dist` is explicit and the reviewed before-hash guard passes. | Requested Docker validation completed without blocking issues, including any requested dist-sync freshness guard. |
| `release artifact --execute [--source-root <dir>] [--evidence-root <dir>] [--output <dir>] [--journal <file>] --json` | `hadara.releaseArtifact.v1` | Builds tarball/checksum/manifest from sourceRoot, records a journal JSON before evidence attach, reports self-invalidation risk, and fail-closes same-root clean-preflight evidence writes unless explicitly overridden. | Artifact report was generated; `ok:true` only when package staging, pack, checksum, manifest, package-content verification, and self-invalidation guard pass. |
| `evidence list --task T-XXXX [--json]` | `hadara.evidence.list.v1` | Read-only evidence id discovery; no evidence append or rebuild. | Evidence list report was generated. |
| `evidence add-command --task T-XXXX ... [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | `hadara.evidence.collect.v1` evidence append response | Writes command-log evidence only; explicit v2 metadata/tags are additive, result/outcome mismatches fail before append, and an explicit idempotency key returns an existing same-key record without appending duplicates. The response includes `evidence.appendLock` diagnostics for the task-scoped append lock; these diagnostics are not persisted into the canonical evidence record. | Evidence append succeeded or returned the existing keyed record. |
| `context graph [--task T-XXXX] [--include-code] --json` | `hadara.contextGraph.v1` | Read-only projection; no evidence append, validation execution, document patch, cache write, or local-state mutation. `--include-code` additively includes C2 SourceFile/TestFile/FixtureFile/ConfigFile/Symbol nodes and code relation edges, including code-index budget/degraded metadata in the code-index state source. | Context graph report was generated; warning-level degradation is reported in `summary.degraded`/`issues`, while graph or state projection errors return `ok:false`. |
| Removed: `context pack ... --json` | `hadara.contextPack.v1` | Public routing was removed in 0.5.0. Use `task status --json`, `task status --task T-XXXX --json`, and docs/read-map surfaces for normal task ingress and file routing; use `context graph --task T-XXXX --json` only for explicit graph diagnostics. | Historical/internal implementation schema only; no public command contract. |
| Removed: `session start ... --json` | `hadara.sessionStart.v1` | Public routing was removed in 0.5.0. Use `status --json` for project/session ingress, `task status --task T-XXXX --json` for selected-task guidance, and docs/read-map surfaces for file-routing context. | Historical implementation schema only; no public command contract. |
| `context cache status --json` | `hadara.context.cacheStatus.v1` | Read-only cache-status projection; no cache creation, warm execution, evidence append, validation execution, document patch, source mutation, or graph/code-index consumption. It performs metadata-first source discovery and compares it with any cached source manifest. | Cache status report was generated. Missing cache is an `ok:true` miss; stale/corrupt states are explicit in `summary.mode`, `manifest.status`, and `issues`. |
| `context cache warm [--execute] --json` | `hadara.context.cacheWarm.v1` | Dry-run by default. `--execute` writes only the local source-manifest cache at `.hadara/local/cache/context/source-manifest.json` when missing, stale, corrupt, or schema-mismatched; no graph/code-index/context-pack/context-slice cache writes, evidence append, validation execution, document patch, or source mutation. | Warm report was generated. Dry-run reports planned writes without mutating the workspace; execute either refreshes the source-manifest cache or reports a fresh no-op. |
| `node --import tsx tools/dev-surfaces.ts smoke package [--dry-run\|--execute] [--from <tarball\|dir>] [--source-root <dir>] [--evidence-root <dir>] [--smoke-project-root <dir>] --json` | `hadara.packageSmoke.v1` | Dry-run by default. Reports source/evidence/smoke project root roles, per-step timeout policy, packs from sourceRoot, attaches evidence to evidenceRoot, and executes installed smoke inside smokeProjectRoot without inherited source `HADARA_PROJECT_ROOT`. | Package smoke report was generated; execute returns `ok:true` only when package build/install/init/status smoke and cleanup pass. Timeout failures identify the step id. |
| `package recycle [--execute] [--package <specifier>] [--expected-version <version>] [--source-root <dir>] [--evidence-root <dir>] [--smoke-project-root <dir>] [--include-graph] --json` | `hadara.packageRecycle.v1` | Dry-run by default. Execute mode runs npm registry reads, isolated-prefix install, installed command-surface discovery, current-or-legacy installed CLI smokes inside smokeProjectRoot, per-step timeout reporting, and temp cleanup; it never publishes or mutates release targets. Broad context graph smoke is opt-in via `--include-graph`. | Recycle report was generated; execute returns `ok:true` only when registry metadata, installed version, command-surface/init/status/task-close/context smokes, and cleanup pass. Timeout failures identify the step id. |
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

Detailed target schemas live in `docs/archive/retired-2026-07-26/V1_0_IMPLEMENTATION_SCHEMAS.md`.

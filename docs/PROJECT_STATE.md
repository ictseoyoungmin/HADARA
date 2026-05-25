# PROJECT_STATE

## Product

HADARA - Portable Agentic Development Workbench

## Current Phase

Phase 0 / Phase 1 boundary.

This repository is a bootstrap skeleton. Development should follow the HADARA protocol before full HADARA automation exists.

## Current Status

- Skeleton repository exists.
- Seed CLI exists.
- MockProvider contract exists.
- ScriptedProvider exists for deterministic harness/replay provider behavior.
- Provider fallback executor exists for deterministic chat fallback orchestration.
- Fake shell preflight harness exists for deterministic tool observations without real shell execution.
- Minimal deterministic agent loop harness exists for ScriptedProvider responses plus fake shell observations.
- Task Capsule creation exists.
- Evidence append writes Markdown summaries, `evidence.jsonl` indexes, and managed public artifact copies.
- Handoff update exists.
- AGENTS.md and IMPLEMENTATION_SOP now capture reusable HADARA session protocol rules.
- Hermes/Agent Harness context export exists as a seed command.
- Doctor CLI JSON output exists as `hadara doctor --json`.
- Task list/show CLI JSON output exists as `hadara task list --json` and `hadara task show <task-id> --json`.
- Policy check CLI JSON output exists as `hadara policy check-shell <command> --json`.
- Policy execution preflight exists as `hadara policy preflight-shell <command> --json`.
- Hermes detect/export CLI JSON output exists as `hadara hermes detect --json` and `hadara hermes export-context --json`.
- Evidence collect CLI JSON output exists as `hadara evidence collect --json`.
- Harness Task Capsule validation exists as `hadara harness validate --task <id> --json`.
- Harness Task Capsule validation enforces core Markdown format markers for Task Capsule continuity.
- Harness Task Capsule validation requires `evidence.jsonl` so completed work cannot miss the evidence index.
- Harness replay skeleton exists as `hadara harness replay <scenario.jsonl> --json`.
- Config/path resolver has realpath containment, environment priority, Windows path normalization, and project data boundary tests.
- Policy evaluator has a minimal tokenizer, safe command allowlist, destructive command denial tests, and shell execution preflight.
- Tool runtime work has started with fake shell observations gated by policy preflight.
- Agent loop work has started with bounded deterministic `hadara run --script ... --fake-shell-fixtures ... --json`.
- Workspace file boundary hardening is complete with a shared realpath resolver applied to evidence artifact copy, harness replay, and deterministic run file inputs.
- Evidence artifact redaction registry exists: public artifacts must be UTF-8 text and pass severity-threshold high-risk secret-pattern scanning before committed copy, with `hadara.redaction.report.v1` findings available from the core redaction service and safe public artifact policy diagnostics available as pattern ids, severities, counts, and byte counts.
- Evidence list read model exists as `hadara.evidence.list.v1`, with a shared report builder used by `hadara evidence list --json` and read-only MCP `hadara.evidence.list`; malformed JSONL lines degrade to warnings, parsed records are normalized before output, private evidence paths are stripped, and taskId mismatches are dropped with warnings.
- Private evidence manifests exist for readable private evidence source artifacts: raw private bytes are copied only to the ignored private portable store, `hadara.privateEvidence.v1` manifests record SHA-256 hashes, byte counts, retention, and deferred encryption metadata, and manifest writes are privately audited. Committed Task Capsule files and context export exclude private raw content, source paths, and private store paths.
- Context export read model exists as `hadara.context.export.v1`; read-only MCP `hadara.context.export` returns an in-memory payload with `contextPath: null` and does not write `.hadara/context/HADARA_CONTEXT.md`, while CLI `hadara hermes export-context` remains the file-writing path. Context export includes `docs/IMPLEMENTATION_SOP.md` as the authoritative workflow source, and `summaryOnly` currently returns a warning instead of silently pretending to summarize.
- Tools list read model exists as `hadara.tools.list.v1`; `hadara tools list --json` and read-only MCP `hadara.tools.list` report the current CLI help surface, read-only MCP tools, opt-in evidence attach status, `availability`/`risk` metadata, and disabled shell/provider/release/broad-write MCP surfaces from a neutral capability registry.
- Strict CLI argument helper parsing exists for string, required string, integer, and boolean flag options.
- Agent loop evidence attachment exists: deterministic fake-shell observations from `hadara run --task ...` can be attached as managed public command-log artifacts and reported in run JSON output.
- ScriptedProvider now consumes scripted steps in order for deterministic replay semantics.
- Task Capsule creation now includes an empty `evidence.jsonl` required by harness validation.
- Init profiles exist as `hadara init --profile minimal|full|hadara-protocol`; default/minimal init creates core HADARA protocol docs for Hermes/export-context readiness.
- Harness validation supports `--level draft|done`; done-level validation requires Done status, completed acceptance, evidence records, and updated handoff sections.
- Run scenario scaffolding exists as `hadara run scaffold --task <id> --command <command>`, generating deterministic ScriptedProvider and fake-shell fixture JSON files under `.hadara/scenarios/`.
- Runtime validation now rejects unsupported permission modes and evidence result values; harness validation enforces evidence JSONL enum values.
- JSON-mode CLI parse and validation failures return a shared `hadara.cli.error.v1` fallback envelope.
- CLI JSON output policy is documented in `docs/CLI_JSON_CONTRACT.md`.
- Policy safe command classification requires exact token matches; suffixes are not implicitly safe.
- Agent loop run results now fail when fake-shell observations fail, including non-zero fake-shell exit codes.
- Run scenario scaffolding now rejects duplicate scenario files instead of silently reusing stale content.
- CLI handler extraction pass is complete: `src/cli/main.ts` is a top-level dispatcher and command groups live in focused `src/cli/*` modules.
- Project handoff is compacted: current state lives in `docs/AGENT_HANDOFF.md`, with historical task and validation history in dedicated history docs.
- Old Draft task capsules have been reclassified: T-0003 is Superseded, and T-0006 is Partial with remaining Hermes/MCP bridge scope deferred to the roadmap.
- Read-only Hermes/MCP bridge contract is documented in `docs/MCP_BRIDGE_CONTRACT.md`; stdio server and read tools are implemented.
- MCP JSON-RPC stdio server exists as `hadara mcp serve`; it supports discovery/lifecycle requests and read-only tools for task list/read, handoff read, project state read, policy evaluate, harness validate, evidence list, context export, and tools list.
- MCP bridge contract tests validate JSON text payload wrapping, notification no-response behavior, dispatch issue-code mapping, and CLI JSON parity for task list, policy evaluate, and harness validate.
- MCP evidence attach contract is documented in `docs/MCP_EVIDENCE_ATTACH_CONTRACT.md`; the tool is implemented only for explicit opt-in mode.
- MCP evidence attach can be enabled explicitly with `hadara mcp serve --enable-evidence-attach`; default MCP startup remains read-only and does not advertise the tool.
- MCP evidence attach safety tests cover JSON payload shape, safe public artifact copies, workspace boundary rejection, public artifact secret rejection, and invalid input mapping.
- MCP initialize metadata now reflects default read-only mode versus evidence attach-enabled mode, including `hadara/evidenceAttach`, `hadara/writes`, and disabled shell/provider flags.
- MCP evidence attach now requires per-call approval metadata with an actor and reason before writing evidence.
- MCP evidence attach write attempts are audited to the private portable audit store on both success and report-level failure.
- Operations Status JSON exists as `hadara status --json` and `hadara ops status --json` with schema `hadara.ops.status.v1` for future dashboards and external agents.
- Operations Status JSON reports warning issues for missing source documents or validation baselines, keeps stable dashboard-facing task count keys, exposes raw status counts separately, and parses explicit project phase markers.
- Operations Status JSON now includes dashboard-facing `health`, true raw status counts, and normalized status counts; `docs/DASHBOARD_READ_MODEL_CONTRACT.md` maps dashboard panels to field paths.
- Dashboard design references live under `docs/design/`; the current mockup is reference-only and does not implement UI behavior.
- A minimal static dashboard reference exists at `docs/design/dashboard/index.html`; it consumes the static sample status fixture with an inline fallback and has no backend, live CLI execution, MCP connection, file writes, or build step.
- The comfort dark mockup is now the preferred dashboard visual baseline for shell layout, visual hierarchy, palette, card grouping, and navigation feel; `hadara.ops.status.v1` remains the authoritative data contract.
- Static dashboard fixture binding smoke coverage verifies dashboard `data-field` attributes map to sample fixture-backed or derived `hadara.ops.status.v1` values.
- `hadara dashboard serve` serves the static sample-backed dashboard and fixture through allowlisted routes only; it does not execute live status commands, connect to MCP, write files, stream events, or persist browser state.
- Dashboard serving is hardened for GET/HEAD-only static responses, no-store/no-sniff/content-security headers, and traversal-like route rejection.
- Harness evidence index validation now requires canonical `hadara.evidence.v1` records to include non-empty `time`, `summary`, and `visibility`, and recent timestamp-only dashboard evidence records have been migrated.
- Static dashboard server responses now fail predictably for missing project roots or allowlisted files, returning safe 404 responses, and request handling catches unexpected response generation errors as 500 responses.
- Architecture and roadmap docs now distinguish implemented bootstrap capabilities, partial self-hosting surfaces, and deferred full-dogfooding work.
- Roadmap is frozen around the v0.3 Operations Layer: single active agent/session, stable CLI JSON, read-only MCP, evidence/handoff continuity, context export, compatibility fixture, and static operations dashboard remain in scope while multi-agent concurrency, broad MCP writes, MCP shell/release/package execution, live dashboard streaming, and real provider execution as the default path remain out of scope.
- Context export now includes roadmap and development slice ordering and instructs external agents to prefer HADARA CLI JSON or read-only MCP surfaces before falling back to raw repository documents.
- A Hermes-like compatibility fixture exists for the v0.3 external-agent flow; it replays exported context expectations and read-only MCP calls for project state, task list/read, handoff read, policy evaluate, and harness validate while confirming write/execution-like MCP tools are unavailable.
- CLI/MCP read-model parity has started: project and handoff read logic now lives in a shared service used by Operations Status JSON and MCP project/handoff tools, with contract tests comparing MCP payloads against shared services and CLI/domain report builders.
- Single active run state exists as a local project manifest at `.hadara/local/state/active-run.json`; Operations Status JSON exposes a read projection with resume guidance and a stale handoff warning when the active task id is missing from `docs/AGENT_HANDOFF.md`.
- Active run read surfaces exist as `hadara run-state show --json`, `hadara run-state resume --json`, read-only MCP `hadara.active.run.read`, and read-only MCP `hadara.active.run.resume`; active-run writes remain deferred.
- Active-run resume guidance resolves canonical Task Capsule paths from `activeRun.taskId`, warns with `ACTIVE_RUN_CAPSULE_MISMATCH` when local manifest capsule paths are stale, and uses canonical paths in `resume`/`mustRead` when the Task Capsule exists.
- Operational debt tracking exists in `docs/OPERATIONAL_DEBT.md` and `src/services/operational-debt.ts`; it promotes `known_issue.log` themes into structured records, reports capsule size indicators, and warns on premature acceptance checks before Done status or evidence.
- Operations state robustness is hardened: malformed active run local state degrades status JSON with warnings instead of throwing, active runs referencing missing Task Capsules are reported, premature acceptance uses valid evidence records, and shared Markdown section extraction matches heading lines only.
- Reusable Docker development workflow is documented: the `hadara-dev` container can stay running, dependency-heavy work happens in `/tmp/hadara`, and new Task Capsules should be created through the HADARA CLI with `--project /workspace`.
- V1.0 planning has been split into concrete references: `docs/V1_0_CAPSULE_BACKLOG.md` tracks future capsule candidates and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` preserves detailed schema/file/test notes from the v1.0 technical plan.
- V1.0 planning docs now explicitly separate T-0066 through T-0070 current implementation from future expansion targets, including compatibility fixture location, partial service parity, active-run local schema/path, operational debt persistence caveats, and degraded-read robustness scope.
- Schema layer planning exists in `docs/SCHEMAS.md`; `src/schemas/schema-index.json` registers initial JSON Schema fixtures for evidence list, context export, tools list, and active-run read models. Broad runtime schema validation and release gates remain deferred.
- Active-run projection/resume schema fixtures exist for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1`.
- Active-run projection/resume reports now use limited runtime schema validation through `src/core/schema.ts`; malformed active-run local state still degrades to schema-valid warning reports.
- Task read-model logic now lives in shared `src/services/task-read-model.ts`; CLI task JSON compatibility exports and read-only MCP task list/read both use the shared service.
- Policy report logic now lives in shared `src/services/policy-service.ts`; CLI policy check/preflight compatibility exports and read-only MCP policy evaluate use the shared service.
- Cleanup follow-up notes now document redaction policy observability gaps, schema strictness levels, task.read embedded evidence normalization gaps, and PolicyService authorization limitations before release-gate work.
- Task read evidence embedding now reuses evidence-list normalization; `task.read` returns normalized `evidenceIndex` records and a sanitized `files["evidence.jsonl"]` view instead of raw private evidence paths or unredacted summaries.
- Read-only MCP `hadara.task.read` excludes private evidence metadata by default; callers must pass `includePrivate: true` to receive sanitized private evidence metadata. `files["evidence.jsonl"]` is a sanitized read-model view, not raw file bytes.
- Harness validation report logic now has shared `src/services/harness-service.ts`; CLI `harness validate` and read-only MCP `hadara.harness.validate` both use the shared service boundary.
- Operations Status JSON report logic now has shared `src/services/operations-status-service.ts`; CLI `hadara status` and `hadara ops status` use the shared service boundary while `src/cli/status-json.ts` remains a compatibility export.
- Active-run projection and resume guidance reuse `src/services/active-run-state.ts` across Operations Status, CLI run-state reads, and read-only MCP active-run tools.
- Operational debt read surfaces exist as `hadara debt list --json`, `hadara debt show <id> --json`, read-only MCP `hadara.debt.list`, and read-only MCP `hadara.debt.show`.
- Operations Status JSON includes operational debt aggregate counts for total/open/status/severity/high-open debt.
- A read-only release-gate report exists as `hadara release gate --mode advisory|strict --json`; advisory mode warns and keeps `ok: true` for open high-severity debt, strict mode reports `ok: false`, and neither mode executes release, packaging, shell, provider, or deployment actions.
- Shell policy internals now have focused tokenizer, exact safe command preset, command-risk, and permission-matrix modules while preserving the existing `src/policy/policy.ts` compatibility surface. Release-risk commands are denied outside release mode and require explicit approval in release mode; auto/trusted network-risk commands require approval.
- Strict `hadara release gate --mode strict --json` failures set process exit code 6 when the release-gate report is not ok.
- Evidence CLI handling lives in `src/cli/evidence.ts`.
- Policy CLI handling lives in `src/cli/policy.ts`.
- Hermes CLI handling lives in `src/cli/hermes.ts`; handoff CLI handling lives in `src/cli/handoff.ts`.
- Real provider adapters are not implemented.
- Dashboard is locally servable through a static CLI helper, but it is not live-integrated; only its status JSON/read model, design references, static fixture-bound mockup shell, and sample-backed static server exist.
- Broad MCP write tools are not implemented beyond the explicitly enabled, approval-recorded, audited evidence attach tool.
- Operational debt records remain static and non-persisted; debt mutation and executable release automation remain deferred.

## Single Source of Truth

- Current state: `docs/PROJECT_STATE.md`
- Work queue: `docs/TASK_BOARD.md`
- Next-session handoff: `docs/AGENT_HANDOFF.md`
- Task details: `tasks/T-*/`

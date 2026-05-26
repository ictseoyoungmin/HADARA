# HANDOFF_HISTORY

Historical completed-task handoff entries moved out of `docs/AGENT_HANDOFF.md` during T-0040 handoff compaction.

## Completed Task History

- Completed T-0002 Config and Path Resolver hardening.
- Completed T-0004 ProviderClient Contract hardening with ScriptedProvider.
- Completed T-0005 Evidence Store expansion with `evidence.jsonl` and public/private evidence handling.
- Completed T-0008 Policy Evaluator Shell Parser.
- Completed T-0009 Harness Validate JSON with `hadara harness validate --task <id> --json`.
- Completed T-0010 Harness Replay Skeleton with `hadara harness replay <scenario.jsonl> --json`.
- Completed T-0011 CLI Doctor JSON with `hadara doctor --json`.
- Completed T-0012 CLI Task JSON with `hadara task list/show --json`.
- Completed T-0013 CLI Policy JSON with `hadara policy check-shell <command> --json`.
- Completed T-0014 CLI Hermes JSON with `hadara hermes detect/export-context --json`.
- Completed T-0015 CLI Evidence JSON with `hadara evidence collect --json`.
- Completed T-0016 Evidence Artifact Copy with managed public artifact storage.
- Completed T-0017 Policy Execution Preflight with `hadara policy preflight-shell <command> --json`.
- Completed T-0018 Provider Fallback Executor for deterministic chat fallback orchestration.
- Completed T-0019 Shell Preflight Harness with deterministic fake shell observations gated by policy preflight.
- Normalized T-0019 Task Capsule Markdown format to match neighboring capsules.
- Completed T-0020 Task Capsule Format Validation to detect Markdown format drift in harness validation.
- Completed T-0021 Agent Loop Minimal Harness with deterministic `hadara run --script ... --fake-shell-fixtures ... --json`.
- Hardened harness validation to require `evidence.jsonl` and cover missing evidence indexes with regression tests.
- Completed T-0022 Protocol Instruction Consolidation by moving reusable first-session rules into AGENTS.md and IMPLEMENTATION_SOP.
- Completed T-0023 Workspace File Boundary with shared realpath workspace file resolution for evidence, replay, and deterministic run inputs.
- Completed T-0024 Evidence Artifact Redaction with public text artifact scanning, binary rejection, and JSON policy issues.
- Completed T-0025 CLI Args Parser with strict reusable option helpers and malformed option value rejection.
- Completed T-0026 Agent Loop Evidence Attachment with fake-shell observation command-log artifacts and run JSON evidence metadata.
- Completed T-0027 Deterministic Scripted Provider and Capsule Evidence Index with sequential script consumption and empty `evidence.jsonl` scaffolding.
- Completed T-0028 Init Profiles Protocol Docs with `minimal`, `full`, and `hadara-protocol` init profiles and baseline protocol docs.
- Completed T-0029 Done-Level Harness Validation with `--level draft|done` and completion gates for Done status, acceptance, evidence, and handoff.
- Completed T-0030 Run Scenario Scaffold with deterministic script/fixture generation under `.hadara/scenarios/`.
- Completed T-0031 CLI Handler Extraction by moving init profile logic to `src/cli/init.ts` and run scaffold logic to `src/cli/run-scaffold.ts`.
- Completed T-0032 CLI Harness Handler Extraction by moving harness validate/replay CLI handling to `src/cli/harness.ts`.
- Completed T-0033 CLI Evidence Handler Extraction by moving evidence collect CLI handling to `src/cli/evidence.ts`.
- Completed T-0034 CLI Policy Handler Extraction by moving policy check/preflight CLI handling to `src/cli/policy.ts`.
- Completed T-0035 CLI Hermes and Handoff Handler Extraction by moving Hermes handling to `src/cli/hermes.ts` and handoff handling to `src/cli/handoff.ts`.
- Completed T-0036 CLI Remaining Handler Extraction by moving init, doctor, task, mcp, and run handling out of `src/cli/main.ts`.
- Completed T-0037 Runtime Validation and Harness Semantics by hardening permission modes, evidence enums, fake-shell failure outcomes, scaffold reuse, and task title parsing.
- Completed T-0038 CLI JSON Error Envelope by adding a shared fallback JSON error envelope for CLI parse and validation failures.
- Completed T-0039 Policy Safe Command Exactness by requiring exact token matches for safe shell commands.
- Completed T-0040 Handoff Compaction Policy by keeping `docs/AGENT_HANDOFF.md` current and moving older history to dedicated history docs.
- Completed T-0041 Old Draft Task Reclassification by marking T-0003 Superseded and T-0006 Partial.
- Completed T-0042 Hermes/MCP Read-Only Contract by documenting CLI JSON output policy, the read-only MCP bridge tool contract, MCP JSON text payload policy, and task status schema alignment.
- Completed T-0075 Redaction Policy Follow-up by separating public artifact blocking from redaction report details, preserving internal policy reports, documenting overlap semantics, and aligning near-term MCP planning names.
- Completed T-0076 Evidence List Read Model by adding shared evidence list report builder, CLI JSON evidence list, read-only MCP evidence list, degraded JSONL warnings, normalized output records, private path stripping, and taskId mismatch drops.
- Completed T-0077 Context Export MCP Read Tool by adding read-only MCP context export as an in-memory payload without writing generated context files.
- Completed T-0078 Tools List Read Model by adding neutral capability registry, shared tools discovery report, CLI JSON tools list, and read-only MCP tools list with availability/risk metadata.
- Completed T-0079 Schema Layer Planning by adding schema registry docs, schema index fixture, and initial JSON Schema fixtures for stable read models.
- Completed T-0080 Service Parity Expansion first increment by moving task list/show/read reports into a shared task read-model service.
- Completed T-0081 Policy Service Parity by moving policy check/evaluate reports into a shared policy service.
- Completed T-0082 Cleanup Follow-up Notes by documenting redaction/schema/task.read/policy cleanup gaps and aligning policy check mode input with policy evaluate.
- Completed T-0083 Task Read Evidence Normalization by reusing evidence-list normalization for task.read embedded evidenceIndex and sanitized evidence.jsonl views.
- Completed T-0089 Redaction Policy Observability Tests by adding safe public artifact policy diagnostics and regressions for medium non-blocking findings plus high/critical blocking behavior.
- Completed T-0090 Policy Matrix Refactor by splitting shell policy internals, blocking release-risk commands outside release mode, approval-gating network commands in auto/trusted modes, and making strict release gates return exit code 6.
- Completed T-0091 Private Evidence Manifest by adding private portable-store manifests with hashes, retention/deferred-encryption metadata, private audit events, and context-export exclusion coverage.
- Completed T-0092 Active Run Runtime Schema Validation by adding registered runtime schema validation for active-run projection/resume reports while preserving degraded warning behavior for malformed local state.
- Completed T-0093 Policy Matrix Release Gate Feedback by verifying release/network policy matrix behavior and sharpening strict release-gate exit-code regression coverage.
- Completed T-0097 Dashboard Read Integration by adding read-only dashboard API routes for status, tasks, evidence, active-run, and debt using shared read-model services without write, shell, provider, streaming, or persistence behavior.
- Completed T-0098 CLI Write Boundary Preflight by adding schema-backed read-only write preflight reports and CLI output for expected CLI-owned write paths without executing target writes.
- Completed T-0099 TUI Design and Development Plan by adding terminal TUI design notes and aligning architecture, roadmap, v1.0 backlog/schema notes, development slices, project state, task board, and handoff around a future read-only work console without production implementation.

## Source Documents

- Current state: `docs/PROJECT_STATE.md`
- Work queue: `docs/TASK_BOARD.md`
- Roadmap slices: `docs/DEVELOPMENT_SLICES.md`
- Task evidence: `tasks/T-*/EVIDENCE.md`

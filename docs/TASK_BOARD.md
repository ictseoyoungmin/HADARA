# TASK_BOARD

| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0001 | Bootstrap repository skeleton | Done | tasks/T-0001-bootstrap-repository-skeleton | Initial skeleton generated. |
| T-0002 | Implement Config and Path Resolver | Done | tasks/T-0002-config-and-path-resolver | realpath containment, env priority, Windows normalization, and data boundary hardened. |
| T-0003 | Expand CLI Command Specification | Superseded | tasks/T-0003-cli-command-specification | Superseded by T-0011~T-0039 CLI JSON, strict args, handler extraction, and runtime hardening work. |
| T-0004 | Implement ProviderClient Contract | Done | tasks/T-0004-providerclient-contract | ScriptedProvider and provider contract metadata added. |
| T-0005 | Implement Evidence Store | Done | tasks/T-0005-evidence-store | Markdown plus JSONL evidence index and private/public split added. |
| T-0006 | Implement Hermes Agent Compatibility | Partial | tasks/T-0006-hermes-agent-compatibility | Detect/export-context implemented; remaining bridge/server scope continues under Hermes/MCP bridge TBD slice. |
| T-0007 | Bootstrap Validation Pass | Done | tasks/T-0007-bootstrap-validation-pass | Docker npm ci/check and seed CLI loop passed. |
| T-0008 | Policy Evaluator Shell Parser | Done | tasks/T-0008-policy-evaluator-shell-parser | Tokenizer, safe allowlist, and dangerous command tests added. |
| T-0009 | Harness Validate JSON | Done | tasks/T-0009-harness-validate-json | Docker check and CLI JSON smoke passed. |
| T-0010 | Harness Replay Skeleton | Done | tasks/T-0010-harness-replay-skeleton | Docker check and replay CLI JSON smoke passed. |
| T-0011 | CLI Doctor JSON | Done | tasks/T-0011-cli-doctor-json | Docker check and doctor JSON/text CLI smokes passed. |
| T-0012 | CLI Task JSON | Done | tasks/T-0012-cli-task-json | Docker check and task JSON/text CLI smokes passed. |
| T-0013 | CLI Policy JSON | Done | tasks/T-0013-cli-policy-json | Docker check and policy JSON/non-JSON CLI smokes passed. |
| T-0014 | CLI Hermes JSON | Done | tasks/T-0014-cli-hermes-json | Docker check and Hermes JSON/non-JSON CLI smokes passed. |
| T-0015 | CLI Evidence JSON | Done | tasks/T-0015-cli-evidence-json | Docker check and evidence JSON/non-JSON CLI smokes passed. |
| T-0016 | Evidence Artifact Copy | Done | tasks/T-0016-evidence-artifact-copy | Docker check and public/private artifact CLI smokes passed. |
| T-0017 | Policy Execution Preflight | Done | tasks/T-0017-policy-execution-preflight | Docker check and allowed/approval/denied preflight CLI smokes passed. |
| T-0018 | Provider Fallback Executor | Done | tasks/T-0018-provider-fallback-executor | Docker check and provider fallback contract tests passed. |
| T-0019 | Shell Preflight Harness | Done | tasks/T-0019-shell-preflight-harness | Docker check and fake shell policy-gated harness tests passed. |
| T-0020 | Task Capsule Format Validation | Done | tasks/T-0020-task-capsule-format-validation | Docker check and Task Capsule Markdown format drift regression tests passed. |
| T-0021 | Agent Loop Minimal Harness | Done | tasks/T-0021-agent-loop-minimal-harness | Docker check, CLI run smoke, and harness validation passed. |
| T-0022 | Protocol Instruction Consolidation | Done | tasks/T-0022-protocol-instruction-consolidation | Reusable first-session HADARA protocol consolidated into AGENTS and SOP docs. |
| T-0023 | Workspace File Boundary | Done | tasks/T-0023-workspace-file-boundary | Realpath workspace resolver and boundary regression tests passed Docker validation. |
| T-0024 | Evidence Artifact Redaction | Done | tasks/T-0024-evidence-artifact-redaction | Public text artifact secret scan and binary rejection passed Docker validation. |
| T-0025 | CLI Args Parser | Done | tasks/T-0025-cli-args-parser | Strict option helpers and malformed value regressions passed Docker validation. |
| T-0026 | Agent Loop Evidence Attachment | Done | tasks/T-0026-agent-loop-evidence-attachment | Fake-shell observation evidence attachments passed Docker validation. |
| T-0027 | Deterministic Scripted Provider and Capsule Evidence Index | Done | tasks/T-0027-deterministic-scripted-provider-capsule-index | Sequential scripts and empty evidence indexes passed Docker validation. |
| T-0028 | Init Profiles Protocol Docs | Done | tasks/T-0028-init-profiles-protocol-docs | Init profiles and protocol doc scaffolding passed Docker validation. |
| T-0029 | Done-Level Harness Validation | Done | tasks/T-0029-done-level-harness-validation | Draft/done validation levels passed Docker validation. |
| T-0030 | Run Scenario Scaffold | Done | tasks/T-0030-run-scenario-scaffold | Deterministic run scaffold helper passed Docker validation. |
| T-0031 | CLI Handler Extraction | Done | tasks/T-0031-cli-handler-extraction | Extracted init and run scaffold helpers from CLI dispatcher. |
| T-0032 | CLI Harness Handler Extraction | Done | tasks/T-0032-cli-harness-handler-extraction | Extracted harness command group from CLI dispatcher. |
| T-0033 | CLI Evidence Handler Extraction | Done | tasks/T-0033-cli-evidence-handler-extraction | Extracted evidence command group from CLI dispatcher. |
| T-0034 | CLI Policy Handler Extraction | Done | tasks/T-0034-cli-policy-handler-extraction | Extracted policy command group from CLI dispatcher. |
| T-0035 | CLI Hermes and Handoff Handler Extraction | Done | tasks/T-0035-cli-hermes-handoff-handler-extraction | Extracted Hermes and handoff command groups from CLI dispatcher. |
| T-0036 | CLI Remaining Handler Extraction | Done | tasks/T-0036-cli-remaining-handler-extraction | Extracted remaining command groups from CLI dispatcher. |
| T-0037 | Runtime Validation and Harness Semantics | Done | tasks/T-0037-runtime-validation-harness-semantics | Hardened mode parsing, evidence enums, fake-shell failures, scaffold reuse, and task title parsing. |
| T-0038 | CLI JSON Error Envelope | Done | tasks/T-0038-cli-json-error-envelope | Added fallback JSON error envelope for CLI parse and validation failures. |
| T-0039 | Policy Safe Command Exactness | Done | tasks/T-0039-policy-safe-command-exactness | Required exact token matching for policy safe commands. |
| T-0040 | Handoff Compaction Policy | Done | tasks/T-0040-handoff-compaction-policy | Compacted current handoff and moved old history into dedicated docs. |
| T-0041 | Old Draft Task Reclassification | Done | tasks/T-0041-old-draft-task-reclassification | Reclassified T-0003 as Superseded and T-0006 as Partial. |
| T-0042 | Hermes/MCP Read-Only Contract | Done | tasks/T-0042-hermes-mcp-read-only-contract | Defined read-only MCP contract, CLI JSON policy, and task status schema alignment. |
| T-0043 | MCP JSON-RPC Server Skeleton | Done | tasks/T-0043-mcp-json-rpc-server-skeleton | Stdio read-only MCP server lifecycle/discovery skeleton added. |
| T-0044 | MCP Read Tools Implementation | Done | tasks/T-0044-mcp-read-tools-implementation | Implemented read-only MCP tools from the bridge contract. |
| T-0045 | MCP Bridge Harness Tests | Done | tasks/T-0045-mcp-bridge-harness-tests | Validated MCP bridge payloads against CLI JSON contracts. |
| T-0046 | Evidence Attach Tool Contract | Done | tasks/T-0046-evidence-attach-tool-contract | Defined future MCP evidence attach contract and write-tool error taxonomy. |
| T-0047 | Evidence Attach Guard Tests | Done | tasks/T-0047-evidence-attach-guard-tests | Guarded against premature MCP evidence attach advertisement or execution. |
| T-0048 | Gated MCP Evidence Attach Implementation | Done | tasks/T-0048-gated-mcp-evidence-attach-implementation | Implemented evidence attach behind explicit MCP opt-in. |
| T-0049 | MCP Evidence Attach Safety Tests | Done | tasks/T-0049-mcp-evidence-attach-safety-tests | Validated opt-in MCP evidence attach safety gates. |
| T-0050 | MCP Write Audit Log | Done | tasks/T-0050-mcp-write-audit-log | Audits opt-in MCP evidence attach success and failure attempts to the private portable audit store. |
| T-0051 | MCP Phase/Mode Config | Done | tasks/T-0051-mcp-phase-mode-config | Initialize metadata and instructions now reflect default read-only vs evidence attach-enabled mode. |
| T-0052 | MCP Evidence Attach Approval Record | Done | tasks/T-0052-mcp-evidence-attach-approval-record | Requires per-call approval actor/reason for opt-in MCP evidence attach writes. |
| T-0053 | Operations Status JSON | Done | tasks/T-0053-operations-status-json | Adds `hadara status --json` and `hadara ops status --json` as dashboard/external-agent read models. |
| T-0054 | Operations Status JSON Cleanup | Done | tasks/T-0054-operations-status-json-cleanup | Hardens status JSON warnings, stable task counts, raw status counts, phase parsing, and validation fallback. |
| T-0055 | Dashboard Read Model Contract | Done | tasks/T-0055-dashboard-read-model-contract | Maps dashboard cards/panels to `hadara.ops.status.v1` and adds a sample fixture. |
| T-0056 | Minimal Static Dashboard | Done | tasks/T-0056-minimal-static-dashboard | Adds a static Operations Home dashboard consuming the sample status fixture without backend, live CLI, MCP, writes, or build step. |
| T-0057 | Dashboard Mockup Adoption | Done | tasks/T-0057-dashboard-mockup-adoption | Promotes the comfort dark mockup to dashboard visual baseline while preserving `hadara.ops.status.v1` fixture binding and static boundaries. |
| T-0058 | Dashboard Fixture Binding Smoke | Done | tasks/T-0058-dashboard-fixture-binding-smoke | Adds static smoke coverage that dashboard `data-field` attributes map to fixture-backed or derived `hadara.ops.status.v1` values. |
| T-0059 | Dashboard Served from HADARA CLI | Done | tasks/T-0059-dashboard-served-from-hadara-cli | Adds `hadara dashboard serve` for the static sample-backed dashboard with allowlisted asset routes. |
| T-0060 | Dashboard Serve Boundary Hardening | Done | tasks/T-0060-dashboard-serve-boundary-hardening | Restricts dashboard serving to safe methods, security headers, and traversal-resistant allowlisted routes. |
| T-0061 | Evidence Index Schema Hardening | Done | tasks/T-0061-evidence-index-schema-hardening | Requires canonical `time`, `summary`, and `visibility` evidence index fields and migrates recent timestamp drift. |
| T-0062 | Dashboard Server Failure Semantics | Done | tasks/T-0062-dashboard-server-failure-semantics | Makes static dashboard server failures predictable for missing roots/files and unexpected response generation errors. |
| T-0063 | Architecture/Roadmap State Reconciliation | Done | tasks/T-0063-architecture-roadmap-state-reconciliation | Aligns architecture and roadmap docs with implemented, partial, and deferred HADARA capabilities. |
| T-0064 | Roadmap v0.3 Operations Layer Freeze | Done | tasks/T-0064-roadmap-v0-3-operations-layer-freeze | Freezes v0.3 as the current read-only operations layer and moves provider work behind external-agent readiness slices. |
| T-0065 | Context Export MCP Instructions | Done | tasks/T-0065-context-export-mcp-instructions | Updates context export to include roadmap/slice ordering and MCP/CLI-first external-agent guidance. |
| T-0066 | Compatibility Fixture | Done | tasks/T-0066-compatibility-fixture | Adds a Hermes-like read-only compatibility fixture replayed through context export and MCP tool dispatch. |
| T-0067 | CLI/MCP Service Parity Refactor | Done | tasks/T-0067-cli-mcp-service-parity-refactor | Moves project/handoff read logic into shared services and adds CLI/MCP parity coverage. |
| T-0068 | Single Active Run State | Done | tasks/T-0068-single-active-run-state | Adds local single active run manifest, resume projection, stale handoff warning, and status JSON exposure. |
| T-0069 | Operational Debt Track | Done | tasks/T-0069-operational-debt-track | Converts `known_issue.log` themes into structured debt records, capsule size indicators, and premature acceptance warnings. |
| T-0070 | Operations State Robustness Fix | Done | tasks/T-0070-operations-state-robustness-fix | Hardens active run corruption handling, missing-task warnings, premature acceptance checks, and shared section extraction. |
| T-0071 | Reusable Docker Development Container | Done | tasks/T-0071-reusable-docker-development-container | Documents reusable Docker workflow and CLI-based Task Capsule creation. |
| T-0072 | Core v1.0 Technical Plan Refresh | Done | tasks/T-0072-core-v1-0-technical-plan-refresh | Clarifies T-0066 through T-0070 implementation/design mismatches in v1.0 planning docs. |
| T-0074 | Redaction Hardening | Done | tasks/T-0074-redaction-hardening | Adds redaction registry/report model and broadens high-risk public evidence secret detection. |
| T-0075 | Redaction Policy Follow-up | Done | tasks/T-0075-redaction-policy-follow-up | Separates redaction report findings from severity-threshold public artifact blocking and aligns future MCP planning names. |
| T-0076 | Evidence List Read Model | Done | tasks/T-0076-evidence-list-read-model | Adds shared `hadara.evidence.list.v1`, CLI JSON evidence list, and read-only MCP evidence list with degraded JSONL warnings. |
| T-0077 | Context Export MCP Read Tool | Done | tasks/T-0077-context-export-mcp-read-tool | Adds read-only MCP `hadara.context.export` memory payload without writing context files. |
| T-0078 | Tools List Read Model | Done | tasks/T-0078-tools-list-read-model | Adds shared `hadara.tools.list.v1`, CLI JSON tools list, read-only MCP capability discovery, neutral capability registry, availability/risk metadata, and disabled surfaces. |
| T-0079 | Schema Layer Planning | Done | tasks/T-0079-schema-layer-planning | Adds `docs/SCHEMAS.md`, schema index fixture, and initial JSON Schema fixtures for evidence list, context export, and tools list read models. |
| T-0080 | Service Parity Expansion | Done | tasks/T-0080-service-parity-expansion | Moves task list/show/read reports into a shared task read-model service and routes MCP task list/read through it. |
| T-0081 | Policy Service Parity | Done | tasks/T-0081-policy-service-parity | Moves policy check/evaluate report builders into a shared policy service and routes CLI preflight plus MCP policy evaluate through it. |
| T-0082 | Cleanup Follow-up Notes | Done | tasks/T-0082-cleanup-follow-up-notes | Captures redaction/schema/task.read/policy cleanup gaps and aligns policy check mode input with policy evaluate. |
| T-0083 | Task Read Evidence Normalization | Done | tasks/T-0083-task-read-evidence-normalization | Reuses evidence-list normalization for task.read evidenceIndex and sanitized evidence.jsonl file view. |
| T-0084 | Harness Validate Service Parity | Done | tasks/T-0084-harness-validate-service-parity | Routes CLI/MCP harness validate through a shared service and makes task.read private evidence opt-in. |
| T-0085 | Operations Status Service Parity | Done | tasks/T-0085-operations-status-service-parity | Moves Operations Status JSON report creation into a shared service while preserving CLI status output. |
| T-0086 | Active Run Read Surfaces | Done | tasks/T-0086-active-run-read-surfaces | Adds read-only CLI/MCP active-run projection and resume guidance surfaces. |
| T-0087 | Operational Debt Release Gates | Done | tasks/T-0087-operational-debt-release-gates | Adds debt list/show read surfaces, ops debt aggregates, and advisory/strict release-gate debt checks. |
| T-0088 | Active Run Resume Hardening | Done | tasks/T-0088-active-run-resume-hardening | Canonicalizes active-run resume paths, warns on capsule mismatches, adds active-run schema fixtures, and clarifies read-only resume guidance. |
| T-0089 | Redaction Policy Observability Tests | Done | tasks/T-0089-redaction-policy-observability-tests | Adds safe public artifact policy diagnostics and medium-finding non-blocking coverage. |
| T-0090 | Policy Matrix Refactor | Done | tasks/T-0090-policy-matrix-refactor | Splits shell policy internals and blocks release-risk commands outside release mode while approval-gating auto/trusted network risk. |

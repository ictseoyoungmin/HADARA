# V1.0_CAPSULE_BACKLOG

This document turns `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md` into concrete future Task Capsule candidates.

Use this file when creating the next v1.0 capsule after the latest completed baseline.
Detailed schemas and file-level notes live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

## Current Baseline

- T-0066 Compatibility Fixture: done as a contract-test fixture.
- T-0067 CLI/MCP Service Parity Refactor: partial; project/handoff shared read models exist, broader services remain.
- T-0068 Single Active Run State: foundational done; local manifest and status projection exist.
- T-0069 Operational Debt Track: foundational done; static records, capsule size indicators, and premature acceptance warnings exist.
- T-0070 Operations State Robustness Fix: done; active-run/debt/status robustness gaps were hardened.
- T-0071 Reusable Docker Development Container: done; use the reusable container for future capsule creation and validation.
- T-0072 Core v1.0 Technical Plan Refresh: done; T-0066 through T-0070 design mismatch notes now distinguish current implementation from future expansion targets.
- T-0074 Redaction Hardening: done; redaction now has a registry/report model with broader high-risk pattern coverage.
- T-0075 Redaction Policy Follow-up: done; public artifact blocking now uses a redaction severity threshold and future active-run/context-export MCP planning names are aligned.
- T-0076 Evidence List Read Model: done; `hadara.evidence.list.v1` is shared by CLI JSON and read-only MCP, with malformed JSONL degraded-read warnings.
- T-0077 Context Export MCP Read Tool: done; `hadara.context.export.v1` returns an in-memory MCP payload with `contextPath: null` and does not write `.hadara/context/HADARA_CONTEXT.md`.
- T-0078 Tools List Read Model: done; `hadara.tools.list.v1` is shared by CLI JSON and read-only MCP through a neutral capability registry, with fuller CLI surface discovery, availability/risk metadata, opt-in evidence attach, and disabled shell/provider/release/broad-write MCP surfaces reported.
- T-0079 Schema Layer Planning: done; `docs/SCHEMAS.md`, `src/schemas/schema-index.json`, and first JSON Schema fixtures exist for evidence list, context export, and tools list read models.
- T-0080 Service Parity Expansion: first increment done; task list/show/read reports now live in `src/services/task-read-model.ts`, with MCP task list/read routed through the shared service.
- T-0081 Policy Service Parity: done; policy check/evaluate report builders now live in `src/services/policy-service.ts`, with CLI preflight and MCP policy evaluate routed through the shared service.
- T-0082 Cleanup Follow-up Notes: done; cleanup notes captured redaction policy observability, schema strictness levels, task.read evidenceIndex normalization gaps, and PolicyService authorization limitations; policy check report mode input now matches policy evaluate input behavior.
- T-0083 Task Read Evidence Normalization: done; task.read embedded evidenceIndex and files["evidence.jsonl"] now reuse evidence-list normalization and sanitized JSONL output.
- T-0084 Harness Validate Service Parity: done; CLI and MCP harness validate now use shared `src/services/harness-service.ts`.
- T-0087 Operational Debt Release Gates: done; operational debt now has CLI/MCP read surfaces, ops aggregate counts, advisory release-gate warnings, and strict high-open debt blocking reports.
- T-0088 Active Run Resume Hardening: done; active-run resume guidance now canonicalizes Task Capsule paths, warns on capsule mismatches, and has active-run schema fixtures.

## Immediate P0 Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 1 | Redaction hardening | T-0074 | Replace the simple secret regex list with a registry/report model for public evidence safety. | Done: Redaction registry tests cover AWS, GitHub, JWT, private key, npm, and no-capture replacement cases. |
| 2 | Redaction policy follow-up | T-0075 | Separate redaction reports from severity-threshold public evidence blocking and align near-term MCP planning names. | Done: threshold helper, public artifact policy update, planning docs, and Docker checks passed. |
| 3 | Evidence list read model | T-0076 | Add a stable read model for task evidence records for CLI/MCP/dashboard use. | Done: `hadara.evidence.list.v1` report builder and malformed/degraded evidence tests pass. |
| 4 | Context export MCP read tool | T-0077 | Provide MCP read-only context export as memory payload, not a file-writing operation. | Done: `hadara.context.export` appears in MCP read tools and writes no files. |
| 5 | Tools list read model | T-0078 | Let external agents discover current CLI/MCP capabilities and disabled surfaces. | Done: `hadara.tools.list.v1` lists CLI/MCP tools from a neutral capability registry, opt-in evidence attach, availability/risk metadata, and disabled shell/provider/release/broad-write surfaces. |
| 6 | Schema layer planning | T-0079 | Introduce schema registry boundaries before broad JSON schema validation. | Done: `docs/SCHEMAS.md` and first schema fixtures exist for core read models. |

## P1 Core Solidification Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 7 | Service parity expansion | T-0080, T-0081, T-0084 | Move task/evidence/policy/harness/context read logic into shared services/read models. | Task, policy, and harness validate increments done. Remaining status service expansion should continue in follow-up capsules. |
| 7a | Read-model cleanup hardening notes | T-0082 | Track cleanup gaps before release gates: redaction policy observability, schema strictness levels, task.read evidence normalization, and PolicyService authorization boundaries. | Done: cleanup notes captured in schema/planning/contract docs; policy check mode input accepts the same string/default convention as policy evaluate. |
| 7b | Task read evidence normalization | T-0083 | Align task.read embedded evidence data with evidence-list normalization. | Done: task.read evidenceIndex and files["evidence.jsonl"] sanitize private paths, unknown fields, mismatches, malformed lines, and read-time secrets. |
| 7c | Harness validate service parity | T-0084 | Route harness validate report generation through a shared service and tighten task.read private evidence defaults. | Done: CLI/MCP harness validate use shared service; task.read private evidence is opt-in via `includePrivate`; parity and bridge contract tests pass. |
| 8 | Active run CLI/MCP surface | TBD | Formalize run-state CLI writes and read-only MCP active-run/resume tools. | `hadara run-state ... --json`, `hadara.active.run.read`, and `hadara.active.run.resume` tests pass. |
| 8a | Active run resume hardening | T-0088 | Harden active-run resume guidance after review. | Done: canonical capsule paths, mismatch warnings, schema fixtures, and read-only resume wording pass. |
| 8b | Active run runtime schema validation | TBD | Validate active-run projection/resume read models from mutable local state before stricter release gates rely on them. | Runtime schema validation covers `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` with malformed local-state regressions. |
| 9 | Operational debt release gates | T-0087 | Promote operational debt into CLI/MCP read surfaces and release-gate modes. | Done: debt list/show reports, ops aggregate counts, advisory warnings, and strict high-open debt blocking reports pass. |
| 9a | Redaction policy observability tests | T-0089 | Prove redaction policy diagnostics expose safe pattern/severity/count metadata without leaking raw secret material. | Done: public artifact policy path tests cover medium non-blocking diagnostics, high/critical blocking, and safe user-facing output. |
| 10 | Policy matrix refactor | TBD | Split tokenizer, command risk, permission matrix, presets, and preflight policy. | Existing exact-match safety tests pass plus matrix regressions for read/test/build/write/network/destructive/release. |
| 11 | Private evidence manifest | TBD | Track private evidence metadata, hashes, retention, and context-export exclusion. | Private evidence manifest tests pass and private evidence never enters public context export. |
| 12 | Logger and audit event model | TBD | Add structured event schema and clarify stdout/stderr/audit/debug log boundaries. | `hadara.event.v1` tests pass and write/policy/evidence audit records remain structured. |

## P2 Productization Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 13 | Provider adapter preparation | TBD | Document and scaffold provider adapters without making real provider execution the default. | provider config/call report contract tests pass with secrets excluded. |
| 14 | Dashboard read integration | TBD | Add local read APIs behind `hadara dashboard serve` without write or shell behavior. | `/api/status`, `/api/tasks`, `/api/evidence`, `/api/active-run`, and `/api/debt` route tests pass. |
| 15 | CLI write boundary preflight | TBD | Add expected-write preflight reports for CLI-owned write commands. | write-preflight tests list files before task/evidence/handoff/run-state/debt writes. |
| 16 | Release and packaging track | TBD | Define install, CI, clean-checkout, and release-gate behavior. | release checklist report and clean checkout smoke pass in Docker. |
| 17 | Dogfooding E2E fixture | TBD | Replay a HADARA-on-HADARA workflow from context export to done-level validation. | E2E fixture proves context, capsule, evidence, handoff, policy, and harness continuity. |
| 18 | Remote CI/release observation | TBD | Confirm remote CI behavior after local Docker validation and before v1.0 release gate freeze. | Remote workflow/check status is recorded and release-gate docs distinguish local vs remote validation. |

## Must Preserve

- Default MCP startup remains read-only.
- `hadara.evidence.attach` remains opt-in, approval-recorded, and audited.
- MCP shell execution, MCP release/package execution, broad MCP writes, cloud queues, and multi-agent concurrency remain out of scope.
- Real provider execution is not the default path.
- Local mutable state failures should degrade read models with warnings instead of crashing status surfaces.

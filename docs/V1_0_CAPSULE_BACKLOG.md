# V1.0_CAPSULE_BACKLOG

This document turns `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md` into concrete future Task Capsule candidates.

Use this file when creating the next capsule after T-0072. Detailed schemas and file-level notes live in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

## Current Baseline

- T-0066 Compatibility Fixture: done as a contract-test fixture.
- T-0067 CLI/MCP Service Parity Refactor: partial; project/handoff shared read models exist, broader services remain.
- T-0068 Single Active Run State: foundational done; local manifest and status projection exist.
- T-0069 Operational Debt Track: foundational done; static records, capsule size indicators, and premature acceptance warnings exist.
- T-0070 Operations State Robustness Fix: done; active-run/debt/status robustness gaps were hardened.
- T-0071 Reusable Docker Development Container: done; use the reusable container for future capsule creation and validation.
- T-0072 Core v1.0 Technical Plan Refresh: done; T-0066 through T-0070 design mismatch notes now distinguish current implementation from future expansion targets.
- T-0074 Redaction Hardening: done; redaction now has a registry/report model with broader high-risk pattern coverage.

## Immediate P0 Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 1 | Redaction hardening | T-0074 | Replace the simple secret regex list with a registry/report model for public evidence safety. | Done: Redaction registry tests cover AWS, GitHub, JWT, private key, npm, and no-capture replacement cases. |
| 2 | Evidence list read model | TBD | Add a stable read model for task evidence records for CLI/MCP/dashboard use. | `hadara.evidence.list.v1` report builder and malformed/degraded evidence tests pass. |
| 3 | Context export MCP read tool | TBD | Provide MCP read-only context export as memory payload, not a file-writing operation. | `hadara.context.export` appears in MCP read tools and writes no files. |
| 4 | Tools list read model | TBD | Let external agents discover current CLI/MCP capabilities and disabled surfaces. | `hadara.tools.list.v1` lists stable CLI/MCP tools and disabled shell/release/write surfaces. |
| 5 | Schema layer planning | TBD | Introduce schema registry boundaries before broad JSON schema validation. | `docs/SCHEMAS.md` and first schema fixtures exist for core read models. |

## P1 Core Solidification Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 6 | Service parity expansion | TBD | Move task/evidence/policy/harness/context read logic into shared services/read models. | CLI/MCP parity tests pass for task read, evidence list, policy evaluate, harness validate, and context export. |
| 7 | Active run CLI/MCP surface | TBD | Formalize run-state CLI writes and read-only MCP active-run/resume tools. | `hadara run-state ... --json`, `hadara.activeRun.read`, and `hadara.resume.projection` tests pass. |
| 8 | Operational debt release gates | TBD | Promote operational debt into CLI/MCP read surfaces and release-gate warnings. | debt list/show reports, ops aggregate counts, and release-gate debt checks pass. |
| 9 | Policy matrix refactor | TBD | Split tokenizer, command risk, permission matrix, presets, and preflight policy. | Existing exact-match safety tests pass plus matrix regressions for read/test/build/write/network/destructive/release. |
| 10 | Private evidence manifest | TBD | Track private evidence metadata, hashes, retention, and context-export exclusion. | Private evidence manifest tests pass and private evidence never enters public context export. |
| 11 | Logger and audit event model | TBD | Add structured event schema and clarify stdout/stderr/audit/debug log boundaries. | `hadara.event.v1` tests pass and write/policy/evidence audit records remain structured. |

## P2 Productization Capsules

| Order | Candidate Slice | Capsule | Purpose | Key Done Evidence |
|---:|---|---|---|---|
| 12 | Provider adapter preparation | TBD | Document and scaffold provider adapters without making real provider execution the default. | provider config/call report contract tests pass with secrets excluded. |
| 13 | Dashboard read integration | TBD | Add local read APIs behind `hadara dashboard serve` without write or shell behavior. | `/api/status`, `/api/tasks`, `/api/evidence`, `/api/active-run`, and `/api/debt` route tests pass. |
| 14 | CLI write boundary preflight | TBD | Add expected-write preflight reports for CLI-owned write commands. | write-preflight tests list files before task/evidence/handoff/run-state/debt writes. |
| 15 | Release and packaging track | TBD | Define install, CI, clean-checkout, and release-gate behavior. | release checklist report and clean checkout smoke pass in Docker. |
| 16 | Dogfooding E2E fixture | TBD | Replay a HADARA-on-HADARA workflow from context export to done-level validation. | E2E fixture proves context, capsule, evidence, handoff, policy, and harness continuity. |
| 17 | Remote CI/release observation | TBD | Confirm remote CI behavior after local Docker validation and before v1.0 release gate freeze. | Remote workflow/check status is recorded and release-gate docs distinguish local vs remote validation. |

## Must Preserve

- Default MCP startup remains read-only.
- `hadara.evidence.attach` remains opt-in, approval-recorded, and audited.
- MCP shell execution, MCP release/package execution, broad MCP writes, cloud queues, and multi-agent concurrency remain out of scope.
- Real provider execution is not the default path.
- Local mutable state failures should degrade read models with warnings instead of crashing status surfaces.

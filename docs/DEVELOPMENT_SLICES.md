# DEVELOPMENT_SLICES

HADARA development should proceed in small, evidence-backed slices. Each slice must live in a Task Capsule, run meaningful validation, update `EVIDENCE.md` and `evidence.jsonl`, and refresh `docs/AGENT_HANDOFF.md` before stopping.

| Order | Slice | Capsule | Purpose | Done Evidence |
|---|---|---|---|---|
| 1 | Harness validate JSON | T-0009 | Stabilize `hadara harness validate --task <id> --json` for external agents and CI. | Build/tests pass, CLI JSON sample recorded. |
| 2 | Harness replay skeleton | T-0010 | Add deterministic replay schema and ScriptedProvider-backed no-op scenario checks. | Done: 7 test files passed, 34 tests passed, replay JSON smoke recorded. |
| 3 | CLI JSON normalization | T-0011, T-0012, T-0013, T-0014, T-0015 | Apply common JSON envelope and exit codes to core CLI commands. | Done: doctor, task list/show, policy, Hermes, and evidence collect JSON. |
| 4 | Evidence artifact handling | T-0016 | Copy public artifacts into managed task/session evidence storage without leaking private paths. | Done: public artifact copy tests and private path suppression checks. |
| 5 | Policy execution preflight | T-0017 | Connect policy evaluator to ShellTool design before shell execution exists. | Done: allowed, approval-required, and denied preflight tests/smokes. |
| 6 | Provider fallback executor | T-0018 | Add fallback orchestration on top of the existing ProviderClient contract. | Done: contract tests with MockProvider/ScriptedProvider. |
| 7 | Shell preflight harness | T-0019 | Add deterministic fake shell observations gated by policy preflight before real shell execution. | Done: Docker check and fake shell policy gate tests. |
| 8 | Task Capsule format validation | T-0020 | Enforce Markdown format markers so handoff/context compression cannot silently drift capsule structure. | Done: Docker check and format drift regression tests. |
| 9 | Agent loop minimal harness | TBD | Implement a bounded readonly/assisted loop using fake tools first. | Golden replay and task evidence updates. |
| 10 | Hermes/MCP bridge expansion | TBD | Expose stable read/write contracts after CLI harness surfaces are reliable. | Harness validate through external-agent contract. |
| 11 | Dashboard read model | TBD | Build dashboard only after state, harness, and evidence contracts are stable. | UI smoke plus read-model tests. |
| 12 | Real provider adapters | TBD | Add network adapters after provider fallback, policy, and evidence gates are mature. | Adapter contract tests with secrets excluded. |

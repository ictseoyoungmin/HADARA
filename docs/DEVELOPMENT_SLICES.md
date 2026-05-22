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
| 9 | Agent loop minimal harness | T-0021 | Implement a bounded deterministic loop using ScriptedProvider responses and fake shell observations first. | Done: Docker check, CLI run smoke, evidence index validation, and T-0021 harness validation. |
| 10 | Workspace file boundary | T-0023 | Ensure CLI file inputs are confined to project-root realpaths before broader tool/file surfaces grow. | Done: Docker check passed, 18 test files passed, 74 tests passed, T-0023 harness validation passed. |
| 11 | Evidence artifact redaction | T-0024 | Prevent public committed artifacts from carrying secrets or binary private data. | Done: Docker check passed, 18 test files passed, 78 tests passed, T-0024 harness validation passed. |
| 12 | CLI args parser | T-0025 | Split growing option parsing into strict reusable helpers. | Done: Docker check passed, 19 test files passed, 84 tests passed, T-0025 harness validation passed. |
| 13 | Agent loop evidence attachment | T-0026 | Attach deterministic fake-shell loop outputs as evidence without real shell execution. | Done: Docker check passed, T-0026 harness validation passed, run JSON smoke recorded evidence metadata. |
| 14 | Deterministic ScriptedProvider and Capsule Evidence Index | T-0027 | Ensure deterministic scripts are consumed in order and new capsules include required evidence indexes. | Done: Docker check passed, T-0027 harness validation passed, task-create smoke confirmed empty `evidence.jsonl`. |
| 15 | Init profiles protocol docs | T-0028 | Improve first-use HADARA initialization with protocol docs and profile selection. | Done: Docker check passed, T-0028 harness validation passed, full-profile Hermes export smoke passed. |
| 16 | Done-level harness validation | T-0029 | Add completion gates beyond structural Task Capsule validation. | Done: Docker check passed, done-level harness validation passed. |
| 17 | Run scenario scaffold | T-0030 | Generate deterministic run script and fake-shell fixture files for demo/task workflows. | Done: Docker check passed, built CLI scaffold/run smoke returned `ok: true`. |
| 18 | CLI handler extraction | T-0031 | Reduce `src/cli/main.ts` density by extracting cohesive command helpers. | Done: Docker check passed, init/run scaffold smoke passed, `main.ts` reduced from 667 to 459 LOC. |
| 19 | CLI harness handler extraction | T-0032 | Continue CLI dispatcher reduction by extracting harness validate/replay handling. | Done: Docker check passed, harness validate/replay smokes passed, `main.ts` reduced from 459 to 419 LOC. |
| 20 | CLI evidence handler extraction | T-0033 | Continue CLI dispatcher reduction by extracting evidence collect handling. | Done: Docker check passed, evidence collect JSON/text smokes passed, `main.ts` reduced from 419 to 387 LOC. |
| 21 | CLI policy handler extraction | T-0034 | Continue CLI dispatcher reduction by extracting policy check/preflight handling. | Done: Docker check passed, policy check/preflight JSON/text smokes passed, `main.ts` reduced from 387 to 358 LOC. |
| 22 | CLI Hermes and handoff handler extraction | T-0035 | Continue CLI dispatcher reduction by extracting Hermes and handoff handling. | Done: Docker check passed, Hermes JSON/text and handoff smokes passed, `main.ts` reduced from 358 to 332 LOC. |
| 23 | CLI remaining handler extraction | T-0036 | Finish current CLI dispatcher extraction pass by moving init, doctor, task, mcp, and run handling. | Done: Docker check passed, remaining command smokes passed, `main.ts` reduced from 332 to 115 LOC. |
| 24 | Hermes/MCP bridge expansion | TBD | Expose stable read/write contracts after CLI harness surfaces are reliable. | Harness validate through external-agent contract. |
| 25 | Dashboard read model | TBD | Build dashboard only after state, harness, and evidence contracts are stable. | UI smoke plus read-model tests. |
| 26 | Real provider adapters | TBD | Add network adapters after provider fallback, policy, and evidence gates are mature. | Adapter contract tests with secrets excluded. |

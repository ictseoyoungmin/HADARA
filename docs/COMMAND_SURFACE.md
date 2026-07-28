# COMMAND_SURFACE

HADARA command discovery is registry-backed. The authoritative command inventory is `src/services/capability-registry.ts`; renderers and compatibility reports must project from that file instead of maintaining separate command tables.

## Discovery Commands

Use these surfaces for command discovery:

| Command | Purpose |
|---|---|
| `hadara help` | Short worker-oriented help with primary lifecycle commands and pointers to advanced surfaces. |
| `hadara help lifecycle` | Canonical task loop and diagnostic side paths. |
| `hadara help command <id>` | One command's family, scope, lifecycle stage, requiredness, write boundary, examples, docs, related commands, and conflicts. |
| `hadara help family <family>` | One command family without dumping the full inventory. |
| `hadara commands --json` | Machine-readable `hadara.commands.registry.v1` registry projection. |
| `hadara tools list --json` | Compatibility capability projection from the same registry plus MCP capability surfaces. |

## Families

| Family | Meaning |
|---|---|
| `start` | Bootstrap and discovery commands. |
| `capsule-lifecycle` | Primary Task Capsule workflow and close-loop commands. |
| `proof-diagnostics` | Readiness, proof, evidence, and CI diagnostics. |
| `project-health` | Project status, doctor, and operational debt reads. |
| `docs-governance` | Bounded shared-document guidance and remediation. |
| `release-package` | Release, artifact, and package-smoke surfaces. |
| `dev-validation` | Development-only validation and replay surfaces. |
| `integrations` | Hermes, MCP, and capability-discovery integration surfaces. |
| `ui` | Terminal UI surfaces. |
| `agent-loop` | Deterministic local harness and active-run state surfaces. |
| `install` | Installer planning surfaces. |
| `advanced` | Compatibility or low-level operator surfaces hidden from default help. |

## Requiredness

| Requiredness | Meaning |
|---|---|
| `primary` | Preferred worker path for ordinary task work. |
| `conditional` | Use when the task context requires it. |
| `diagnostic` | Use to debug readiness, proof, protocol, or health issues. |
| `advanced` | Hide from default help; use only when the operator knows the specific need. |
| `release-only` | Release/package operator surface, not ordinary worker flow. |
| `dev-only` | Development validation or harness surface. |
| `integration-only` | Hermes, MCP, or integration registration surface. |
| `deprecated` | Retained temporarily for compatibility. |
| `disabled` | Documented but unavailable. |

## Write Boundaries

| Boundary | Meaning |
|---|---|
| `read-only` | Does not mutate project, capsule, evidence, or local runtime state. |
| `task-capsule-create` | Creates a new Task Capsule and task-board row. |
| `task-status-bookkeeping` | Updates bounded task status/bookkeeping files. |
| `evidence-append` | Appends evidence records or evidence migration output. |
| `close-evidence-append` | Appends close proof only after readiness passes. |
| `managed-doc-section` | Reserved for managed Markdown section writes. |
| `shared-doc-suggestion` | Produces shared-doc suggestions without applying them. |
| `shared-doc-write` | Writes bounded shared documentation or protocol remediation. |
| `project-scaffold` | Creates or upgrades scaffolded project files. |
| `release-artifact` | Writes release package artifacts. |
| `external-subprocess` | Runs external commands or validation subprocesses. |
| `release-mutation` | Approval-gated release mutation surface. |
| `local-cache` | Writes local cache or context output. |
| `integration-opt-in` | Registers integration guidance or opt-in state. |

## Primary Lifecycle

The 0.5 primary agent loop is:

```bash
hadara task status --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
```

Retired compatibility surfaces fully removed from public routing: `task next`, `task show`, `task upgrade-scaffold`, `handoff stale-problems`, `handoff suggest`, `evidence collect`, `ops status`, `init register-doc`, `docs archive`, `task lifecycle`, `task finish`, `task ready`, `task audit-close`, `task complete`, `write preflight`, `policy check-shell`, `harness replay`, `run`, `run scaffold`, `run-state show`, `run-state resume`, and `package smoke`.

Removed compatibility surfaces are not command registry entries and do not have a stable JSON response contract. Current replacements are `task status`, `task close`, `validation run`, `evidence add-command`, `policy preflight-shell`, `docs register/list/doctor/mark`, `smoke package`, and `protocol remediate`. Top-level `status` remains only as a deprecated `0.5.x` alias for `task status`.

No current CLI command writes or generates `docs/AGENT_HANDOFF.md` fragments. Shared handoff edits are deliberate documentation work before `task close`; use `task status` and `task close --dry-run --json` for phase/readiness guidance.

Diagnostics such as `harness.validate`, `evidence.lint`, and `protocol.doctor` explain blockers or drift. They do not replace the primary close loop.

## 0.4 Planned Surfaces

`docs.complete-spec` is an experimental guarded docs-governance command for moving implemented specs out of active/default routing. Drift metadata is handled through docs registry fields and guarded docs-register/mark flows; no standalone `docs mark-drift` command is exposed.

## State Consistency

`hadara task status --detail full --json` and `hadara protocol doctor --scope all --json` expose state consistency diagnostics so workers can inspect Task Board, Task Capsule, handoff, shared-state, docs-registry, and close-proof drift before close.

State consistency rollout is advisory in `0.3.1-rc.1`; state projection issues remain diagnostic unless a specific close or release gate promotes them.

## Context Routing

`hadara context graph --json` emits the read-only `hadara.contextGraph.v1` report. `hadara context graph --task T-XXXX --json` includes the task-scoped context report with read-first, read-if-needed, do-not-read, related evidence, related commands, known problems, validation suggestions, and state issues. `hadara context graph --include-code --json` additively includes C2 source, test, fixture, config, symbol, import/export, command implementation, test relation, and evidence validation projections without changing the default C1 graph output. Code-index file/byte/single-file budgets are explicit degraded partial-output warnings, not cache writes or command failures. The command is a projection only: it does not write cache files, append evidence, run validation, or patch documents.

Public `context pack` routing has been removed. Use `hadara task status --json` and `hadara task status --task T-XXXX --json` for task ingress, `hadara docs read-map --json` for registered document routing, and `hadara context graph --task T-XXXX --json` only when graph diagnostics are explicitly needed. The historical `hadara.contextPack.v1` schema remains an internal implementation detail for session-start compatibility and context-slice candidate resolution.

`hadara context slice --path <path> --from <line> --to <line> --json` emits a read-only `hadara.contextSlice.v1` original-text slice from one explicit project file. The same command supports `--tail <lines>`, `--keyword <text> --window <lines>`, `--managed-section <section-id>`, and `--symbol <name>` for bounded C2 symbol neighborhoods. Candidate slicing is retained only for internally produced candidate ids. It rejects outside-project/private/generated/local-state boundaries, including `.hadara/local/**`, and binary-looking files. It returns source hashes and line bounds, applies bounded line/window budgets, fails with `CONTEXT_SLICE_TOO_LARGE` without returning `slices[]` text when the raw payload would exceed the byte budget, and does not warm cache or mutate project state.

Public `session start` routing was removed in 0.5.0. Use `hadara task status --json` for session ingress and the active-capsule cockpit, `--task T-XXXX` for an explicit capsule, and registered docs/read-map surfaces for file-routing context. The historical `hadara.sessionStart.v1` schema remains implementation history only.

`hadara context cache status --json` emits the read-only `hadara.context.cacheStatus.v1` report. It inspects the local source-manifest cache path, compares any cached manifest with current metadata-first source discovery, and reports hit, miss, stale, or corrupt status plus stale extractor keys. It does not create cache files, warm projections, append evidence, run validation, or mutate source/docs.

`hadara context cache warm --json` emits the dry-run `hadara.context.cacheWarm.v1` report. It runs the same metadata-first source discovery and reports whether the source-manifest cache write is planned. `hadara context cache warm --execute --json` writes only `.hadara/local/cache/context/source-manifest.json` when the cache is missing, stale, corrupt, or schema-mismatched. It does not warm graph, code-index, context-pack, or context-slice projections, append evidence, run validation, or mutate source/docs.

## Advanced Surfaces

Release/package, dev validation, integrations, TUI, and installer planning commands remain available through `hadara commands --json` and `hadara help family <family>`. Package smoke validation is canonical as `hadara smoke package ...`; the old `hadara package smoke` route is no longer public routing. Deterministic agent-loop harness commands are no longer public worker CLI surfaces. Advanced surfaces are intentionally hidden from default help because ordinary worker agents should not infer release, UI, integration, or harness actions as part of every capsule.

## Adding Commands

When adding or changing a public command:

1. Add or update exactly one entry in `src/services/capability-registry.ts`.
2. Classify `family`, `scope`, `lifecycleStage`, `requiredness`, `writeBoundary`, `readOnly`, `risk`, `actor`, and canonical/alias metadata.
3. Add examples, docs, related commands, and conflicts.
4. Keep `tools list` compatibility through registry projection, not a second inventory.
5. Add or update focused tests that fail on missing registry coverage or drift.

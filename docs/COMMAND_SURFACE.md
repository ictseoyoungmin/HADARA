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
| `ui` | Dashboard and terminal UI surfaces. |
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

The ordinary worker loop is:

```bash
hadara task next --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json
hadara task audit-close --task T-XXXX --json
hadara handoff update --task T-XXXX --json
```

Diagnostics such as `harness.validate`, `proof.status`, `proof.explain`, `evidence.lint`, `protocol.doctor`, and `state.verify` explain blockers or drift. They do not replace the primary close loop.

## State Consistency

`hadara state verify --json` emits the read-only `hadara.stateProjection.v1` report. `hadara status --json`, `hadara protocol doctor --scope all --json`, and `hadara ci gate --mode advisory|strict --json` expose compact state consistency summaries so workers can see Task Board, Task Capsule, handoff, shared-state, docs-registry, and close-proof drift before close.

State consistency rollout is advisory in `0.3.1-rc.1`: `ci gate --mode strict` preserves state projection issues as warnings and does not promote historical state drift to blockers.

## Context Routing

`hadara context graph --json` emits the read-only `hadara.contextGraph.v1` report. `hadara context graph --task T-XXXX --json` includes the task-scoped context report with read-first, read-if-needed, do-not-read, related evidence, related commands, known problems, validation suggestions, and state issues. `hadara context graph --include-code --json` additively includes C2 source, test, fixture, config, symbol, import/export, command implementation, test relation, and evidence validation projections without changing the default C1 graph output. Code-index file/byte/single-file budgets are explicit degraded partial-output warnings, not cache writes or command failures. The command is a projection only: it does not write cache files, append evidence, run validation, or patch documents.

`hadara context pack --task T-XXXX --json` emits the read-only `hadara.contextPack.v1` bounded read plan over the current context graph. `--include-code` makes the underlying graph code-aware, `--budget <tokens>` records the target token budget, and `--max-items` / `--max-read-first` cap selected output. The command returns slice candidates as metadata only; it does not implement `context slice`, create cache files, append evidence, run validation, or mutate source/docs.

`hadara context cache status --json` emits the read-only `hadara.context.cacheStatus.v1` report. It inspects the local source-manifest cache path, compares any cached manifest with current metadata-first source discovery, and reports hit, miss, stale, or corrupt status plus stale extractor keys. It does not create cache files, warm projections, append evidence, run validation, or mutate source/docs; warm/write integration remains a later C6 step.

## Advanced Surfaces

Release/package, dev validation, integrations, dashboard/TUI, installer planning, and deterministic agent-loop harness commands remain available through `hadara commands --json` and `hadara help family <family>`. They are intentionally hidden from default help because ordinary worker agents should not infer release, UI, integration, or harness actions as part of every capsule.

## Adding Commands

When adding or changing a public command:

1. Add or update exactly one entry in `src/services/capability-registry.ts`.
2. Classify `family`, `scope`, `lifecycleStage`, `requiredness`, `writeBoundary`, `readOnly`, `risk`, `actor`, and canonical/alias metadata.
3. Add examples, docs, related commands, and conflicts.
4. Keep `tools list` compatibility through registry projection, not a second inventory.
5. Add or update focused tests that fail on missing registry coverage or drift.

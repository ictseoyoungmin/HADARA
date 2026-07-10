# Phase 7.1 — Command Surface Registry and Structured Help

## Status

Planned implementation specification.

## Problem

The CLI exposes many commands across task lifecycle, evidence, proof, protocol, release, dev validation, UI, integration, and agent-loop surfaces. A flat help list makes agents infer:

```text
which command is primary,
which command is diagnostic,
which command mutates state,
which command is human/release/operator only,
and which commands are safe at the current lifecycle stage.
```

Phase 7.1 removes that inference burden by introducing a command registry and registry-backed structured help.

## Goal

Create a single command surface registry that powers:

```text
hadara help
hadara help lifecycle
hadara help command <id>
hadara commands --json
hadara tools list --json, either directly or by projection
```

The default help must become lifecycle-oriented and short. Full inventory must remain available through `hadara commands --json` and family-specific help.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Delete or rename commands | Phase 7.1 classifies existing surface; portfolio decisions happen in Phase 7.2. |
| Deprecate commands | Requires audit evidence from Phase 7.2. |
| Implement docs registry | Phase 7.3. |
| Implement managed Markdown writes | Phase 7.4. |
| Change command behavior | Phase 7.1 should be discovery/help focused. |

## Authoritative Inventory Decision

HADARA must have exactly one authoritative command/capability inventory.

The authoritative source is:

```text
src/services/capability-registry.ts
```

Do not create an independent command registry that duplicates command metadata.

`hadara help`, `hadara help lifecycle`, `hadara help command <id>`, `hadara commands --json`, `hadara tools list --json`, MCP capability exposure, README command tables, and lifecycle guide outputs must be derived from `capability-registry.ts` or from tested projections of it.

If helper modules are added, they may render or project the registry, but they must not define independent command metadata.

## Existing Surface Integration

Use this pattern:

| Pattern | Rule |
|---|---|
| Required | Promote/extend existing `src/services/capability-registry.ts` into the richer command/capability inventory. |
| Allowed | Add rendering helpers such as `src/cli/help.ts` or `src/cli/commands.ts` that import from the registry. |
| Disallowed | Create `src/cli/command-registry.ts` as a second source of truth. |
| Disallowed | Keep manual help text, capability registry, README command list, and docs command matrix as independent inventories. |

`tools list` remains a compatibility projection. It must not become a separate source of truth.

`commands --json` is the full CLI command metadata projection.

## Files to Add or Change

Expected files:

```text
src/services/capability-registry.ts      # authoritative inventory
src/services/tools-list.ts               # compatibility projection from capability registry
src/cli/help.ts                          # registry-backed renderer only
src/cli/commands.ts                      # registry-backed commands --json handler
src/schemas/commands-registry.schema.json
src/schemas/command-help.schema.json
src/schemas/schema-index.json
docs/COMMAND_SURFACE.md
docs/SCHEMAS.md
tests/unit/command-registry.test.ts
tests/unit/help.test.ts
tests/unit/tools-list-command-registry.test.ts
```

If file names differ, document the reason in the task `DECISIONS.md`.

## Registry Type Model

Implement equivalent TypeScript types:

```ts
export type CommandFamily =
  | 'start'
  | 'capsule-lifecycle'
  | 'proof-diagnostics'
  | 'project-health'
  | 'docs-governance'
  | 'release-package'
  | 'dev-validation'
  | 'integrations'
  | 'ui'
  | 'agent-loop'
  | 'install'
  | 'advanced';

export type CommandScope =
  | 'project'
  | 'capsule'
  | 'task'
  | 'evidence'
  | 'proof'
  | 'docs'
  | 'release'
  | 'package'
  | 'dev'
  | 'integration'
  | 'ui'
  | 'local-state';

export type LifecycleStage =
  | 'discover'
  | 'create'
  | 'inspect'
  | 'work'
  | 'evidence'
  | 'finish'
  | 'ready'
  | 'close'
  | 'audit'
  | 'handoff'
  | 'none';

export type CommandRequiredness =
  | 'primary'
  | 'conditional'
  | 'diagnostic'
  | 'advanced'
  | 'release-only'
  | 'dev-only'
  | 'integration-only'
  | 'deprecated'
  | 'disabled';

export type CommandWriteBoundary =
  | 'read-only'
  | 'task-capsule-create'
  | 'task-status-bookkeeping'
  | 'evidence-append'
  | 'close-evidence-append'
  | 'managed-doc-section'
  | 'shared-doc-suggestion'
  | 'shared-doc-write'
  | 'project-scaffold'
  | 'release-artifact'
  | 'external-subprocess'
  | 'release-mutation'
  | 'local-cache'
  | 'integration-opt-in';

export type CommandActor =
  | 'agent-worker'
  | 'coordinator'
  | 'operator'
  | 'release-operator'
  | 'human-only';

export interface CommandRegistryExample {
  title: string;
  command: string;
  when: string;
}

export interface CommandRegistryEntry {
  id: string;                         // stable id, e.g. 'task.close'
  command: string;                    // user-visible command pattern
  summary: string;
  canonical: boolean;                 // appears as a preferred command surface
  aliasFor?: string;                  // set when this command is compatibility surface
  deprecatedCandidate?: boolean;       // true when marked for future removal/replacement review
  appearsInDefaultHelp: boolean;       // false for diagnostic/advanced/dev/release-only surfaces
  family: CommandFamily;
  scope: CommandScope;
  lifecycleStage: LifecycleStage;
  requiredness: CommandRequiredness;
  writeBoundary: CommandWriteBoundary;
  readOnly: boolean;
  risk: 'low' | 'medium' | 'high';
  actor: CommandActor;
  status: 'stable' | 'experimental' | 'planned' | 'deprecated' | 'disabled';
  schemaVersion?: string;
  since?: string;
  aliases?: string[];
  docs: string[];
  examples: CommandRegistryExample[];
  related: string[];
  conflictsWith: string[];
  notes?: string;
}
```


## Command Consolidation Policy

Phase 7.1 must not only classify commands. It must begin reducing the canonical surface.

Physical command removal is out of scope for Phase 7.1, but canonical surface reduction is in scope.

Every registry entry must declare:

```ts
canonical: boolean;
aliasFor?: string;
deprecatedCandidate?: boolean;
appearsInDefaultHelp: boolean;
```

Rules:

| Rule | Meaning |
|---|---|
| Canonical commands appear in lifecycle help and README primary paths. |
| Aliases remain executable for compatibility but do not appear in the primary lifecycle. |
| Diagnostic commands are available through help diagnostics or family help, not default help. |
| Advanced/dev/release/UI/integration commands are hidden from default worker help. |
| Deprecated candidates are not removed in Phase 7.1; they are documented for Phase 7.2 audit. |

### Initial Canonical Surface Decisions

These decisions are binding for registry metadata unless implementation discovers a concrete incompatibility and records it in the task `DECISIONS.md`.

| Current Command | Phase 7.1 Canonical Decision | Canonical / Replacement Surface |
|---|---|---|
| `task show` | Compatibility alias / non-canonical | `task status --view full` or `task.status` full view projection |
| `task complete` | Non-canonical read-only workflow guide | `task status --view guide` or lifecycle guide projection |
| `evidence collect` | Non-canonical compatibility surface | future `evidence add`; current `evidence add-command` remains primary command-log evidence path |
| `ops status` | Non-canonical alias | `status --view ops` or project status projection |
| `policy check-shell` | Non-canonical alias | `policy preflight` |
| `write preflight` | Non-canonical alias | `policy preflight` with write-boundary metadata |
| `package smoke` | Non-canonical alias candidate | `smoke package` family shape, while existing command remains executable |
| `task upgrade-scaffold` | Non-canonical remediation alias candidate | `protocol remediate --fix task-scaffold` |
| `harness validate` | Diagnostic only | `task ready` is primary readiness; `harness validate` debugs blockers |
| `dev docker-check` | Dev-only | hidden from default help |
| `run scaffold` / `run` | Advanced harness | hidden from default help |
| `dashboard serve` / `tui` | UI surface | hidden from default primary lifecycle |
| `release *` | Release-only | shown under `hadara help release`, not default worker lifecycle |
| `mcp serve`, `hermes *`, `install plan` | Integration/advanced | hidden from default worker lifecycle |

Phase 7.1 must not remove these commands. It must mark them correctly and keep compatibility.

Phase 7.2 will decide which aliases become formal deprecation candidates.

### Default Help Rule

Default `hadara` / `hadara help` must show only:

```text
start commands,
primary capsule lifecycle commands,
core proof diagnostics,
and pointers to release/dev/integration/advanced help.
```

It must not show the full inventory.


## Minimum Registry Inventory

The registry must cover every public command dispatched or documented at the time Phase 7.1 is implemented.

Seed entries must include at least:

```text
version
doctor
init
init.doctor
init.upgrade
init.register-doc
init.enable-integration

task.create
task.list
task.show
task.next
task.status
task.complete
task.finish
task.upgrade-scaffold
task.ready
task.close
task.audit-close

evidence.collect
evidence.add-command
evidence.list
evidence.lint
evidence.migrate

proof.status
proof.explain
ci.gate

debt.list
debt.show
protocol.doctor
protocol.remediate
tools.list
handoff.update
handoff.suggest
write.preflight
policy.check-shell
policy.preflight-shell
harness.validate
harness.replay
hermes.detect
hermes.export-context
mcp.serve
status
ops.status
run-state.show
run-state.resume
install.plan
smoke.run
smoke.clean-checkout
package.smoke
release.dry-run
release.publish
release.artifact
release.gate
dashboard.serve
tui
run.scaffold
run
```

If a command is intentionally excluded, add an explicit `disabled` or `advanced` entry explaining why.

## Example Entries

```ts
{
  id: 'task.close',
  command: 'hadara task close --task <task-id> [--execute] [--json]',
  summary: 'Preview or append close proof for a Task Capsule after readiness passes.',
  canonical: true,
  appearsInDefaultHelp: true,
  family: 'capsule-lifecycle',
  scope: 'capsule',
  lifecycleStage: 'close',
  requiredness: 'primary',
  writeBoundary: 'close-evidence-append',
  readOnly: false,
  risk: 'medium',
  actor: 'agent-worker',
  status: 'stable',
  schemaVersion: 'hadara.task.close.v1',
  docs: ['docs/TASK_WORKFLOW_COMMANDS.md'],
  examples: [
    { title: 'Preview close', command: 'hadara task close --task T-0001 --json', when: 'After task ready passes.' },
    { title: 'Append close proof', command: 'hadara task close --task T-0001 --execute --json', when: 'After reviewing the dry-run report.' }
  ],
  related: ['task.ready', 'task.audit-close', 'proof.status'],
  conflictsWith: ['task.finish']
}
```

```ts
{
  id: 'harness.validate',
  command: 'hadara harness validate --task <task-id> [--level draft|done] [--json]',
  summary: 'Run direct Task Capsule structure and done-level diagnostics.',
  family: 'proof-diagnostics',
  scope: 'capsule',
  lifecycleStage: 'ready',
  requiredness: 'diagnostic',
  writeBoundary: 'read-only',
  readOnly: true,
  risk: 'low',
  actor: 'agent-worker',
  status: 'stable',
  schemaVersion: 'hadara.harness.validate.v1',
  docs: ['docs/TASK_WORKFLOW_COMMANDS.md'],
  examples: [
    { title: 'Debug done readiness', command: 'hadara harness validate --task T-0001 --level done --json', when: 'When task ready reports blockers.' }
  ],
  related: ['task.ready', 'protocol.doctor', 'evidence.lint'],
  conflictsWith: []
}
```

## CLI Behavior

Add or update these command surfaces:

```bash
hadara help
hadara help lifecycle
hadara help command <id>
hadara help family <family>
hadara commands --json
hadara commands --family capsule-lifecycle --json
hadara commands --requiredness primary --json
```

`hadara` with no args should behave like `hadara help`.

### Default Help Layout

Default help should be short:

```text
HADARA — project-local operating layer for evidence-backed agent work

Start:
  hadara help lifecycle
  hadara task next --json
  hadara task status --task T-XXXX --json

Primary capsule lifecycle:
  discover/create -> inspect -> evidence -> finish -> ready -> close -> audit -> handoff

Use:
  hadara help lifecycle       Show the canonical task loop.
  hadara help command <id>    Explain one command.
  hadara commands --json      Machine-readable command registry.

Advanced surfaces:
  release/package, dev validation, integrations, dashboard/TUI, run harness.
```

Do not print the entire command inventory in default help.

## JSON Contract: `hadara.commands.registry.v1`

`hadara commands --json` should return:

```json
{
  "schemaVersion": "hadara.commands.registry.v1",
  "command": "commands",
  "ok": true,
  "registryVersion": 1,
  "filters": {
    "family": null,
    "requiredness": null
  },
  "commands": [
    {
      "id": "task.close",
      "command": "hadara task close --task <task-id> [--execute] [--json]",
      "summary": "Preview or append close proof for a Task Capsule after readiness passes.",
      "canonical": true,
      "appearsInDefaultHelp": true,
      "family": "capsule-lifecycle",
      "scope": "capsule",
      "lifecycleStage": "close",
      "requiredness": "primary",
      "writeBoundary": "close-evidence-append",
      "readOnly": false,
      "risk": "medium",
      "actor": "agent-worker",
      "status": "stable",
      "schemaVersion": "hadara.task.close.v1",
      "docs": ["docs/TASK_WORKFLOW_COMMANDS.md"],
      "related": ["task.ready", "task.audit-close", "proof.status"],
      "conflictsWith": ["task.finish"]
    }
  ],
  "issues": []
}
```

## Drift Tests

Add tests that fail when inventories drift:

| Test | Expected Assertion |
|---|---|
| `command-registry covers dispatch` | Every public top-level/subcommand dispatch has a registry id. |
| `registry ids unique` | No duplicate ids or command patterns. |
| `help uses registry` | Help output includes registry-generated primary commands. |
| `default help short` | Default help does not dump the full inventory. |
| `tools list projection` | CLI capabilities in `tools list` are generated from the authoritative capability registry. |
| `canonical surface reduction` | Default help excludes non-canonical, advanced, dev-only, release-only, and alias commands. |
| `alias mapping` | Every non-canonical compatibility command has `aliasFor`, `deprecatedCandidate`, or non-primary requiredness metadata. |
| `schemas registered` | New schema fixtures exist in `schema-index.json`. |

Implementation may use static command inventories if dynamic dispatch parsing is impractical, but the test must be explicit and easy to update.

## Documentation Updates

Create `docs/COMMAND_SURFACE.md` with:

```text
- command families,
- requiredness definitions,
- write boundary definitions,
- primary lifecycle commands,
- diagnostic commands,
- advanced/release/dev/integration/UI commands,
- rule for adding new commands.
```

Update `docs/TASK_WORKFLOW_COMMANDS.md` only to reference the registry/help surfaces. Do not duplicate the full registry.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.1-1 | Every public command has exactly one command registry entry. |
| AC-7.1-2 | `hadara help` is registry-backed and lifecycle-oriented, not a flat full command dump. |
| AC-7.1-3 | `hadara help lifecycle` shows the primary lifecycle and diagnostic side paths. |
| AC-7.1-4 | `hadara help command <id>` explains family, scope, lifecycle stage, requiredness, write boundary, examples, docs, related commands, and conflicts. |
| AC-7.1-5 | `hadara commands --json` returns `hadara.commands.registry.v1`. |
| AC-7.1-6 | `tools list` remains compatible and is generated from the same authoritative capability registry. |
| AC-7.1-7 | The registry records `canonical`, `aliasFor`, `deprecatedCandidate`, and `appearsInDefaultHelp` where applicable. |
| AC-7.1-8 | Default help hides non-canonical, advanced, dev-only, release-only, UI, integration, and alias commands. |
| AC-7.1-9 | New schema fixtures are registered. |
| AC-7.1-10 | Tests fail on missing registry metadata for a public command. |
| AC-7.1-11 | Tests fail if a second unprojected command inventory is introduced. |

## Validation

```bash
npm run test:focused -- tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/tools-list-command-registry.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help
node dist/cli/main.js help lifecycle
node dist/cli/main.js help command task.close
node dist/cli/main.js commands --json
node dist/cli/main.js commands --family capsule-lifecycle --json
```

# HADARA 0.3.0-rc.1 Protocol Migration for 0.3 Adoption

## Purpose

`0.3.0-rc.1` is the adoption migration slice for existing HADARA projects.

Phase 7 added command registry/help, document registry, managed Markdown sections, and docs cleanup surfaces. Fresh `hadara init` projects can receive those surfaces directly, but older projects initialized during the `0.2.0-rc.2` and `0.2.0-rc.3` line need a safe upgrade path.

The migration surface must answer one operator question:

| Question | Required Answer |
|---|---|
| Can this existing project or selected Task Capsule move to the 0.3 protocol surface without a broad rewrite? | Yes, through dry-run-first bounded plans with a reviewed `beforeHash` before execute. |

## Command Surface

Primary command:

```bash
hadara protocol migrate --target 0.3.0 --json
hadara protocol migrate --target 0.3.0 --execute --before-hash <dry-run summary.beforeHash> --json
```

Selected Task Capsule scope:

```bash
hadara protocol migrate --target 0.3.0 --task T-0001 --json
hadara protocol migrate --target 0.3.0 --task T-0001 --execute --before-hash <dry-run summary.beforeHash> --json
```

Profile override for projects with ambiguous metadata:

```bash
hadara protocol migrate --target 0.3.0 --profile governed --json
```

## Report Contract

The command emits `hadara.protocol.migration.v1`.

| Field | Meaning |
|---|---|
| `target.protocolVersion` | Always `0.3.0` for this migration. |
| `scope.kind` | `project` by default, `task` when `--task` is provided. |
| `detection.scaffoldGeneration` | `pre-0.3`, `partial-0.3`, `0.3`, or `unknown` based on registry, command docs, and managed-marker signals. |
| `detection.profile` | Detected or operator-selected profile. |
| `summary.beforeHash` | Hash of planned writes. Required for execute. |
| `actions[]` | Bounded write plan with expected before-existence/hash and after hash. |
| `issues[]` | Warning/error details. Errors block execute. |

## Project Scope Migration

Project-scope migration may plan these bounded writes:

| Action | Path | Purpose |
|---|---|---|
| `protocol-version` | `.hadara/protocol-version.json` | Record that the project has been reviewed for protocol `0.3.0`. |
| `docs-registry-json` | `.hadara/docs-registry.json` | Insert or merge the 0.3 docs registry seed. |
| `doc-registry-markdown` | `docs/DOC_REGISTRY.md` | Create a managed Markdown projection of the docs registry. |
| `command-surface-doc` | `docs/COMMAND_SURFACE.md` | Create registry-backed command surface docs. |
| `required-reading-cleanup` | `docs/IMPLEMENTATION_SOP.md` | Add 0.3 docs-governance rows to Required Reading. |
| `managed-required-reading-marker` | `docs/IMPLEMENTATION_SOP.md` | Wrap the Required Reading table in a managed section when safe. |

The migration must preserve existing registry entries and append missing 0.3 seed entries. It must not delete unknown documents, archive old specs, rewrite historical task capsules, run release commands, or publish packages.

## Task Scope Migration

Task-scope migration may plan these bounded writes:

| Action | Path | Purpose |
|---|---|---|
| `task-evidence-jsonl` | `tasks/<task>/evidence.jsonl` | Ensure old capsules have a required evidence index file. |
| `task-status-history-marker` | `tasks/<task>/TASK.md` | Wrap canonical Status History tables in managed markers when safe. |

Task scope must not apply project-wide docs registry, command surface, or SOP changes.

## Safety Rules

| Rule | Requirement |
|---|---|
| Dry-run first | Execute must require `--before-hash` from the reviewed dry-run report when writes are planned. |
| Bounded writes | Only listed paths may be written. |
| Conflict detection | Execute must re-check expected existence and before hash per action. |
| Atomic write | Writes use temp-file plus rename and report failures. |
| No broad cleanup | Historical docs and unregistered docs are diagnosed by docs cleanup commands, not migrated automatically. |
| No release mutation | This slice must not publish `hadara@0.3.0-rc.1`, create GitHub releases, push tags, or mutate external registries. |

## Acceptance

| Check | Expected Evidence |
|---|---|
| Project migration dry-run | `hadara.protocol.migration.v1` plans docs registry, managed marker, command docs, and Required Reading actions. |
| Project migration execute | Reviewed `beforeHash` applies bounded writes and leaves report schema-valid. |
| Missing/stale before-hash | Execute fails without writing. |
| Task migration | `--task` limits writes to the selected Task Capsule. |
| Registry visibility | `protocol.migrate` appears in command registry/help surfaces. |
| Release boundary | README distinguishes source candidate `0.3.0-rc.1` from current published npm `0.3.0-rc.0`. |

## Non-Goals

| Non-Goal | Reason |
|---|---|
| npm publish for `0.3.0-rc.1` | Deferred until later feature/fix work and a final readiness capsule. |
| Full automatic legacy doc cleanup | Docs cleanup surfaces already provide explicit status/required-reading/archive plans. |
| Historical capsule mass migration | Operators should select task scope intentionally. |
| Multi-agent runtime migration | This command upgrades protocol surfaces, not runtime coordination. |

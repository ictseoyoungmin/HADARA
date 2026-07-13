# HADARA 0.4.5 Docs Registry v3 and Init Cleanup Design

## Status

| Field | Value |
|---|---|
| State | Proposed |
| Owner | HADARA-dev |
| Release Target | 0.4.5 |
| Source Task | T-0585 |
| Scope | Design only |

## Problem

The current docs registry model works for 0.4.4, but it conflates distinct concepts:

| Concern | Current Field | Problem |
|---|---|---|
| Local project identity | `projectProfile` | `hadara-dev` is stored beside init profiles even though it is not an init profile. |
| HADARA scaffold profile | `projectProfile` and `documents[].profiles` | `basic`, `standard`, and `governed` describe scaffold/governance behavior, not project identity. |
| Document applicability | `documents[].profiles` | Correctly uses init profiles, but its name makes it easy to confuse with project identity. |
| Document origin | `owner`, `generatedBy`, `updatedByCommands` | Origin is inferred from several fields instead of recorded as a first-class contract. |
| Registry mutation | `docs register` only | Existing entries cannot be safely updated, archived, superseded, or unregistered through public CLI. |
| Init task directory | `tasks/.gitkeep` scaffold entry | `init upgrade` can recreate an unnecessary `.gitkeep` in projects that already contain task capsules. |

The immediate 0.4.4 hotfix kept the compatibility model:

- document entry `profiles` must contain only `basic`, `standard`, or `governed`
- HADARA-dev identity may remain in top-level `projectProfile` until migration

That is compatible, but not the final model.

## Design Goals

| Goal | Requirement |
|---|---|
| Separate identity from profile | Local project identity and HADARA init profile must be different fields. |
| Make document origin explicit | Registry consumers should not infer provenance from `owner` or `generatedBy` text. |
| Keep registry a desired-state model | The registry describes the current document system, not a historical event log. |
| Avoid raw JSON edits for normal work | CLI should support common registry mutation operations. |
| Preserve compatibility | Existing v1/v2 registries remain readable and migratable. |
| Keep 0.4.5 bounded | Implement in staged capsules with small, testable behavior changes. |

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Domain profiles such as `game-dev` | Domain identity belongs to project metadata, not HADARA init profiles. |
| Broad document cleanup in the migration capsule | Cleanup needs policy decisions per entry. |
| Replacing docs registry with a historical event log | Desired state should stay compact and current. |
| Changing Task Capsule close-proof semantics | Registry design is independent of task close proof. |

## Registry v3 Shape

### Top Level

```json
{
  "schemaVersion": "hadara.docsRegistry.v3",
  "registryVersion": 3,
  "project": {
    "id": "hadara-dev",
    "name": "HADARA",
    "hadaraProfile": "governed"
  },
  "documents": []
}
```

| Field | Meaning |
|---|---|
| `project.id` | Stable local project identity, for example `hadara-dev`, `pricing-service`, or `my-game`. |
| `project.name` | Human display name. |
| `project.hadaraProfile` | HADARA scaffold/governance profile: `basic`, `standard`, or `governed`. |
| `projectProfile` | Deprecated compatibility field for v1/v2 only; do not write in v3. |

### Document Entry

```json
{
  "path": "docs/ARCHITECTURE.md",
  "title": "ARCHITECTURE",
  "kind": "architecture",
  "status": "reference",
  "scope": "project",
  "applicableProfiles": ["standard", "governed"],
  "origin": {
    "type": "hadara-scaffold",
    "generator": "hadara init",
    "template": "architecture"
  },
  "owner": "project",
  "updateOwner": "human",
  "editPolicy": "agent-editable-with-review",
  "readWhen": ["only-when-linked"],
  "readTier": "conditional-reference",
  "requiredReading": false,
  "closeSourceRole": "task-dependent"
}
```

| Field | Meaning |
|---|---|
| `applicableProfiles` | Init profiles where this document is scaffolded or normally applies. |
| `origin.type` | First-class provenance category. |
| `origin.generator` | Command, task, or system that produced the initial entry when known. |
| `origin.template` | Template id for scaffold-generated documents. |
| `origin.taskId` | Task id for task-generated documents. |
| `owner` | Content responsibility, not necessarily generator identity. |

### Origin Types

| Type | Meaning | Example |
|---|---|---|
| `hadara-scaffold` | Created from init/profile scaffold templates. | `AGENTS.md`, `docs/HADARA_WORKFLOW.md` |
| `hadara-projection` | Generated projection from a structured canon. | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` managed state block |
| `task-generated` | Created by a specific Task Capsule. | Release note, dogfood report, implementation plan |
| `project-authored` | Authored for the local product/project. | `docs/MODEL_TRAINING_GUIDE.md` |
| `imported` | Brought in from external or historical source. | Archived prior planning document |

## Migration Rules

| Source | v3 Result |
|---|---|
| `projectProfile: "hadara-dev"` | `project.id = "hadara-dev"`, `project.name = "HADARA"`, `project.hadaraProfile = "governed"` |
| `projectProfile: "basic"` | `project.hadaraProfile = "basic"` and infer `project.id` from package name or directory. |
| `projectProfile: "standard"` | `project.hadaraProfile = "standard"` and infer `project.id` from package name or directory. |
| `projectProfile: "governed"` | `project.hadaraProfile = "governed"` and infer `project.id` from package name or directory. |
| `documents[].profiles` | `documents[].applicableProfiles` |
| `generatedBy: "hadara init"` | `origin.type = "hadara-scaffold"`, `origin.generator = "hadara init"` |
| `generatedBy: "T-XXXX"` | `origin.type = "task-generated"`, `origin.taskId = "T-XXXX"` |
| missing provenance | choose `project-authored` for active project docs, `imported` for archived/historical paths |

Compatibility readers must continue to accept v1/v2. Writers should emit v3 after migration.

## Registry Mutation CLI

`docs register` is insufficient because it only adds new entries. 0.4.5 should add explicit desired-state mutation commands.

| Command | Purpose | Default Mode |
|---|---|---|
| `hadara docs update --path <path> --set key=value ... --json` | Change fields on an existing entry. | dry-run |
| `hadara docs archive --path <path> --reason <text> --json` | Mark an existing entry as `archived` or `historical` with excluded read behavior. | dry-run |
| `hadara docs supersede --path <old> --by <new> --reason <text> --json` | Mark old entry as `superseded` and link replacement. | dry-run |
| `hadara docs unregister --path <path> --reason <text> --json` | Remove an entry that should not remain desired state. | dry-run |
| `hadara docs render --execute --json` | Regenerate the human projection from JSON registry. | dry-run |

All write commands should support:

- dry-run first
- before-hash or equivalent reviewed-plan guard for execute
- controlled-token validation
- JSON report with `before`, `after`, `changedFields`, and `issues`
- optional `--task T-XXXX --attach-evidence`

## Desired-State Deletion Policy

The registry is not a historical log. Stale entries can be removed when they do not represent desired current state.

| Situation | Action |
|---|---|
| File remains useful as history | Mark `historical` or `archived`; set read behavior to `never-default` and close source to `excluded`. |
| Replaced by another document | Mark `superseded`; link replacement. |
| File missing and entry has no value | `unregister` the entry. |
| Canonical/profile seed document is wrong | Fix seed/generation contract first; do not only edit registry. |
| Unsure whether the document matters | Prefer `historical` over deletion. |

## Docs Register Default Changes

When registering arbitrary project documents, defaults should no longer imply HADARA ownership.

| Field | Current Default | 0.4.5 Default |
|---|---|---|
| `owner` | `hadara-docs` | `project` |
| `origin.type` | inferred/missing | `project-authored` |
| `applicableProfiles` | current profile mapping | omitted unless supplied or scaffold-derived |
| `updateOwner` | `human` | `human` |
| `editPolicy` | optional | `agent-editable-with-review` unless stricter option supplied |

HADARA scaffold docs should still use `owner: "hadara-docs"` and `origin.type: "hadara-scaffold"` or `hadara-projection`.

## Init `tasks/.gitkeep` Policy

`tasks/.gitkeep` is not useful once Task Capsules exist and should not be generated by 0.4.5.

| Scenario | Expected Behavior |
|---|---|
| Fresh `hadara init` | Create `tasks/` directory if needed; do not create `tasks/.gitkeep`. |
| `init upgrade` in project without `tasks/` | Create `tasks/` directory if needed; do not create `.gitkeep`. |
| `init upgrade` in project with task capsules | Do not create `.gitkeep`. |
| Existing `.gitkeep` | Leave alone unless an explicit cleanup/remediation command removes it. |

Implementation should remove `tasks/.gitkeep` from scaffold file lists and replace it with an explicit directory creation action when needed.

## Staged Implementation Capsules

| Capsule | Scope | Acceptance |
|---|---|---|
| 1. Init and compatibility hotfix | Preserve `hadara-dev` project identity during `init upgrade`; stop creating `tasks/.gitkeep`; add regression tests. | Existing v1/v2 registry stays compatible; upgrade no longer rewrites identity or recreates `.gitkeep`. |
| 2. docsRegistry v3 schema/read model | Add v3 types, normalizer, migration read path, schema fixture, and docs doctor diagnostics. | v1/v2/v3 registries read into the same internal model; v3 writes separate `project.id` and `project.hadaraProfile`. |
| 3. Registry mutation commands | Add update/archive/supersede/unregister/render with dry-run-first write guards. | Common cleanup no longer requires raw JSON edits. |
| 4. docs register defaults | Make user-authored docs default to project ownership and explicit origin. | New project documents no longer look like HADARA scaffold docs. |
| 5. Dogfood and migration cleanup | Run fresh init/upgrade and registry cleanup dogfood on `/tmp` projects and HADARA-dev. | No document/profile drift; docs doctor passes; generated docs are clear. |

Capsule 1 can land before full v3 because it prevents immediate recurrence. Capsules 2 through 4 should land before broad registry cleanup.

## Validation Plan

| Check | Evidence |
|---|---|
| Unit tests for init upgrade identity preservation and `.gitkeep` behavior | Focused init tests |
| Unit tests for v1/v2/v3 registry normalization | Docs registry tests |
| Command tests for docs mutation dry-run/execute guards | CLI unit tests |
| Fresh init dogfood for `basic`, `standard`, `governed` | `/tmp` smoke |
| HADARA-dev registry migration dry-run | Task evidence |
| Docs doctor all-scope pass | `hadara docs doctor --scope all --json` |

## Open Questions

| ID | Question | Default Answer |
|---|---|---|
| Q1 | Should v3 keep deprecated `projectProfile` for one minor release? | Read only, not written. |
| Q2 | Should `docs unregister` require `--allow-missing-file` when the file does not exist? | No; missing file is a valid unregister use case, but reason is required. |
| Q3 | Should `docs render` update `docs/DOC_REGISTRY.md` even when that projection is absent? | Create only for governed/HADARA-dev projects or when explicitly requested. |
| Q4 | Should domain presets such as game development exist? | Not as HADARA profiles; use project-authored docs and project id/name. |

## Decision

Proceed with 0.4.5 as a small registry semantics and init cleanup line:

1. prevent immediate recurrence in init upgrade
2. introduce docsRegistry v3 without breaking v1/v2
3. replace raw JSON cleanup with dry-run-first registry mutation commands
4. dogfood fresh projects before any stable publish

# Phase 7.4 — Managed Sections and Safe Patch Plans

## Status

Planned implementation specification.

## Problem

Agents repeatedly update Markdown state docs manually. Manual updates are easy to skip, and post-close edits can invalidate close proof hashes.

But broad automatic Markdown rewriting is dangerous because docs contain user-authored prose, rationale, decisions, and historical evidence.

Phase 7.4 creates a bounded mechanism: HADARA may patch declared managed sections only, with dry-run-first and before-hash guards.

## Goal

Define managed Markdown sections, patch plan reports, and hash-guarded apply behavior.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Rewrite whole Markdown files | Only managed sections or existing bounded write paths are allowed. |
| Auto-convert all legacy docs | Legacy docs without markers remain usable and should receive suggestions/warnings, not destructive rewrites. |
| Auto-update freeform architecture/decision prose | Human-authored rationale remains outside managed sections. |
| Change close-proof model | Close-source edits after close still invalidate previous close proof. |
| Move/delete docs | Phase 7.5 cleanup planning only. |

## Managed Section Marker Format

Use HTML comments:

```md
<!-- hadara:managed:start task-board {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"replace","version":1} -->
| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0001 | Example | Draft | tasks/T-0001-example |  |
<!-- hadara:managed:end task-board -->
```

Rules:

| Rule | Requirement |
|---|---|
| Start/end required | A managed section is valid only if both markers exist and ids match. |
| JSON metadata required | Start marker must contain valid JSON metadata. |
| Unique per file | Duplicate section ids in one file are an error. |
| No nesting | Nested managed sections are invalid. |
| Preserve surrounding prose | Patch applies only between markers unless the section owner explicitly owns markers. |
| Hash guarded | Apply must verify target file before-hash and section before-hash. |

## Managed Section Metadata

```ts
export interface ManagedSectionMetadata {
  schema: 'hadara.managedSection.v1';
  owner: string;                 // e.g. 'task.finish', 'docs.registry', 'handoff.update'
  kind: 'markdown-table' | 'key-value-table' | 'markdown-list' | 'single-block' | 'json-code-block';
  mode: 'replace' | 'insert-row' | 'update-row' | 'append-block';
  version: number;
  required?: boolean;
  closeSourceRole?: 'included' | 'excluded' | 'task-dependent';
}
```

## Initial Managed Section Targets

Phase 7.4 must implement the complete initial managed-section target set, not a reduced target.

The project has already accumulated repeated close-source and status-document churn. Shrinking the initial target to only one or two files would likely create another refactor phase immediately after Phase 7.4. Therefore, Phase 7.4 should implement the full first useful set while still preserving strict write boundaries.

| File | Section ID | Owner | Patch Mode | Notes |
|---|---|---|---|---|
| `docs/TASK_BOARD.md` | `task-board` | `task.finish` / `task.create` | update-row | Existing bounded behavior can bridge to managed marker. |
| `tasks/T-XXXX/TASK.md` | `task-status-history` | `task.finish` | append-block/update-row | Only status/history block, not whole task prose. |
| `tasks/T-XXXX/HANDOFF.md` | `task-handoff-current-state` | `handoff.update` / `handoff.suggest` | replace/update-row | Task-local handoff current-state table only; not freeform handoff prose. |
| `docs/AGENT_HANDOFF.md` | `current-state` | `handoff.update` | replace/update-row | Prefer suggestion first; execute must be explicit. |
| `docs/PROJECT_STATE.md` | `project-state-metadata` | `project-state.update` or controlled patch planner | update-row | Metadata/latest/active state only; not full project history prose. |
| `docs/IMPLEMENTATION_SOP.md` | `required-reading` | `init.register-doc` / `docs.cleanup` | insert-row/update-row | Do not auto-prune until Phase 7.5. |
| `docs/DOC_REGISTRY.md` | `doc-registry-summary` | `docs.registry` | replace | Projection from `.hadara/docs-registry.json`. |

Do not mark broad `ARCHITECTURE.md`, `DECISIONS.md`, `SECURITY_MODEL.md`, release notes prose, project-specific specs, or freeform rationale as managed in Phase 7.4 unless the section is clearly tabular/generated and explicitly owned.

Full target does not mean broad rewrite. It means all first-class status/handoff/registry managed sections are included with narrow section ownership.

## Patch Plan Type

```ts
export interface ManagedPatchPlanReport {
  schemaVersion: 'hadara.docs.patchPlan.v1';
  command: string;
  mode: 'dry-run';
  ok: boolean;
  targetPath: string;
  targetBeforeHash: string;
  sections: ManagedSectionPatch[];
  executeCommand?: string;
  issues: ManagedPatchIssue[];
}

export interface ManagedSectionPatch {
  sectionId: string;
  owner: string;
  kind: string;
  operation: 'replace' | 'insert-row' | 'update-row' | 'append-block' | 'noop';
  sectionBeforeHash: string;
  sectionAfterHash: string;
  changed: boolean;
  preview: {
    beforeExcerpt?: string;
    afterExcerpt?: string;
    diffSummary: string;
  };
}

export interface ManagedPatchIssue {
  severity: 'info' | 'warning' | 'error';
  code: string;
  path?: string;
  sectionId?: string;
  message: string;
}
```

Issue codes:

| Code | Meaning |
|---|---|
| `MANAGED_SECTION_MISSING` | Requested section marker absent. |
| `MANAGED_SECTION_DUPLICATE` | Duplicate section id in one file. |
| `MANAGED_SECTION_NESTED` | Nested markers detected. |
| `MANAGED_SECTION_INVALID_METADATA` | Start marker JSON invalid or schema mismatch. |
| `MANAGED_PATCH_OUTSIDE_BOUNDARY` | Patch would change text outside managed region. |
| `MANAGED_PATCH_BEFORE_HASH_REQUIRED` | Execute requested without hash. |
| `MANAGED_PATCH_BEFORE_HASH_MISMATCH` | Target file changed since reviewed dry-run. |
| `MANAGED_PATCH_SECTION_HASH_MISMATCH` | Managed section changed since plan. |
| `MANAGED_PATCH_UNSUPPORTED_OWNER` | Command attempted to patch a section it does not own. |

## CLI Surfaces

Read-only inspection:

```bash
hadara docs managed list --json
hadara docs managed explain --path docs/TASK_BOARD.md --json
```

Patch service:

```bash
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json
hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --execute --before-hash sha256:... --json
```

Rules for `docs patch`:

| Rule | Requirement |
|---|---|
| Dry-run default | No write unless `--execute`. |
| Content file confined | `--content-file` must be inside project root or HADARA local state and must not be private evidence. |
| Managed body only | Content file supplies replacement body only, not arbitrary full file. |
| Owner respected | Generic manual patch owner should be `operator`; command-owned patches must use their command id. |
| Before hash required | Execute requires target file hash from dry-run. |
| No marker removal | Patch must not remove start/end markers. |

## Integration With Existing Commands

Phase 7.4 must not break current bounded writes.

| Command | Phase 7.4 Behavior |
|---|---|
| `task finish --json` | Include managed patch metadata for `TASK.md`/`TASK_BOARD.md` when markers exist. Legacy bounded behavior still works. |
| `task finish --execute` | May use managed section engine internally for marked files; must not broaden write boundary. |
| `handoff suggest --json` | May include patch plan fragments for `AGENT_HANDOFF.md`, but remains read-only. |
| `handoff update --execute` or current write path | If section markers exist, use managed section apply; if absent, preserve existing behavior or fail with explicit issue depending on current command contract. |
| `init register-doc` | May use managed required-reading section when present. |

## Legacy Compatibility

For existing docs without markers:

```text
- read commands must still work;
- doctor should report unmanaged sections as warnings only;
- existing bounded command writes may continue;
- no command should insert markers into many legacy docs without an explicit dry-run plan.
```

Optional marker bootstrap command may be added only if dry-run-first:

```bash
hadara docs managed bootstrap --path docs/TASK_BOARD.md --json
hadara docs managed bootstrap --path docs/TASK_BOARD.md --execute --before-hash sha256:... --json
```

If implemented, bootstrap must be limited to known generated/table docs.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.4-1 | Managed section parser handles valid markers, missing markers, duplicate ids, nesting, and invalid metadata. |
| AC-7.4-2 | Patch plans prove no changes occur outside managed markers. |
| AC-7.4-3 | `docs patch` dry-run returns `hadara.docs.patchPlan.v1`. |
| AC-7.4-4 | `docs patch --execute` requires matching `--before-hash`. |
| AC-7.4-5 | Hash mismatch fails closed with no write. |
| AC-7.4-6 | Existing task finish behavior remains compatible on legacy docs. |
| AC-7.4-7 | Fresh init docs include markers only for safe generated sections. |
| AC-7.4-8 | No broad prose docs are automatically rewritten. |

## Validation

```bash
npm run test:focused -- tests/unit/managed-sections.test.ts tests/unit/docs-patch.test.ts tests/unit/task-finish.test.ts tests/unit/handoff.test.ts tests/unit/init.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js docs managed list --json
node dist/cli/main.js docs managed explain --path docs/TASK_BOARD.md --json
node dist/cli/main.js docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json
```

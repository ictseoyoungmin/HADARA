# Phase 7.5 — Docs Cleanup Operations

## Status

Planned implementation specification.

## Problem

Once documents are registered and classified, HADARA needs a safe way to mark old plans/specs as historical or superseded so agents do not treat them as current instructions.

Cleanup must not delete evidence or erase history.

## Goal

Add dry-run-first document status operations that update the document registry and default reading guidance.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Delete documents | Deletion is not part of Phase 7.5. |
| Move files by default | Archive moves can break links and evidence references. |
| Rewrite historical docs | Status lives in registry; historical files are preserved. |
| Auto-prune Required Reading without managed support | Required Reading edits must use Phase 7.4 managed sections or remain suggestions. |
| Mark docs superseded without target | Superseded docs need a replacement target. |

## Status Transitions

Allowed transitions:

| From | To | Requirement |
|---|---|---|
| active | reference | No replacement required. |
| active | historical | Reason required. |
| active | superseded | `--by <path>` required. |
| reference | historical | Reason required. |
| reference | superseded | `--by <path>` required. |
| historical | archived | Dry-run only in Phase 7.5. |
| superseded | archived | Dry-run only in Phase 7.5. |

Disallowed by default:

| From | To | Reason |
|---|---|---|
| archived | canonical | Requires restoration capsule. |
| superseded | canonical | Requires review. |
| historical | active | Requires review. |
| any | deleted | Deletion not supported. |
| canonical | superseded | Requires `--force-canonical` or explicit task decision. |

## Commands

```bash
hadara docs mark --path <path> --status reference --reason <text> --json
hadara docs mark --path <path> --status historical --reason <text> --json
hadara docs mark --path <path> --status superseded --by <path> --reason <text> --json
hadara docs mark --path <path> --status superseded --by <path> --reason <text> --execute --before-hash sha256:... --json

hadara docs archive --status superseded --json
hadara docs archive --status historical --json

hadara docs required-reading --json
```

Phase 7.5 should not implement `docs archive --execute` unless the task makes an explicit decision with link-safety tests. Prefer dry-run-only archive plans.

## `docs mark` Behavior

Dry-run report:

```json
{
  "schemaVersion": "hadara.docs.mark.v1",
  "command": "docs.mark",
  "mode": "dry-run",
  "ok": true,
  "path": "docs/specs/old-plan.md",
  "beforeStatus": "active",
  "afterStatus": "superseded",
  "supersededBy": "docs/specs/new-plan.md",
  "reason": "Replaced by Phase 7 surface-refactor spec.",
  "registryPath": ".hadara/docs-registry.json",
  "beforeHash": "sha256:...",
  "impact": {
    "registryPatchPlanned": true,
    "defaultRequiredReading": "remove-after-execute",
    "managedRequiredReadingPatchAvailable": false,
    "archiveCandidate": true
  },
  "issues": []
}
```

Execute mode:

```text
- requires --before-hash matching the registry file hash;
- updates only `.hadara/docs-registry.json`;
- does not edit the target doc body;
- does not move files;
- may emit a managed patch suggestion for Required Reading if Phase 7.4 markers exist.
```

## `docs archive` Behavior

Dry-run report:

```json
{
  "schemaVersion": "hadara.docs.archivePlan.v1",
  "command": "docs.archive",
  "mode": "dry-run",
  "ok": true,
  "filters": { "status": "superseded" },
  "candidates": [
    {
      "path": "docs/specs/old-plan.md",
      "currentStatus": "superseded",
      "suggestedArchivePath": "docs/archive/specs/old-plan.md",
      "referencedByActiveDocs": [],
      "referencedByTaskEvidence": ["tasks/T-0001/EVIDENCE.md"],
      "risk": "evidence-link-reference",
      "executeSupported": false
    }
  ],
  "issues": []
}
```

If future work allows execute, it must fail when active/canonical docs or task evidence reference the file.

## Required Reading Rules

Statuses excluded from default Required Reading:

```text
historical
superseded
archived
```

`docs required-reading --json` returns effective default reading:

```json
{
  "schemaVersion": "hadara.docs.requiredReading.v1",
  "command": "docs.required-reading",
  "ok": true,
  "documents": [
    {
      "path": "docs/IMPLEMENTATION_SOP.md",
      "status": "canonical",
      "readWhen": ["session-start"],
      "reason": "canonical protocol doc"
    }
  ],
  "excluded": [
    {
      "path": "docs/specs/old-plan.md",
      "status": "superseded",
      "reason": "superseded docs are not default required reading"
    }
  ],
  "issues": []
}
```

If this schema is implemented, register it as `hadara.docs.requiredReading.v1`.

## Docs Doctor Additions

Add warnings/errors:

| Code | Meaning |
|---|---|
| `DOC_SUPERSEDED_REQUIRED_READING` | Superseded doc appears in Required Reading. |
| `DOC_HISTORICAL_REQUIRED_READING` | Historical doc appears in Required Reading. |
| `DOC_SUPERSEDES_MISSING_TARGET` | Superseded doc points to missing replacement. |
| `DOC_ARCHIVE_CANDIDATE` | Superseded/historical doc can be considered for archive planning. |
| `DOC_CLEANUP_INVALID_TRANSITION` | Requested status transition is not allowed. |
| `DOC_CLEANUP_CANONICAL_REVIEW_REQUIRED` | Attempt to supersede canonical doc without explicit review flag. |

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.5-1 | `docs mark` dry-run validates allowed transitions and reports impact. |
| AC-7.5-2 | `docs mark --execute` requires matching registry before-hash. |
| AC-7.5-3 | Execute updates only `.hadara/docs-registry.json` unless a separate managed patch command is explicitly run. |
| AC-7.5-4 | Superseded/historical/archived docs are excluded from effective default required reading. |
| AC-7.5-5 | `docs archive` is dry-run by default and does not move files. |
| AC-7.5-6 | `docs doctor` detects stale docs in Required Reading and missing supersededBy targets. |
| AC-7.5-7 | Tests cover invalid transitions, stale hash, canonical review guard, and missing replacement target. |

## Validation

```bash
npm run test:focused -- tests/unit/docs-mark.test.ts tests/unit/docs-archive.test.ts tests/unit/docs-required-reading.test.ts tests/unit/docs-doctor.test.ts
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js docs mark --path docs/specs/old-plan.md --status superseded --by docs/specs/new-plan.md --reason "Replaced" --json
node dist/cli/main.js docs archive --status superseded --json
node dist/cli/main.js docs required-reading --json
node dist/cli/main.js docs doctor --json
```

# Phase 7.3 — Document Registry and Docs Doctor

## Status

Planned implementation specification.

## Problem

HADARA projects mix several document types:

```text
protocol docs
project state docs
active specs
historical specs
release docs
handoff docs
task capsule docs
optional integration docs
superseded planning docs
```

Agents need to know which docs are canonical, active, reference-only, historical, superseded, or archived. Required Reading must not accidentally include stale plans.

## Goal

Introduce a project-owned document registry and docs doctor.

The registry classifies documents by owner, kind, status, scope, read-time, update owner, and managed sections.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Rewrite existing docs broadly | Phase 7.3 is classification/doctor first. |
| Move or archive files | Phase 7.5 plans cleanup; execute archive is out of scope by default. |
| Implement managed patching | Phase 7.4. |
| Replace Task Capsules | Task Capsules remain the unit of work/evidence. |
| Make all historical docs invalid | Historical docs are preserved but not default required reading. |

## Registry Location

Use project-owned reproducible state:

```text
.hadara/docs-registry.json
```

Human-readable projection:

```text
docs/DOC_REGISTRY.md
```

Rules:

| Rule | Requirement |
|---|---|
| Registry source of truth | `.hadara/docs-registry.json` is the machine-readable source of truth. |
| Human projection | `docs/DOC_REGISTRY.md` summarizes registry state and can be regenerated/planned later. |
| Existing projects | If registry is missing, `docs list/doctor` may infer a read-only provisional view but must report `DOC_REGISTRY_MISSING`. |
| Fresh init | `hadara init` must create a registry seeded from the selected profile. |
| Init upgrade | `hadara init upgrade --execute` may add missing registry entries without rewriting unrelated docs. |

## Registry Schema

Implement an equivalent TypeScript model:

```ts
export type DocumentStatus =
  | 'canonical'
  | 'active'
  | 'reference'
  | 'historical'
  | 'superseded'
  | 'archived';

export type DocumentKind =
  | 'protocol'
  | 'project-state'
  | 'handoff'
  | 'task-board'
  | 'workflow-guide'
  | 'architecture'
  | 'decision-log'
  | 'test-strategy'
  | 'security-model'
  | 'roadmap'
  | 'release'
  | 'spec'
  | 'implementation-guide'
  | 'integration-guide'
  | 'task-capsule'
  | 'schema-reference'
  | 'historical-plan'
  | 'unknown';

export type ReadWhen =
  | 'session-start'
  | 'task-start'
  | 'task-close'
  | 'release-work'
  | 'docs-work'
  | 'debugging'
  | 'integration-work'
  | 'only-when-linked'
  | 'never-default';

export interface ManagedSectionRef {
  id: string;
  owner: string;
  kind: string;
  required: boolean;
}

export interface DocumentRegistryEntry {
  path: string;
  title: string;
  owner: string;
  kind: DocumentKind;
  status: DocumentStatus;
  scope: 'project' | 'task' | 'release' | 'integration' | 'repo' | 'local';
  profiles: Array<'basic' | 'standard' | 'governed' | 'hadara-dev'>;
  readWhen: ReadWhen[];
  requiredReading: boolean;
  updateOwner: 'human' | 'hadara-init' | 'hadara-task' | 'hadara-docs' | 'release-operator' | 'mixed';
  updatedByCommands: string[];
  managedSections: ManagedSectionRef[];
  closeSourceRole: 'included' | 'excluded' | 'task-dependent' | 'unknown';
  supersedes: string[];
  supersededBy?: string;
  generatedBy?: string;
  notes?: string;
}

export interface DocumentRegistryFile {
  schemaVersion: 'hadara.docs.registry.v1';
  registryVersion: number;
  projectProfile?: 'basic' | 'standard' | 'governed' | 'hadara-dev';
  generatedAt?: string;
  documents: DocumentRegistryEntry[];
}
```

## Fresh Init Seeding

Integrate with existing init profiles.

Minimum profile seed:

| Path | basic | standard | governed | Kind | Status | Read When |
|---|---:|---:|---:|---|---|---|
| `AGENTS.md` | yes | yes | yes | protocol | canonical | session-start |
| `docs/IMPLEMENTATION_SOP.md` | yes | yes | yes | protocol | canonical | session-start |
| `docs/TASK_WORKFLOW_COMMANDS.md` | yes | yes | yes | workflow-guide | canonical | task-start |
| `docs/PROJECT_STATE.md` | yes | yes | yes | project-state | canonical | session-start |
| `docs/AGENT_HANDOFF.md` | yes | yes | yes | handoff | canonical | session-start |
| `docs/TASK_BOARD.md` | yes | yes | yes | task-board | active | task-start |
| `docs/ARCHITECTURE.md` | no | yes | yes | architecture | reference | only-when-linked |
| `docs/DEVELOPMENT_SLICES.md` | no | yes | yes | roadmap | active | task-start |
| `docs/DECISIONS.md` | no | yes | yes | decision-log | reference | only-when-linked |
| `docs/TEST_STRATEGY.md` | no | yes | yes | test-strategy | reference | debugging |
| `docs/SECURITY_MODEL.md` | no | no | yes | security-model | reference | only-when-linked |
| `docs/REFACTOR_LOG.md` | no | no | yes | historical-plan | historical | never-default |
| `docs/ROADMAP.md` | no | no | yes | roadmap | reference | only-when-linked |

Phase 7.3 may adjust exact profile coverage if current init profile definitions differ, but tests must lock the chosen seed.

## Commands

Add:

```bash
hadara docs list --json
hadara docs list --status canonical --json
hadara docs list --read-when session-start --json
hadara docs doctor --json
hadara docs doctor --scope registry|profile|required-reading|links|all --json
hadara docs explain --path docs/PROJECT_STATE.md --json
```

No `--execute` command is required in Phase 7.3 except existing `init upgrade` integration if needed.

## JSON Contract: `hadara.docs.list.v1`

```json
{
  "schemaVersion": "hadara.docs.list.v1",
  "command": "docs.list",
  "ok": true,
  "source": {
    "registryPath": ".hadara/docs-registry.json",
    "registryPresent": true,
    "inferred": false
  },
  "filters": {
    "status": "canonical",
    "readWhen": null
  },
  "documents": [
    {
      "path": "docs/PROJECT_STATE.md",
      "title": "PROJECT_STATE",
      "kind": "project-state",
      "status": "canonical",
      "readWhen": ["session-start"],
      "requiredReading": true,
      "updateOwner": "mixed",
      "managedSections": []
    }
  ],
  "issues": []
}
```

## JSON Contract: `hadara.docs.doctor.v1`

```json
{
  "schemaVersion": "hadara.docs.doctor.v1",
  "command": "docs.doctor",
  "ok": true,
  "scope": "all",
  "summary": {
    "registryPresent": true,
    "registeredDocuments": 12,
    "missingRegisteredDocuments": 0,
    "unregisteredActiveLookingDocuments": 0,
    "requiredReadingIssues": 0,
    "canonicalConflicts": 0
  },
  "issues": []
}
```

Issue codes:

| Code | Severity | Meaning |
|---|---|---|
| `DOC_REGISTRY_MISSING` | warning | Registry missing; report is inferred. |
| `DOC_REGISTERED_FILE_MISSING` | error | Registry references a missing file. |
| `DOC_UNREGISTERED_REQUIRED_READING` | warning | Required Reading references an unregistered doc. |
| `DOC_SUPERSEDED_REQUIRED_READING` | warning | Superseded doc appears in default Required Reading. |
| `DOC_CANONICAL_CONFLICT` | error | Multiple canonical docs claim the same kind/scope. |
| `DOC_UNKNOWN_STATUS` | error | Registry status enum invalid. |
| `DOC_UNREGISTERED_ACTIVE_LOOKING` | warning | Active-looking spec/plan not registered. |
| `DOC_INIT_PROFILE_DRIFT` | warning/error | Init profile generated docs and registry disagree. |

## JSON Contract: `hadara.docs.explain.v1`

```json
{
  "schemaVersion": "hadara.docs.explain.v1",
  "command": "docs.explain",
  "ok": true,
  "path": "docs/PROJECT_STATE.md",
  "document": {
    "kind": "project-state",
    "status": "canonical",
    "readWhen": ["session-start"],
    "requiredReading": true,
    "updateOwner": "mixed",
    "closeSourceRole": "included",
    "supersededBy": null
  },
  "guidance": {
    "shouldReadNow": true,
    "reason": "Canonical project-state document used at session start.",
    "safeToAutoUpdate": false,
    "managedSections": []
  },
  "issues": []
}
```

## Required Reading Integration

Phase 7.3 must not rewrite Required Reading tables broadly. It should:

```text
- read Required Reading from AGENTS.md / IMPLEMENTATION_SOP.md when available;
- compare it with registry status;
- report drift through docs doctor;
- let Phase 7.4/7.5 handle managed patching and cleanup.
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.3-1 | Fresh `hadara init --profile basic|standard|governed` creates `.hadara/docs-registry.json`. |
| AC-7.3-2 | Registry seed matches profile-generated docs. |
| AC-7.3-3 | `docs list`, `docs doctor`, and `docs explain` return schema-valid JSON. |
| AC-7.3-4 | Missing registry produces a warning, not a crash, for existing projects. |
| AC-7.3-5 | `docs doctor` detects missing registered files, unregistered required reading, canonical conflicts, and invalid statuses. |
| AC-7.3-6 | `init doctor` and docs doctor do not conflict; they either share helpers or have documented boundaries. |
| AC-7.3-7 | New schemas are registered. |

## Validation

```bash
npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/docs-doctor.test.ts tests/unit/init.test.ts
npm run build
npm test
npm run dev:docker-sync-build

rm -rf /tmp/hadara-docs-registry-smoke
mkdir -p /tmp/hadara-docs-registry-smoke
node dist/cli/main.js init --project /tmp/hadara-docs-registry-smoke --profile standard --json
node dist/cli/main.js docs list --project /tmp/hadara-docs-registry-smoke --json
node dist/cli/main.js docs doctor --project /tmp/hadara-docs-registry-smoke --json
node dist/cli/main.js docs explain --project /tmp/hadara-docs-registry-smoke --path docs/PROJECT_STATE.md --json
```

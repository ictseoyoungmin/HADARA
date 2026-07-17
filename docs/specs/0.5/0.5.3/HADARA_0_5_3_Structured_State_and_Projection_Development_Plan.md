# HADARA 0.5.3 Structured State and Projection Development Plan

## Release objective

Move selected machine-owned lifecycle facts out of hand-maintained Markdown only where doing so measurably removes synchronization work. Establish projection ownership, no-op rendering, drift detection, import/round-trip checks, and state compare-and-swap without migrating all Task Capsule prose.

## Entry and exit contracts

| Boundary | Contract |
|---|---|
| Baseline | 0.5.0 evaluation semantics and 0.5.2 public close contract are stable. |
| Canonical evidence | Remains `tasks/T-*/evidence.jsonl`. |
| Human-owned prose | Goal, scope, design notes, risk narrative, and handoff commentary remain Markdown-owned. |
| Exit | Selected Tier 1/2 projections pass no-op, round-trip, drift, close-proof, and manual-sync-reduction gates. |

## Capsule budget

Release ceiling: **6 capsules**, at most **3 L**, total planned source ceiling **40 files / 4,700 net LOC**.

| Plan ID | Capsule | Size | Depends on | Deliverable |
|---|---|---:|---|---|
| 053-C01 | Ownership registry and projection manifest | M | 0.5.2 | Explicit Tier 1/2/3 ownership and writer contracts |
| 053-C02 | State store rev/CAS and guarded mutation API | L | C01 | Lost-update prevention for structured state writers |
| 053-C03 | Task Board canonical index and full projection | L | C01-C02 | Tier 1 render/import/drift behavior |
| 053-C04 | Close operation/proof state projection integration | M | C01-C03 | Rebuildable status/proof indexes without evidence centralization |
| 053-C05 | Tier 2 generated-block drift and round-trip hardening | L | C01-C04 | Safe managed blocks in project state/handoff and selected task structures |
| 053-C06 | Brownfield migration, measurement, and installed dogfood | M | C02-C05 | Guarded upgrade and manual-sync reduction evidence |

Split triggers:

- Split C03 into import and projection execution if brownfield loss reporting exceeds the L ceiling.
- Split C05 by document type if marker ownership differs between shared docs and Task Capsules.
- Defer any acceptance/validation structural migration that cannot preserve evidence linkage without another release.

## Ownership tiers

| Tier | Model | Initial 0.5.3 target | Write rule |
|---|---|---|---|
| 1 | Full projection | Task Board; generated evidence summary remains existing precedent | State/projection API only; direct edits detected |
| 2 | Human doc plus generated blocks | Project State, Agent Handoff, narrowly selected task metadata blocks | Text outside markers human-owned; inside markers generated |
| 3 | Managed patch | AGENTS snippets, `.gitignore`, brownfield insertions | Dry-run and before-hash guard |

No file becomes Tier 1 or Tier 2 merely because it contains a table. Ownership must be registered and enforced by render/drift tooling.

## Schema plan

### Projection manifest

Proposed schema: `hadara.projection.manifest.v1`.

```ts
interface ProjectionManifestEntryV1 {
  id: string;
  path: string;
  tier: 1 | 2 | 3;
  canonicalSources: string[];
  writer: string;
  generatedRegions: string[];
  closeSourceRole: 'required' | 'conditional' | 'advisory' | 'excluded';
  importPolicy: 'required' | 'lossless-only' | 'unsupported';
  driftPolicy: 'fail-closed' | 'warn' | 'ignore';
}
```

### State envelope

All mutable structured state uses a common envelope with schema version, monotonically increasing `rev`, and content hash. Mutation accepts expected `rev` and fails with a structured conflict; it never silently overwrites a newer revision.

### Task Board index

Proposed schema: `hadara.task_board.index.v1` with task id, title, task status, capsule path, ordering metadata, and human-note preservation policy. The Markdown Task Board becomes a deterministic full projection only after brownfield import proves every retained cell is represented or explicitly reported as loss.

### Proof indexes

Central close/status state may store task id, durable evidence id, source/report hash, outcome, and freshness summary. It must be rebuildable from capsule-local evidence and must never become the canonical evidence record.

## Implementation details by capsule

### 053-C01 — ownership registry

- Extend document metadata with ownership tier, canonical sources, writer, marker IDs, and close-source role.
- Reject overlapping generated regions and ambiguous writers.
- Make required-reading and docs-health reports consume the same ownership metadata.

### 053-C02 — state CAS

- Add atomic temp-write/rename behavior inside the portable project boundary.
- Require expected revision for mutation and return current/expected revision on conflict.
- Keep CAS diagnostics separate from close-source snapshot verdicts.
- Add concurrent-writer fixtures for current state and projection inputs.

### 053-C03 — Task Board projection

- Build a read/import report before any execute mode.
- Preserve task identity, status, capsule path, order, and allowed notes.
- Require reviewed before hash for brownfield conversion.
- Make unchanged render produce byte-identical output and diff zero.
- Detect direct edits and fail closed or require explicit re-import according to policy.

### 053-C04 — close/proof integration

- Project close state from task-local proof and operation records.
- Rebuild indexes without rewriting capsule evidence.
- Include structured-state file content hashes in the close snapshot only when the task contract makes them close sources.
- Keep advisory global projections from blocking small capsule close.

### 053-C05 — Tier 2 blocks

- Preserve all prose outside managed markers.
- Bind each generated block to one registered writer and canonical source set.
- Detect missing, duplicated, reordered, or edited markers.
- Do not migrate Task Goal/Scope/design/risk/handoff prose.
- Treat Plan/Acceptance/Validation structural migration as opt-in and defer it unless round-trip and evidence linkage are lossless.

### 053-C06 — migration and measurement

- Run dry-run-first brownfield adoption with planned files, preserved data, conflicts, and plan hash.
- Measure manual document edit count before and after projection promotion.
- Cover optional-doc absence, malformed optional state, existing human notes, stale markers, CAS conflict, and close after projection update.
- Repeat installed-package upgrade and recycle.

## Expansion gates

Every promoted projection must pass all gates:

| Gate | Requirement |
|---|---|
| No-op render | Re-render without canonical-state changes yields byte diff 0. |
| Round trip | Import/render preserves structured data or reports every loss before execute. |
| Drift detection | Direct edits inside generated regions are detected and fail according to registered policy. |
| Close proof | Projection/state inclusion does not weaken or create a fixed-point loop in close proof. |
| CAS conflict | Concurrent stale writer performs zero overwrite and receives actionable conflict metadata. |
| Manual sync reduction | Dogfood demonstrates fewer manual shared-doc updates for the target workflow. |
| Locality | Rebuilding indexes from task capsules succeeds; deleting an index does not delete evidence. |

Failure of any gate leaves that candidate on its previous ownership tier. Partial promotion is allowed by document; the release does not require every candidate to migrate.

## Validation and acceptance

| Gate | Required proof |
|---|---|
| Schema | Manifest, state envelope, Task Board index, and proof index fixtures validate. |
| Determinism | Repeated render/import tests are byte-stable across supported platforms. |
| Brownfield safety | Preview is zero-write; execute requires reviewed hash/rev and preserves or reports all data. |
| Lifecycle safety | Status and task close handle projection drift/CAS conflicts with one actionable recovery route. |
| Evidence | Task-local canonical records remain sufficient to rebuild summaries and close indexes. |
| Scope restraint | Full TASK.md migration, release state migration, and acceptance-state migration remain deferred unless separately approved. |

## Rollback and follow-up

Projection promotion must be reversible by retaining the last valid canonical/import source and migration metadata. On drift or round-trip failure, stop writes and fall back to the prior human-owned or managed-block model; never regenerate over ambiguous human content. Candidates that pass only schema tests but not dogfood remain experimental for a later 0.5.x/0.6 release.


# HADARA 0.5.0-rc.6 Terminal Lifecycle Evidence and Close Currentness Hardening

## Status

| Field | Value |
|---|---|
| Contract status | Frozen for implementation |
| Authority | Normative for T-0780 through T-0782 |
| Design capsule | T-0779 |
| Release consequence | Any implementation change under `src/**`, `scripts/**`, package metadata, or packaged docs invalidates the RC5 artifact and requires exact RC6 regeneration and public recycle. |

## Problem Statement

T-0778 byte-bound a public RC5 lifecycle report, but the report contained two different post-close outcomes:

- reuse of the pre-close reviewed plan was correctly refused with `TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH` and zero writes;
- a new post-close dry-run was terminal and zero-write, but its fresh plan was not executed.

The acceptance row nevertheless described a successful same-close execute retry. This exposed four structural gaps:

1. evidence artifact bytes are bound, but a passed evidence outcome is not bound to a validated semantic assertion inside the artifact;
2. close snapshots collect evidence-looking strings without requiring every structured reference to resolve;
3. close-time HANDOFF phase rules are documented but not enforced;
4. current release state is repeated in human prose and can contradict itself.

T-0778 is immutable closed history. Its close proof is not rewritten. Corrective evidence and runtime hardening belong to new capsules.

## Non-Negotiable Invariants

| ID | Invariant |
|---|---|
| INV-1 | A stale reviewed close plan must fail closed with zero writes. This is a safety success, not an idempotent execute success. |
| INV-2 | Post-close execute idempotency is proven only by obtaining a fresh terminal plan and executing that exact plan hash successfully with `closed-valid`, zero writes, and no new close proof. |
| INV-3 | Release-grade lifecycle evidence is command-generated. A free-form success summary cannot override a failing nested command result. |
| INV-4 | Every structured durable evidence reference used by acceptance, validation, risk, handoff, or close readiness must resolve to a canonical evidence record. |
| INV-5 | Close snapshots include only resolved evidence references and preserve their source locations. |
| INV-6 | A capsule cannot close while its Pre-Close continuation still requests same-capsule close work. |
| INV-7 | Done routing uses a terminal or actionable Post-Close continuation; a separate future capsule must be represented as `Create Task = yes`. |
| INV-8 | Current release facts have one command-owned projection. Historical release prose cannot present itself as current state. |

## Contract A: Command-Generated Terminal Lifecycle Acceptance

### Public command surface

Extend the installed-package recycle surface with an explicit opt-in:

```text
hadara package recycle \
  --execute \
  --terminal-lifecycle \
  --package hadara@next \
  --expected-version <version> \
  --task <release-task> \
  --attach-evidence \
  --json
```

The ordinary recycle path remains compatible and does not execute terminal close unless `--terminal-lifecycle` is present.

### Report schema

Register `hadara.packageRecycle.v2` or a dedicated `hadara.publicLifecycleAcceptance.v1`. The implementation may select either identifier before code lands, but there must be exactly one registered authoritative schema and one shared runtime validator.

The terminal lifecycle result must include these assertions:

```json
{
  "terminalLifecycle": {
    "initialDryRun": {
      "planHash": "sha256:...",
      "writesExecuted": 0
    },
    "initialExecute": {
      "ok": true,
      "closeState": "closed-valid",
      "terminal": true,
      "closeProofAppended": true
    },
    "stalePlanProbe": {
      "expectedRefusal": true,
      "ok": false,
      "reason": "TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH",
      "writesExecuted": 0,
      "closeProofAppended": false
    },
    "freshTerminalDryRun": {
      "ok": true,
      "closeState": "closed-valid",
      "terminal": true,
      "writesExecuted": 0,
      "closeProofAppended": false,
      "planHash": "sha256:..."
    },
    "freshTerminalExecute": {
      "ok": true,
      "closeState": "closed-valid",
      "terminal": true,
      "writesExecuted": 0,
      "closeProofAppended": false,
      "idempotentNoop": true,
      "planHash": "sha256:..."
    },
    "audit": {
      "verdict": "closed-valid"
    },
    "freshStatus": {
      "phase": "idle",
      "recommendations": 0,
      "noStaleContinuation": true
    }
  }
}
```

### Semantic verdict

The command may append passed evidence only when all required assertions are satisfied. The reducer must derive the result from parsed command reports and exit codes; it must not accept an operator-supplied overall verdict.

| Assertion | Passed condition |
|---|---|
| Initial close | execute is `ok=true`, terminal `closed-valid`, and appends the first close proof |
| Stale-plan fencing | old hash is refused with the exact mismatch code and zero writes |
| Fresh-plan idempotency | fresh dry-run hash equals fresh execute hash; execute is `ok=true`, `idempotentNoop=true`, zero-write, and appends no proof |
| Final audit | `closed-valid` |
| Fresh routing | `phase=idle`, zero recommendations, no stale continuation |

Any failed required assertion makes the report `ok=false`, prevents passed acceptance evidence, and retains a sanitized failed report for diagnosis.

### Provenance

Each command step records:

- sanitized command identity and arguments;
- exit code;
- parsed report schema version;
- parsed report fingerprint;
- plan hash when applicable;
- elapsed time;
- no raw secrets or private absolute consumer paths.

The reduced report is copied through the canonical evidence writer and byte-bound with SHA-256 and byte length.

## Contract B: Structured Evidence Reference Integrity

### Shared resolver

Create one shared `EvidenceReferenceResolver`; task validation, protocol doctor, evidence lint, and task close must not maintain separate regex-only implementations.

The resolver returns:

```ts
interface ResolvedEvidenceReference {
  id: string;
  sourcePath: string;
  section: string;
  rowId?: string;
  field: string;
  resolved: boolean;
  evidenceTaskId?: string;
  evidenceSourceLine?: number;
}
```

### Structured sources

The required scan surface is:

- `TASK.md` Acceptance `Evidence` cells;
- `TASK.md` Validation `Evidence` cells;
- `TASK.md` Risks / Follow-ups `Link` cells when they contain `ev:`;
- `HANDOFF.md` Last Completed evidence cells;
- `HANDOFF.md` Post-Close rows when a dedicated evidence/reference cell exists;
- compatibility sidecars that own equivalent structured fields.

Arbitrary prose and documentation examples are not scanned as readiness references.

### Resolution rules

- malformed or truncated durable IDs in structured cells are errors;
- syntactically valid IDs that do not exist in the referenced task `evidence.jsonl` are errors;
- cross-task references resolve against the referenced task capsule;
- duplicates are reduced by ID while source locations remain preserved;
- a `Met` acceptance row may use only resolved canonical evidence;
- close is zero-write when any structured readiness reference is unresolved.

### Close snapshot v2

The close proof snapshot becomes additive and compatibility-preserving:

```ts
{
  requiredAcceptanceIds: string[];
  evidenceRefsUsedForReadiness: string[];
  evidenceReferenceSources: Array<{
    id: string;
    sourcePath: string;
    section: string;
    rowId?: string;
    field: string;
  }>;
  unresolvedEvidenceRefs: [];
  evidenceSummaryHash: string;
}
```

Historical close snapshots without the additive fields remain readable. New close proofs require `unresolvedEvidenceRefs` to be empty.

## Contract C: Close-Time HANDOFF Currentness

HANDOFF remains worker-owned prose. Close validates it but does not silently rewrite it.

### Pre-Close rules

At done-level validation and close dry-run:

- `Pre-Close Operator Action` must exist;
- it must be terminalized before close;
- `waiting-for-operator`, `action-required`, or instructions to close the same task are blockers;
- a terminal row uses `Create Task = no`.

Recommended terminal form:

```markdown
| No pending same-task action. | terminal | no | Ready for proof-last close. | docs/TASK_WORKFLOW_COMMANDS.md |
```

### Post-Close rules

- section must exist and contain no placeholder;
- `terminal` requires `Create Task = no`;
- a continuation explicitly assigned to a separate/future capsule requires `Create Task = yes`;
- Done task selection consumes Post-Close only;
- Pre-Close content is retained as historical text but never projected as current guidance after close.

The first implementation may enforce controlled table values and explicit same-task close phrases. It must not claim reliable arbitrary-language intent inference.

## Contract D: Release Current-State Projection

`docs/RELEASE_READINESS.md` remains human-owned release policy and historical narrative. Its compact current-state block becomes command-owned projection derived from typed evidence and package metadata.

```markdown
<!-- hadara:release-current:start -->
| Field | Value |
|---|---|
| Source version | 0.5.0-rc.6 |
| Published prerelease | 0.5.0-rc.6 |
| npm next | 0.5.0-rc.6 |
| npm latest | 0.4.6 |
| GitHub prerelease | v0.5.0-rc.6 |
| Public terminal lifecycle | passed |
| Stable promotion | pending decision |
<!-- hadara:release-current:end -->
```

The projection source is the latest compatible set of:

- package metadata;
- operator publication report;
- GitHub release verification report;
- terminal lifecycle acceptance report.

Historical RC sections must be explicitly labeled historical and cannot be interpreted as current fields. Projection generation is dry-run first, before-hash guarded, and does not perform npm/GitHub/Docker mutation.

## Capsule Plan and Budgets

| Capsule | Scope | Budget | Required result |
|---|---|---:|---|
| T-0779 | Freeze this spec, register it, and record the RC5 corrective interpretation without modifying closed T-0778. | 1 focused docs slice | Normative contract and ordered implementation handoff. |
| T-0780 | Implement command-generated terminal lifecycle acceptance and schema/reducer integration. | 1 runtime slice; target 6-10 focused files | Nested failure cannot produce passed evidence; fresh-plan execute acceptance passes in deterministic fixtures. |
| T-0781 | Implement shared structured evidence reference resolver and close snapshot integrity. | 1 runtime slice; target 5-9 focused files | Truncated/missing structured refs block close; valid and cross-task refs pass. |
| T-0782 | Enforce close-time HANDOFF phases and release current-state projection. | 1 runtime/docs slice; target 6-10 focused files | stale pre-close guidance blocks close; current release projection has one authoritative value per field. |
| Follow-up | Regenerate exact `0.5.0-rc.6`, run package/clean-checkout/release gates, publish separately, and recycle public terminal lifecycle. | Separate artifact and operator capsules | No RC5 artifact reuse; exact-byte provenance and public acceptance. |

Budgets are scope limits, not permission to omit required regression tests. If a capsule exceeds its target because two concerns cannot be separated safely, split it before implementation.

## Required Regression Matrix

| Area | Required cases |
|---|---|
| Terminal lifecycle | initial close success; stale old hash rejected zero-write; fresh terminal hash execute succeeds zero-write; retry adds no close proof; final audit closed-valid; idle status |
| Semantic evidence | nested required step failure cannot append passed evidence; bound report mutation fails lint; same idempotency key with different bytes fails |
| Evidence references | full valid ID; truncated ID; missing same-task ID; valid cross-task ID; missing cross-task ID; free-form example excluded |
| HANDOFF | terminalized pre-close passes; waiting pre-close blocks; stale same-task close phrase blocks; terminal post-close/no passes; separate capsule/no blocks; separate capsule/yes passes |
| Release projection | published prerelease; unpublished candidate; missing GitHub observation; historical RC rows ignored; before-hash conflict fails zero-write |

## Migration and Compatibility

- Existing `hadara.packageRecycle.v1` reports remain readable.
- Existing evidence v1/v2 records remain readable.
- Historical close snapshots remain auditable.
- New semantic guarantees apply only to reports and close proofs produced after their contracts ship.
- T-0778 remains a truthful record of the commands actually observed; T-0779 records that its old-plan mismatch did not prove fresh-plan execute idempotency.
- Once T-0780 changes packaged runtime behavior, stable promotion must use a newly generated RC6 artifact and repeat public terminal lifecycle acceptance.

## Explicit Non-Goals

- Reopening or rewriting T-0778 close-source documents.
- Treating stale-plan rejection as a product regression.
- Executing npm, GitHub, Docker, or stable publication in T-0779 through T-0782.
- General shell-executing evidence capture outside the bounded package recycle command.
- Arbitrary natural-language inference for HANDOFF intent.
- Replacing Task Capsule/HANDOFF authority with a new global current-state database.


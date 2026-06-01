# SCHEMAS

HADARA JSON schemas are contract fixtures for stable external read models. They document the shape external agents can expect and provide a future source for runtime validation, release gates, and MCP/CLI parity checks.

## Current Phase

Schema layer status: planning and fixture registration, with limited active-run, write-preflight, install-plan, feature-smoke, package-smoke, clean-checkout smoke, release-artifact, release evidence summary, protocol consistency/remediation, evidence lint, task close/audit-close, task ready, task finish, task next, task upgrade-scaffold, task workbench, and runtime version validation in focused contract tests.

T-0079 added fixture registration only. T-0092 added a lightweight runtime validation API for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` because those read models are backed by mutable local state. T-0098 registers and validates `hadara.write.preflight.v1` reports before returning CLI write-boundary preflight output. T-0129 validates `hadara.install.plan.v1` before returning installer dry-run plans. T-0131 validates `hadara.featureSmoke.v1` before returning reduced core feature smoke reports over service/read-model surfaces. T-0132 registers `hadara.packageSmoke.v1` and validates deterministic package-smoke report fixtures before package-smoke dry-run or execution commands exist. T-0137 registers and validates `hadara.releaseArtifact.v1` before returning release artifact builder reports. T-0138 registers `hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1` before release gates read existing evidence records or optional reduced summary artifacts. T-0140 registers and validates `hadara.releaseDryRun.v1` before returning final release dry-run reports. T-0141 registers `hadara.releasePublish.v1` before returning approval-gated publish/deploy readiness reports. T-0159 registers `hadara.protocol.consistency.v1` and `hadara.protocol.remediation.v1` and validates focused service/CLI contract reports, including remediation action hash/existence fields. T-0163 registers `hadara.task.upgrade_scaffold.v1` for dry-run-first non-destructive Task Capsule scaffold frame upgrade reports. T-0165 registers `hadara.evidence.lint.v1` for early evidence index lint reports. T-0166 registers `hadara.task.close.v1` for close plan reports with loop-boundary metadata. T-0168 registers `hadara.task.ready.v1` for read-only readiness preflight reports. T-0170 registers `hadara.task.audit_close.v1` and clarifies task-close report/source hash semantics. T-0173 registers `hadara.task.workbench.v1` for the read-only Phase 3 task operator console. T-0178 registers `hadara.runtime.version.v1` for read-only CLI origin diagnostics. T-0180 registers `hadara.task.finish.v1` for dry-run-first bounded task finish/status sync reports. T-0181 registers `hadara.task.next.v1` for read-only next-task recommendations. Broad schema validation remains deferred.

## Registry

Schema fixtures live under `src/schemas/`.

The registry fixture is `src/schemas/schema-index.json`.

Each registry entry uses:

| Field | Meaning |
|---|---|
| `id` | Stable HADARA schema id. It should match the report `schemaVersion`. |
| `path` | Repository-relative path to the JSON Schema fixture. |
| `status` | `fixture` for documented but not runtime-enforced schemas; future values may include `enforced` or `deprecated`. |
| `owner` | The owning source area, such as `services/evidence-list` or `hermes/context-export`. |
| `notes` | Short guidance for current limitations or future work. |

Initial fixtures:

| Schema ID | File | Status | Notes |
|---|---|---|---|
| `hadara.evidence.list.v1` | `src/schemas/evidence-list.schema.json` | fixture | Mirrors the shared evidence list read model. |
| `hadara.evidence.lint.v1` | `src/schemas/evidence-lint.schema.json` | fixture | Documents read-only evidence index lint reports for early Task Capsule evidence drift detection. |
| `hadara.context.export.v1` | `src/schemas/context-export.schema.json` | fixture | Documents MCP memory-mode context export. |
| `hadara.tools.list.v1` | `src/schemas/tools-list.schema.json` | fixture | Documents capability discovery surfaces and disabled surfaces. |
| `hadara.active_run.projection.v1` | `src/schemas/active-run-projection.schema.json` | fixture | Documents active-run projection and degraded local-state warnings. |
| `hadara.active_run.resume.v1` | `src/schemas/active-run-resume.schema.json` | fixture | Documents read-only resume guidance. |
| `hadara.releaseGate.v1` | `src/schemas/release-gate.schema.json` | fixture | Documents advisory and strict release gate reports. |
| `hadara.privateEvidence.v1` | `src/schemas/private-evidence.schema.json` | fixture | Documents private portable-store manifest records without private raw content or source paths. |
| `hadara.event.v1` | `src/schemas/event.schema.json` | fixture | Documents structured redacted event records embedded in private audit JSONL. |
| `hadara.protocol.consistency.v1` | `src/schemas/protocol-consistency.schema.json` | fixture | Documents read-only protocol doctor reports for task, docs, profile, and all scopes. |
| `hadara.protocol.remediation.v1` | `src/schemas/protocol-remediation.schema.json` | fixture | Documents dry-run-first protocol remediation plans and bounded execute reports, including optional planned-content hash/existence fields. |
| `hadara.task.upgrade_scaffold.v1` | `src/schemas/task-upgrade-scaffold.schema.json` | fixture | Documents dry-run-first non-destructive Task Capsule scaffold frame upgrade reports. |
| `hadara.task.close.v1` | `src/schemas/task-close.schema.json` | fixture | Documents task close plan and execute reports with close-evidence loop-boundary metadata, diagnostic report hash, close-relevant source hash, and append result paths. |
| `hadara.task.audit_close.v1` | `src/schemas/task-audit-close.schema.json` | fixture | Documents read-only close audit reports for close evidence presence, shape, and post-close hash drift. |
| `hadara.task.ready.v1` | `src/schemas/task-ready.schema.json` | fixture | Documents read-only task readiness preflight reports before close. |
| `hadara.task.finish.v1` | `src/schemas/task-finish.schema.json` | fixture | Documents dry-run-first bounded Task Capsule finish/status sync reports. |
| `hadara.task.next.v1` | `src/schemas/task-next.schema.json` | fixture | Documents read-only next-task recommendation reports from slices, Task Board, and handoff state. |
| `hadara.task.workbench.v1` | `src/schemas/task-workbench.schema.json` | fixture | Documents read-only Phase 3 task status/workbench reports and normalized next actions. |
| `hadara.runtime.version.v1` | `src/schemas/runtime-version.schema.json` | fixture | Documents read-only CLI origin, package/git/node metadata, and build freshness diagnostics. |
| `hadara.write.preflight.v1` | `src/schemas/write-preflight.schema.json` | fixture | Documents read-only CLI write-boundary preflight reports. |
| `hadara.install.plan.v1` | `src/schemas/install-plan.schema.json` | fixture | Documents future installer dry-run planning reports without performing install mutation; target paths are redacted public path-reference objects instead of raw strings. |
| `hadara.featureSmoke.v1` | `src/schemas/feature-smoke.schema.json` | fixture | Documents reduced read-only core feature smoke reports for the `core` profile and deferred `release-readiness` profile; installed binary and launcher checks are explicitly false in the current report. |
| `hadara.packageSmoke.v1` | `src/schemas/package-smoke.schema.json` | fixture | Documents reduced package-smoke reports, redacted path references, execution markers, artifact metadata, and privacy booleans before package-smoke command implementation. |
| `hadara.cleanCheckoutSmoke.v1` | `src/schemas/clean-checkout-smoke.schema.json` | fixture | Documents reduced source-checkout smoke reports for disposable clean-checkout validation without package install, publish, release mutation, or public raw logs. |
| `hadara.releaseArtifact.v1` | `src/schemas/release-artifact.schema.json` | fixture | Documents reduced release artifact build reports for tarball, checksum, manifest, whitelist verification, and no publish/GitHub/Docker mutation. |
| `hadara.releaseDryRun.v1` | `src/schemas/release-dry-run.schema.json` | fixture | Documents read-only final release dry-run reports that cross-check evidence artifacts, package version, manifest hash, and planned release targets without publish/GitHub/Docker mutation. |
| `hadara.releasePublish.v1` | `src/schemas/release-publish.schema.json` | fixture | Documents approval-gated publish/deploy readiness reports with token presence checks, private audit for execute requests, and no publish/GitHub/Docker mutation. |
| `hadara.smokeEvidenceSummary.v1` | `src/schemas/smoke-evidence-summary.schema.json` | fixture | Documents reduced public smoke evidence summary artifacts for package-smoke and clean-checkout smoke attachment. |
| `hadara.releaseArtifact.manifest.v1` | `src/schemas/release-artifact-manifest.schema.json` | fixture | Documents generated release artifact manifest files for tarball hash and package file lists without publish/GitHub mutation. |

Planned Phase 2 fixtures:

None currently.

## Versioning

- Schema ids should match the payload `schemaVersion`.
- Additive fields may be allowed without changing the schema id when the documented required envelope remains compatible.
- Removing fields, changing field meaning, or changing enum semantics requires a new schema id.
- Compatibility booleans may remain in schemas even after newer enum fields exist. For example, `enabledByDefault` remains in `hadara.tools.list.v1` while `availability` carries richer semantics.

## Field Stability Classes

Schema fixtures may classify fields with `x-hadara-field-classes` when a report has active external consumers or compatibility aliases. Classification is documentation-first for now; it does not make fixture schemas release-gate strict.

| Field Class | Meaning | Consumer Guidance |
|---|---|---|
| Stable | Consumers may rely on the field name and meaning within the current schema id. | Breaking changes require a new schema id or an explicit compatibility plan. |
| Additive | Fields or nested properties may be added without changing the schema id. | Consumers should ignore unknown additive fields unless documented otherwise. |
| Compatibility alias | Maintained for existing consumers after a preferred field exists. | New consumers should use the preferred field and treat the alias as legacy-compatible. |
| Deprecated | Field remains temporarily but is planned for removal or replacement. | Consumers should migrate away before the next breaking schema id. |
| Experimental | Field is useful but not yet a stable contract. | Consumers should guard reads and avoid hard dependencies. |

Current classified fields:

| Schema | Field | Class | Preferred Field | Notes |
|---|---|---|---|---|
| `hadara.task.workbench.v1` | `state.closedValid` | Stable |  | Preferred boolean for valid close evidence. |
| `hadara.task.workbench.v1` | `state.closeState` | Stable |  | Preferred enum for close state. |
| `hadara.task.workbench.v1` | `state.closed` | Compatibility alias | `state.closedValid` | Kept for existing task status consumers; new consumers should avoid it. |
| `hadara.task.workbench.v1` | `sources.*` | Additive |  | Source summaries may grow as the workbench composes more read models. |
| `hadara.task.workbench.v1` | `generatedAt` | Experimental |  | Useful for display/debug, but consumers should not use it as identity or ordering authority. |

## Fixture Strictness

Initial report schemas require stable envelope fields such as `schemaVersion`, `command`, `ok`, primary arrays, and `issues`. Record schemas such as `hadara.privateEvidence.v1` require their domain fields instead.

Initial schemas allow additive properties. This keeps the fixtures useful for documentation and future loader design without prematurely blocking read-model extension work.

Schema validation should distinguish three strictness levels:

| Level | Purpose | Unknown fields | Typical use |
|---|---|---|---|
| `fixture` | Documentation and implementation guidance. | Allowed for additive evolution. | Current T-0079 schema fixtures. |
| `contract` | External-agent compatibility checks for stable read models. | Allowed only outside core envelope and documented contract fields. | CLI/MCP parity and compatibility fixtures. |
| `releaseGate` | Pre-release blocking validation. | Policy must be explicit per schema. | Future release/package checks. |

The current `additionalProperties: true` posture is only a fixture-level policy. Do not treat the initial fixtures as release gates until a later capsule defines core-field strictness, required/enum enforcement, and unknown-field handling.

`hadara.install.plan.v1` is intentionally a little stricter for public path fields: `target.prefix` and `target.launcher` are objects with `displayPath` and `pathRedacted: true`, not raw path strings. `mode: execute` is reserved in the schema for future compatibility, but the current dry-run implementation keeps execution disabled and reports `INSTALL_EXECUTION_DISABLED` until a later capsule explicitly authorizes installer mutation.

## Runtime API

The lightweight runtime API exists in `src/core/schema.ts`:

```ts
export interface SchemaValidationResult {
  ok: boolean;
  schemaId: string;
  issues: Array<{
    path: string;
    code: string;
    message: string;
  }>;
}

export function validateSchema(schemaId: string, value: unknown): SchemaValidationResult;
export function loadSchema(schemaId: string): unknown;
```

Current runtime usage is intentionally narrow: active-run projection/resume reports, write-preflight reports, install-plan reports, feature-smoke reports, deterministic package-smoke fixtures, release reports, and focused protocol consistency/remediation contract reports validate against the fixture subset. Future work should keep CLI/MCP transport envelopes separate from shared read-model schemas.

The validator currently covers the JSON Schema keywords used by registered fixtures, including required fields, const, enum, primitive type checks, arrays, object properties, local `$ref`, `oneOf`, string `minLength`, and regex `pattern`.

## TUI Schema Posture

The terminal TUI composes existing read-model schemas instead of introducing a new stable public TUI read-model schema. Deterministic TUI snapshot JSON can be used for tests, but it is a presentation test artifact unless a later capsule explicitly promotes it to a stable contract.

The full TUI mockup parity and HADARA-native runtime design is preserved without omission in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` under `TUI Mockup Parity / HADARA-Native Runtime Design`. Schema-related TUI requirements from that design are:

```text
source = service by default
cache = internal local read-write only when explicitly enabled
theme = hadara for TTY, no-color for snapshot tests unless specified
auto refresh = off unless specified
```

T-0109 implemented an internal TUI cache record. It remains local acceleration only, not a public read-model schema, fixture-level schema, or release-gated contract.

```json
{
  "schemaVersion": "hadara.tui.cache.v1",
  "projectRoot": ".",
  "generatedAt": "2026-05-26T00:00:00.000Z",
  "sourceSignals": {
    "taskBoard": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "tasksDir": {
      "entries": ["T-0107-tui-public-cli-entry-point"],
      "mtimeMs": 123456789
    },
    "handoff": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "activeRun": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "selectedTask": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "selectedEvidence": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    }
  },
  "taskIndex": [
    {
      "id": "T-0107",
      "title": "TUI Public CLI Entry Point",
      "status": "Done",
      "capsule": "tasks/T-0107-tui-public-cli-entry-point",
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    }
  ],
  "model": {
    "schemaVersion": "hadara.tui.read_model.internal.v1"
  }
}
```

Current status of `hadara.tui.cache.v1`:

| Field | Current posture |
|---|---|
| Registry entry | Not registered. |
| Fixture file | Not implemented. |
| Runtime validation | Not implemented. |
| Storage path | Ignored local state under `.hadara/local/tui/read-model-cache.json`. |
| Source-of-truth status | Never source-of-truth; cache only accelerates reads. |
| Public evidence/context status | Must not be attached as evidence or exported in context. |
| Private evidence status | Cache is disabled when private evidence metadata is requested. |

Any future promotion of `hadara.tui.cache.v1` to a registered fixture-level schema or release-gated schema requires a separate strictness decision.

## Evidence Semantics Schema Posture

Phase 4 evidence proof semantics should start as additive read-model/schema work over existing `hadara.evidence.v1` records. A future `hadara.evidence.normalized.v1` shape may be introduced as an internal or fixture-level read model for semantic analysis, but it must not imply persisted writer migration by itself.

Expected first-slice schema posture:

| Surface | Posture |
|---|---|
| `hadara.evidence.v1` | Remains the persisted evidence index format. |
| `hadara.evidence.lint.v1` | Remains the lint report id; semantic summary/issues are additive if implemented. |
| `hadara.evidence.normalized.v1` | Planned read model, not a persisted writer format. |
| `hadara.evidence.v2` | Deferred writer/migration design; requires a separate schema id and task. |

Evidence semantic schemas must not introduce init scaffold changes, evidence JSONL rewrites, public binary artifact policy, MCP writes, release/package execution, or strict release-gate enforcement in the same slice.

## Non-Goals

- No schema-based release gate is active yet.
- No MCP write surface is enabled by schemas.
- No shell execution, provider calls, dashboard live APIs, or release/package execution is introduced by this registry.
- No TUI cache fixture or public TUI cache schema is introduced by this registry.
- No private evidence contents or machine-local paths should be included in public schema examples or fixtures.

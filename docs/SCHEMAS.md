# SCHEMAS

HADARA JSON schemas are contract fixtures for stable external read models. They document the shape external agents can expect and provide a future source for runtime validation, release gates, and MCP/CLI parity checks.

## Current Phase

Schema layer status: planning and fixture registration.

T-0079 does not add runtime validation. The current source of truth for behavior remains the TypeScript report builders and existing CLI/MCP contract tests. Schema fixtures are intentionally lightweight until the validation API exists.

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
| `hadara.context.export.v1` | `src/schemas/context-export.schema.json` | fixture | Documents MCP memory-mode context export. |
| `hadara.tools.list.v1` | `src/schemas/tools-list.schema.json` | fixture | Documents capability discovery surfaces and disabled surfaces. |
| `hadara.active_run.projection.v1` | `src/schemas/active-run-projection.schema.json` | fixture | Documents active-run projection and degraded local-state warnings. |
| `hadara.active_run.resume.v1` | `src/schemas/active-run-resume.schema.json` | fixture | Documents read-only resume guidance. |

## Versioning

- Schema ids should match the payload `schemaVersion`.
- Additive fields may be allowed without changing the schema id when the documented required envelope remains compatible.
- Removing fields, changing field meaning, or changing enum semantics requires a new schema id.
- Compatibility booleans may remain in schemas even after newer enum fields exist. For example, `enabledByDefault` remains in `hadara.tools.list.v1` while `availability` carries richer semantics.

## Fixture Strictness

Initial schemas require stable envelope fields such as `schemaVersion`, `command`, `ok`, primary arrays, and `issues`.

Initial schemas allow additive properties. This keeps the fixtures useful for documentation and future loader design without prematurely blocking read-model extension work.

Future schema validation should distinguish three strictness levels:

| Level | Purpose | Unknown fields | Typical use |
|---|---|---|---|
| `fixture` | Documentation and implementation guidance. | Allowed for additive evolution. | Current T-0079 schema fixtures. |
| `contract` | External-agent compatibility checks for stable read models. | Allowed only outside core envelope and documented contract fields. | CLI/MCP parity and compatibility fixtures. |
| `releaseGate` | Pre-release blocking validation. | Policy must be explicit per schema. | Future release/package checks. |

The current `additionalProperties: true` posture is only a fixture-level policy. Do not treat the initial fixtures as release gates until a later capsule defines core-field strictness, required/enum enforcement, and unknown-field handling.

## Future Runtime API

The planned runtime API remains deferred:

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

Future work should introduce this behind a Task Capsule and keep CLI/MCP transport envelopes separate from shared read-model schemas.

`hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` are priority candidates for this future runtime API because they describe mutable local project state from `.hadara/local/state/active-run.json`. Release-readiness work should validate those read models before relying on active-run guidance in stricter gates.

## Non-Goals

- No schema-based release gate is active yet.
- No MCP write surface is enabled by schemas.
- No shell execution, provider calls, dashboard live APIs, or release/package execution is introduced by this registry.
- No private evidence contents or machine-local paths should be included in public schema examples or fixtures.

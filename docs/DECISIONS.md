# DECISIONS

## D-0001: TypeScript + Node.js for bootstrap

Reason:
- Cross-platform CLI and dashboard sharing.
- Easy packaging with portable Node runtime.
- Strong ecosystem for provider SDKs and test runners.

## D-0002: Harness-first development

Reason:
- LLM output is non-deterministic.
- Agent loop must be tested with MockProvider and ScriptedProvider before real model integration.

## D-0003: Separate portable store and project store

Reason:
- USB/portable state should not pollute project history.
- Project handoff state must be committed so external agents can continue.

## D-0004: Public evidence artifact baseline policy

Reason:
- Public Task Capsule artifacts are committed project state, so they must not copy secret-like content.
- Binary evidence needs a dedicated sanitized/private workflow; until then, public artifacts are limited to UTF-8 text.

## D-0005: MCP evidence attach operational gates

Reason:
- `hadara.evidence.attach` is the first narrow write-capable MCP tool and remains disabled by default.
- When enabled, each write requires per-call approval metadata and records success or failure in the private portable audit log.
- MCP initialize metadata must reflect whether the current server process is default read-only or evidence attach-enabled.

## D-0006: Dashboard visual baseline uses comfort dark mockup

Reason:
- The comfort dark mockup is the strongest current expression of HADARA dashboard layout, visual hierarchy, palette, card grouping, and navigation feel.
- The mockup is a visual shell baseline only; it does not define data schema, live integration, write behavior, MCP behavior, or state persistence.
- The authoritative dashboard data contract remains `hadara.ops.status.v1`.

## D-0007: Separate v1.0 planning from capsule implementation details

Reason:
- `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md` is the broad technical plan and may include target designs that are ahead of implementation.
- Future Task Capsules need smaller, concrete references so schema details, file candidates, and acceptance notes are not lost.
- `docs/V1_0_CAPSULE_BACKLOG.md` tracks candidate slices and ordering.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` tracks detailed schemas, file candidates, and implementation notes.
- Existing contract docs remain authoritative for implemented stable surfaces; v1.0 reference docs describe planned or partial surfaces until promoted.

## D-0008: Generic init preserves HADARA structure, not HADARA-dev assumptions

Reason:
- `hadara init` should generate profile-aware HADARA protocol structure for new projects, not copy HADARA-dev's current optional integration roadmap.
- Generated docs use stable headings and table frames where records will grow over time so future agents can update them deterministically.
- `basic`, `standard`, and `governed` profiles must not reference docs they do not generate.
- Optional surfaces such as Hermes, MCP, dashboard, provider, release, installer, and deployment work require project-specific registration before agents rely on them.
- Generated `.gitignore` must ignore HADARA local/private state without hiding project-owned top-level paths such as `data/`.
- T-0149 locked this decision with init template changes, README entry-surface cleanup, focused init tests, built CLI profile smokes, full Docker validation, and done-level harness validation.

## D-0009: Init follow-up writes are explicit, dry-run-first maintenance surfaces

Reason:
- Projects need safe ways to inspect older scaffolds, upgrade profile docs, register local Required Reading, and enable optional integrations without re-running `hadara init` as a destructive migration.
- `hadara init doctor --json` is read-only and reports scaffold drift with stable issue codes.
- `hadara init upgrade`, `hadara init register-doc`, and `hadara init enable-integration` dry-run by default and require `--execute` for writes.
- Profile upgrades create only missing generated files; they do not overwrite user-edited docs.
- Runtime local/private stores should be created by the commands that need them, not eagerly by generic project initialization.
- T-0150 locked this decision with focused init tests, full Docker validation, built CLI follow-up smokes, and done-level harness validation.

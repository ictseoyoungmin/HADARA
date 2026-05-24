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

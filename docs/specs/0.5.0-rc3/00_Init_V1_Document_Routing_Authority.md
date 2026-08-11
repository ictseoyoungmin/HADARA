# Init v1 Document Routing Authority

## Status

Active RC3 implementation contract. Owner: T-0757.

## Problem

Init v1 creates `.hadara/documents.json` and `.hadara/context/READ_MAP.md`, while the older docs service reads `.hadara/docs-registry.json`. A fresh Init v1 project can therefore have a valid generated read map while `docs list` and `docs read-map` report a missing legacy registry.

## Authority

| Project state | Routing authority | Compatibility behavior |
|---|---|---|
| Init v1 (`.hadara/project.json` and `.hadara/documents.json`) | `.hadara/documents.json` | Read and mutate the Init v1 registry; do not create `.hadara/docs-registry.json`. |
| Legacy/0.4 project with `.hadara/docs-registry.json` | `.hadara/docs-registry.json` | Preserve the existing registry contract and mutation behavior. |
| Partial or invalid project state | No implicit authority | Report a structured blocker; do not infer a writable registry. |

There must be one writable authority per project. A compatibility adapter may normalize Init v1 entries into the existing docs read model, but it must write back to the same canonical source.

## Read Map Lifecycle

`.hadara/context/READ_MAP.md` is a generated projection of the canonical Init v1 registry. It contains bootstrap and routing policy, not current task state. The task-specific dynamic report is `hadara docs read-map --task T-XXXX --json`.

The projection lifecycle is:

1. `init` creates `.hadara/documents.json` and the initial `READ_MAP.md`.
2. Reviewed docs registry mutation changes the canonical registry only.
3. The same reviewed operation regenerates `READ_MAP.md` deterministically.
4. A read-map or doctor report identifies projection drift without silently repairing it.
5. A reviewed sync/upgrade operation repairs drift from the canonical registry.

Direct edits to `READ_MAP.md` are never authoritative. The projection must not contain task-local status, handoff prose, evidence, or volatile close state.

## Read Routing

The dynamic task report exposes three buckets:

- `readFirst`: selected Task Capsule and task-targeted active documents.
- `readIfNeeded`: conditional policy, architecture, release, or explicitly linked references.
- `doNotReadByDefault`: historical, superseded, archived, unregistered, or future documents.

The registry stores paths and routing metadata independently of file format. TXT, DOCX, and PDF paths may be registered and routed. Page, heading, paragraph, or sheet extraction is deferred until a versioned locator contract is defined.

## Guidance Ownership

- `AGENTS.md` states policy and required command order.
- `docs/HADARA_WORKFLOW.md` defines lifecycle commands and operational rules.
- `READ_MAP.md` is a generated routing fallback and does not duplicate the workflow.

## Canonical Init v1 State and Compatibility Views

Init v1 authority is selected only from the pair of canonical state files:

| State | Role |
|---|---|
| `.hadara/project.json` | Validated project configuration: features, document packs, and initial preset provenance. |
| `.hadara/documents.json` | Canonical document-routing authority. |
| `.hadara/context/READ_MAP.md` | Generated projection of `documents.json`; never an authority selector. |

`presetOrigin` records the preset used when the initial scaffold was created. It is provenance, not
the current project profile and must not decide routing, required lifecycle behavior, canonical
writes, or authority selection. A project may add or remove supported capabilities through an
explicit configuration operation, so its current `features` and `documentPacks` need not map to the
original `presetOrigin`.

`basic`, `standard`, `governed`, and `unknown` profile labels are compatibility/diagnostic views
derived when a consumer needs a compact description of current capabilities. They are not persisted
Init v1 authority and they must not constrain the canonical state to exactly three profile shapes.

The canonical project validator checks concrete invariants only: required base features, the core
document pack, feature/pack pairing, governance's dependency on the project pack, and schema-level
duplicate/unknown-value rules. Partial or invalid `.hadara/project.json`/`.hadara/documents.json`
state has no implicit authority and must fail closed for every consumer. A missing or stale
`READ_MAP.md` is projection/doctor drift, not a replacement routing authority.
- Task Capsules may link to the precise workflow section for command-owned identity fields; they do not need to repeat the full ownership policy.

## Acceptance

- Fresh Init v1 `docs list`, `docs doctor`, and `docs read-map` use `.hadara/documents.json` without a missing-legacy-registry warning.
- Legacy projects continue to use `.hadara/docs-registry.json`.
- Registry mutation is dry-run-first, before-hash guarded, and single-authority.
- Init v1 routing authority does not depend on preset selection or compatibility profile classification.
- `presetOrigin` remains provenance and may differ from a later valid feature/document-pack configuration.
- Compatibility profile views do not become canonical write or routing authority.
- Repeated projection generation is byte-stable.
- Manual projection drift is observable and repairable through the reviewed path.
- No retired global state or `harness validate` surface is introduced.

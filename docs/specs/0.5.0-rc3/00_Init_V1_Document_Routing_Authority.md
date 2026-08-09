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
- Task Capsules may link to the precise workflow section for command-owned identity fields; they do not need to repeat the full ownership policy.

## Acceptance

- Fresh Init v1 `docs list`, `docs doctor`, and `docs read-map` use `.hadara/documents.json` without a missing-legacy-registry warning.
- Legacy projects continue to use `.hadara/docs-registry.json`.
- Registry mutation is dry-run-first, before-hash guarded, and single-authority.
- Repeated projection generation is byte-stable.
- Manual projection drift is observable and repairable through the reviewed path.
- No retired global state or `harness validate` surface is introduced.

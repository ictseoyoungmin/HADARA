# T-0353 C2 Code Index Schema and Ignore Rules

## Metadata

| Field | Value |
|---|---|
| ID | T-0353 |
| Title | C2 Code Index Schema and Ignore Rules |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Define the first C2 code index contract and ignore-rule discovery boundary. | Add `hadara.codeIndex.v1` TypeScript/schema fixtures plus deterministic ignore/file classification helpers without adding a public CLI or graph integration yet. |

## Scope

| In Scope | Reason |
|---|---|
| Code index TypeScript contract | Establish the C2 read model before extraction logic expands. |
| JSON schema fixture and runtime/schema-index registration | Keep schema validation surfaces aligned with existing HADARA report contracts. |
| Ignore-rule constants and file classification/discovery helper | Implement CL-AC1/CL-AC6 foundation with deterministic generated/cache dependency exclusions. |
| Focused tests for schema validity and discovery boundaries | Prove the first C2 layer without broad source parsing. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Import/export extraction | Planned for the next C2 capsule after file discovery is stable. |
| Symbol extraction | Planned after import/export extraction. |
| Command implementation/test hints | Planned after basic code index structure exists. |
| Test relation edges | Planned after import and command hints exist. |
| Context graph integration or `--include-code` CLI surface | Planned as the final C2 capsule to keep public behavior additive and tested. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18T10:42:10.505Z | Done | Added C2 code index schema/read-model foundation, ignore rules, discovery helper, docs, and validation. | ev:T-0353:b72d5284ef1d42afa39232a0 |
<!-- hadara:managed:end task-status-history -->

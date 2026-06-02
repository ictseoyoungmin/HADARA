# T-0217 Dashboard Local Projection Store

## Metadata

| Field | Value |
|---|---|
| ID | T-0217 |
| Title | Dashboard Local Projection Store |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Implement the local dashboard projection store boundary. | Store is disposable local server cache, not project truth. |

## Scope

| In Scope | Reason |
|---|---|
| Add `.hadara/local/cache/dashboard` read/write service. | Needed for fast first reads after server restart. |
| Use atomic replace and redacted projection bodies. | Avoid partial writes and private path exposure. |
| Ensure cache files are ignored and excluded from context export. | Preserve project/portable boundary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Core route implementation. | T-0218. |
| Background refresh. | T-0219. |
| Browser storage. | Explicitly forbidden. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for local projection store. | Task created by HADARA CLI. |
| 2026-06-02 | Done | Added local dashboard projection store service, focused tests, and contract/test-strategy documentation; Docker validation gap recorded. | `evidence.add-command` at 2026-06-02T02:55:34.424Z. |

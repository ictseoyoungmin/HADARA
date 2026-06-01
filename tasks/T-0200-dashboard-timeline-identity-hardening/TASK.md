# T-0200 Dashboard Timeline Identity Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0200 |
| Title | Dashboard Timeline Identity Hardening |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Harden dashboard timeline evidence event identity. | Evidence timeline events should expose normalized evidence ids and stability metadata instead of relying on fallback artifact display ids. |

## Scope

| In Scope | Reason |
|---|---|
| Timeline evidence event ids. | Prefer normalized evidence id when available. |
| Fingerprint/source line/id stability metadata. | Let dashboard consumers display audit identity caveats. |
| Timeline schema/tests/docs. | Keep the read model contract aligned with the event shape. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Persisted evidence v2 ids. | Future evidence writer/migration scope. |
| Timeline cache/polling behavior. | T-0201/T-0203 scope. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create "Dashboard Timeline Identity Hardening"` |

# T-0183 Focused Test Command UX

## Metadata

| Field | Value |
|---|---|
| ID | T-0183 |
| Title | Focused Test Command UX |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add focused test command UX. | Provide a clear npm script and SOP path for running one Vitest file without accidentally running the whole unit suite. |

## Scope

| In Scope | Reason |
|---|---|
| `npm run test:focused -- <path>` script. | Gives agents a reliable focused test entrypoint. |
| SOP and Test Strategy documentation. | Prevents misuse of `test:unit` for narrow file runs. |
| Regression test for script/docs wiring. | Keeps package script and guidance aligned. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replacing full Docker validation. | Focused tests supplement, not replace, full checks for completion. |
| Changing Vitest configuration. | A package script and docs are enough for this UX fix. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task Capsule created. |
| 2026-05-31 | Done | Focused test script, docs, regression test, validation, and evidence completed. | T-0183 evidence records. |

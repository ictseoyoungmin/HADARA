# T-0206 Dashboard Production Hardening Follow-up

## Metadata

| Field | Value |
|---|---|
| ID | T-0206 |
| Title | Dashboard Production Hardening Follow-up |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Harden dashboard production-readiness follow-up gaps. | Isolate dashboard cache keys by project fingerprint, add browser-facing redacted project source metadata, document polling/debug boundaries, and fix sidebar view switching/polish issues observed in the dashboard screenshot. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard aggregate cache key isolation. | Prevent same-process multi-project cache collisions without exposing raw absolute paths in cache keys. |
| Dashboard aggregate source metadata hardening. | Add redacted project references while keeping v1 `source.projectRoot` compatibility. |
| Static dashboard sidebar navigation. | Make non-Home navigation tabs change the visible dashboard sections and active view marker. |
| Dashboard UI polish from screenshot review. | Constrain long topbar/source chips so long phase/status strings do not dominate the first viewport. |
| Contract/docs/tests. | Keep production boundary and regression expectations explicit. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence writer/migration changes. | This task only hardens dashboard read models and UI behavior. |
| New dashboard write actions, shell execution, streaming, or provider/MCP behavior. | Dashboard remains read-only. |
| Enforcing wall-clock performance gates. | Timing remains advisory evidence, not brittle unit-test enforcement. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-01 | Partial | Implementation and Docker validation complete; finish/close still pending. | `npm run dev:docker-sync-build` passed. |

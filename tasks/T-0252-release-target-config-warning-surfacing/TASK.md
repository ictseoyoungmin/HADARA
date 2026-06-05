# T-0252 Release Target Config Warning Surfacing

## Metadata

| Field | Value |
|---|---|
| ID | T-0252 |
| Title | Release Target Config Warning Surfacing |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Surface release target configuration preview issues as non-blocking operator warnings. | `.hadara/release-targets.json` parser issues should not be buried only inside `releaseTargetConfiguration.issues`, but they must not block npm-primary release readiness. |

## Scope

| In Scope | Reason |
|---|---|
| Add non-blocking release target configuration warning checks. | Operator UX should show ignored/unsupported preview config in readiness warning counts. |
| Add diagnostics advisories for raw release target config issue codes. | Preserve exact advisory codes such as `RELEASE_TARGET_PRIMARY_UNSUPPORTED` and `RELEASE_TARGET_CONFIG_INVALID_JSON` without making them blockers. |
| Document preview parser boundaries. | Keep the future schema and Python TOML parser hardening concerns visible for the next planning pass. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full release target configuration schema implementation. | Future work should define `hadara.releaseTargetConfig.v1` separately. |
| Python primary release support or PyPI publishing. | Python remains preview/advisory only. |
| Formal TOML parser adoption. | Needed only before Python readiness or publish gates use TOML as authoritative input. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05 | Draft | Initial task scaffold. | Task created with HADARA CLI. |
| 2026-06-05 | Done | Release target configuration preview issues now surface as non-blocking warnings/advisories. | Docker focused tests and Docker full check passed. |

# T-0124 Clean Checkout Package Smoke Planning

## Goal

Promote clean-checkout/package smoke readiness from a broad release-gate checklist item into an explicit, documented, read-only validation plan.

## Scope

- Document the clean-checkout package smoke sequence in the validation strategy.
- Keep the sequence observational and disposable: no package publishing, archive creation, checksum generation, deployment, remote CI calls, MCP release/package execution, or committed artifact writes.
- Strengthen the read-only release gate so the clean-checkout smoke check depends on the explicit smoke plan markers.
- Add focused regression coverage for the stricter release-gate clean-checkout check.
- Update roadmap/state/handoff/evidence records for the new slice.

## Out of Scope

- Executing release packaging or `npm pack`.
- Publishing packages, creating archives, computing release checksums, or deploying artifacts.
- Adding MCP release/package tools or shell execution surfaces.
- Creating a new package-smoke CLI command.
- Changing dependency versions or running `npm audit fix`.

## Status

Done

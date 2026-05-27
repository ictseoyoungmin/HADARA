# T-0119 Release and Packaging Track

## Goal

Start the Release and Packaging Track by turning the existing debt-only release gate into a broader read-only release checklist for package layout, CI policy, Node policy, and clean-checkout smoke expectations.

This is a planning/checklist readiness report, not an actual release smoke executor.

## Scope

- Extend `hadara release gate --json` so its report includes static packaging readiness checks in addition to operational debt.
- Check package metadata for a stable `hadara` bin entry and required build/test scripts.
- Check local CI policy for Node 22, `npm ci`, and `npm run check`.
- Check release planning docs for clean-checkout smoke and generated artifact policy coverage.
- Preserve advisory/strict operational debt semantics and existing exit-code behavior.
- Validate the slice with focused release-gate tests and a Docker clean-copy build/CLI smoke.

## Out of Scope

- Creating a clean checkout or fresh install sandbox from inside `hadara release gate`.
- Running `npm pack`, `npm install -g`, generated artifact diff checks, archive smoke tests, or remote CI observation.
- Creating release archives, checksums, installers, npm publication, or portable runtime bundles.
- Running remote GitHub Actions or claiming remote CI has passed.
- Adding MCP release/package tools, shell execution, provider calls, task mutation, or evidence writes.
- Changing operational debt records or closing high-severity debt.

## Status

Done

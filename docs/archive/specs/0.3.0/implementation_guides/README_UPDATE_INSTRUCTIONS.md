# README Update Instructions for Phase 7 / HADARA 0.3.0

## Purpose

This guide tells workers how to update `README.md` without claiming unimplemented behavior.

## Main Rule

README must describe what is implemented now and what is planned separately.

Do not advertise Phase 7.1+ commands as available until their implementation task closes valid.

## Immediate Phase 7.0 README Note

Add under Release Status or near it:

```md
### Planned 0.3.0 Direction

The planned 0.3.0 line is Phase 7 Surface Refactor. It organizes HADARA's existing task, evidence, proof, lifecycle, release, and document surfaces so agents can distinguish primary lifecycle commands, diagnostics, advanced surfaces, canonical documents, historical documents, and safe Markdown update boundaries.

Phase 7.x labels are internal implementation phases, not npm release-candidate labels. A new external release should be prepared only after all required Phase 7.x work passes Phase 7.6 hardening and installed-package validation.
```

Before Phase 7.1, do not say `hadara help lifecycle` exists.
Before Phase 7.3, do not say `hadara docs list` exists.
Before Phase 7.4, do not say managed patches exist.

## Target README Structure by Phase 7.6

```md
# HADARA

## Release Status
## Install
## What HADARA Gives You
## Start Here
## Primary Capsule Lifecycle
## Proof and Diagnostics
## Document Governance
## Managed Markdown Safety
## Release and Advanced Surfaces
## Safety Boundaries
## Development / Contributing
```

## Section Rules

### Start Here

After Phase 7.1:

```bash
hadara help
hadara help lifecycle
hadara task next --json
```

### Primary Capsule Lifecycle

After Phase 7.2:

```bash
hadara task next --json
hadara task create "implement a focused change" --json
hadara task status --task T-0001 --json
hadara evidence add-command --task T-0001 --summary "Focused validation passed." --result passed --json
hadara task finish --task T-0001 --json
hadara task finish --task T-0001 --execute --json
hadara task ready --task T-0001 --level done --json
hadara task close --task T-0001 --json
hadara task close --task T-0001 --execute --json
hadara task audit-close --task T-0001 --json
hadara handoff suggest --task T-0001 --json
```

### Proof and Diagnostics

Current diagnostic commands may be documented, but do not present them as required lifecycle steps:

```bash
hadara evidence lint --task T-0001 --json
hadara proof status --task T-0001 --json
hadara proof explain --task T-0001 --json
hadara ci gate --mode advisory --task T-0001 --json
hadara ci gate --mode strict --task T-0001 --json
```

### Document Governance

After Phase 7.3:

```bash
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path docs/PROJECT_STATE.md --json
hadara docs required-reading --json
```

If `docs required-reading` is implemented in Phase 7.5, introduce it there rather than Phase 7.3.

### Managed Markdown Safety

After Phase 7.4:

```md
HADARA can update declared managed sections only. Managed patch execution is dry-run-first and hash-guarded. User-authored prose remains outside automated writes.
```

### Release and Advanced Surfaces

Do not show release/package/dashboard/tui/mcp/run commands inside the primary lifecycle. Place them under advanced or release-only surfaces.

## Anti-Patterns

Do not:

```text
- dump the entire CLI command list near the top;
- present release commands as ordinary lifecycle commands;
- present diagnostics as required steps;
- claim planned commands exist early;
- imply old docs are auto-deleted;
- imply HADARA is a full agent runtime;
- imply Rack/enterprise behavior is part of 0.3.0.
```

## Validation

README-only:

```bash
git diff --check README.md
```

README tied to help changes:

```bash
npm run test:focused -- tests/unit/help.test.ts tests/unit/command-registry.test.ts
npm run build
npm test
```

# Phase 7.6 — 0.3.0 Release Hardening and Installed-Package Recycle

## Status

Planned release-hardening specification.

## Goal

Prepare the next HADARA external release only after all Phase 7.0 through Phase 7.5 work is complete, validated, documented, and validated through an installed-package path.

Phase 7.6 is the first phase where a new external release artifact may be considered.

This phase is not a repeat of the earlier comparative with/without evaluation. It is release validation through installed-package recycle, fresh-init workflow validation, and package/release readiness checks for the completed Phase 7 surface.

## Required Completed Inputs

| Phase | Required Output |
|---|---|
| 7.0 | Specs staged and current repo release/docs state reconciled. |
| 7.1 | Command registry and structured help. |
| 7.2 | Lifecycle guide and command portfolio audit. |
| 7.3 | Document registry and docs doctor. |
| 7.4 | Managed sections and safe patch plans. |
| 7.5 | Docs mark/archive dry-run cleanup operations. |

If any required phase is incomplete, Phase 7.6 must stop and report the missing input. Do not hide incomplete scope under release hardening.

## Release Theme

```text
HADARA 0.3.0 turns the existing task/evidence/proof workflow into a coherent agent operating surface.
```

0.3.0 is not:

```text
a full agent runtime,
a Rack/enterprise release,
a Dashboard/TUI redesign,
a broad document rewrite engine,
a historical document deletion release,
or a release automation expansion.
```

## Release Validation Matrix

| Validation | Required | Notes |
|---|---:|---|
| Full TypeScript build | yes | `npm run build`. |
| Full test suite | yes | `npm test` after build. |
| Docker baseline | yes | `npm run dev:docker-sync-build`. |
| Package smoke | yes | Packed artifact installed in disposable workspace. |
| Clean-checkout smoke | yes | Fresh checkout installs/builds/checks. |
| Fresh init basic/standard/governed | yes | Verify docs registry, managed markers, and help guidance. |
| Structured help smoke | yes | `hadara`, `hadara help lifecycle`, `hadara commands --json`. |
| Lifecycle guide smoke | yes | Primary path and diagnostics render correctly. |
| Docs registry smoke | yes | `docs list/doctor/explain/required-reading`. |
| Managed patch smoke | yes | Dry-run and execute hash-guarded patch on disposable project. |
| Docs cleanup smoke | yes | `docs mark` dry-run/execute on disposable registry, archive dry-run. |
| Installed package recycle | yes | Use packed or published package, not repo source path. |
| External installed-package recycle | yes | Fresh small project using only public installed CLI. |
| Release dry-run | yes | No blockers. |
| Publish dry-run | yes | No mutation. |

## Installed Package Recycle

Use a disposable workspace. Verify at least:

```bash
hadara version --json
hadara help
hadara help lifecycle
hadara help command task.close
hadara commands --json
hadara commands --family capsule-lifecycle --json

hadara init --profile standard --json
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path docs/PROJECT_STATE.md --json
hadara docs required-reading --json

hadara task create "recycle task" --json
hadara task status --task T-0001 --json
hadara evidence add-command --task T-0001 --summary "Recycle validation passed." --result passed --json
hadara task finish --task T-0001 --json
hadara task ready --task T-0001 --level done --json
hadara proof status --task T-0001 --json
hadara ci gate --mode advisory --task T-0001 --json
```

If the installed package path does not include source tests, do not substitute repo-local commands for installed CLI smokes.

## Fresh Init Installed-Package Recycle Scenario

Run this scenario for at least one `standard` project and smoke basic/governed profile creation:

```text
1. Initialize a fresh standard project.
2. Read only structured help and effective Required Reading.
3. Create one task.
4. Make a trivial project-local change or validation placeholder.
5. Record evidence.
6. Finish, ready, close, and audit where feasible.
7. Use docs registry to explain what was read.
8. Use docs doctor to confirm no required-reading drift.
9. Use managed patch dry-run and one safe execute in a disposable managed section.
10. Use docs mark dry-run/execute on a disposable non-canonical doc entry.
```

Evaluation questions:

| Question | Expected Signal |
|---|---|
| Did the agent know the primary lifecycle without reading every CLI command? | yes |
| Did diagnostics stay optional? | yes |
| Did release/dev/UI/integration commands stay out of the primary path? | yes |
| Did document registry identify canonical docs? | yes |
| Did docs doctor catch intentionally introduced drift? | yes |
| Did managed patches avoid freeform prose? | yes |
| Did docs cleanup avoid moving/deleting history? | yes |

## Release Notes Required Content

`docs/RELEASE_NOTES.md` must include implemented 0.3.0 highlights only after Phase 7.6 validation:

```text
- structured command help and command registry
- canonical capsule lifecycle guidance
- command portfolio audit and non-overlap rules
- document registry and docs doctor
- managed Markdown section patch plans
- docs cleanup status marking and required-reading pruning
- installed package recycle and installed-package recycle results
```

Boundaries:

```text
- not a full agent runtime
- not Rack/enterprise
- not automatic broad doc rewriting
- not automatic historical deletion
- release/publish mutation remains operator-approved
```

## README Required Content

By Phase 7.6, README should be reshaped around the primary surface:

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

README must not dump the full command inventory near the top. It should point to:

```bash
hadara help
hadara help lifecycle
hadara commands --json
```

## Versioning and Publish Boundary

Phase 7.6 may prepare one integrated external release candidate or stable release according to operator decision.

Rules:

| Rule | Requirement |
|---|---|
| No per-phase publish | Phase 7.1-7.5 do not publish. |
| Version consistency | `package.json`, `package-lock.json`, README, release notes, and release artifacts agree. |
| Publish mutation | Requires explicit operator approval and existing HADARA release discipline. |
| Registry verification | After publish, verify package version through registry query and attach reduced evidence. |
| GitHub Release/Docker/PyPI | Optional/separate unless explicitly in scope. |

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-7.6-1 | All Phase 7.0-7.5 acceptance criteria are complete and evidenced. |
| AC-7.6-2 | Full build, full test suite, and Docker baseline pass. |
| AC-7.6-3 | Package smoke and clean-checkout smoke pass. |
| AC-7.6-4 | Installed package recycle passes using installed CLI, not source-only commands. |
| AC-7.6-5 | Fresh init basic/standard/governed include expected command/docs registry surfaces. |
| AC-7.6-6 | Structured help and lifecycle help reduce command-selection ambiguity in installed-package recycle. |
| AC-7.6-7 | Docs registry prevents stale/historical/superseded docs from default Required Reading. |
| AC-7.6-8 | Managed patch plans are hash-guarded and do not overwrite freeform prose. |
| AC-7.6-9 | Docs cleanup marks status without deleting or moving historical files by default. |
| AC-7.6-10 | README and release notes describe implemented behavior only. |
| AC-7.6-11 | Release dry-run and publish dry-run pass with no unintended mutation. |
| AC-7.6-12 | No publish mutation occurs without explicit operator approval. |

## Validation

```bash
npm run build
npm test
npm run dev:docker-sync-build

node dist/cli/main.js help
node dist/cli/main.js help lifecycle
node dist/cli/main.js commands --json
node dist/cli/main.js docs doctor --json
node dist/cli/main.js docs required-reading --json

node dist/cli/main.js package smoke --execute --task T-XXXX --attach-evidence --json
node dist/cli/main.js smoke clean-checkout --execute --task T-XXXX --attach-evidence --json
node dist/cli/main.js release gate --mode strict --json
node dist/cli/main.js release dry-run --json
node dist/cli/main.js release publish --mode dry-run --json
```

## Definition of Done

0.3.0 is ready only when a fresh agent can run:

```bash
hadara help lifecycle
```

and correctly understand:

```text
what to do first,
what is required,
what is diagnostic,
what is advanced,
which docs to read,
which docs are historical/superseded,
and what HADARA can safely update.
```

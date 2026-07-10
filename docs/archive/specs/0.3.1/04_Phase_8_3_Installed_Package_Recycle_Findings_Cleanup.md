# Phase 8.3 - Installed-Package Recycle Findings Cleanup

## Status

Planned implementation specification.

## Problem

Stable 0.3.0 installed-package recycle succeeded, but T-0317 carried two non-blocking findings:

```text
1. exact `npx -y hadara@0.3.0 version --json` was not a clean proof in this workspace
2. fresh governed docs doctor returned historical Required Reading warnings
```

Both findings affect worker confidence.

## Goal

Resolve or explicitly document the installed-package recycle findings so future package validation has a clear canonical path.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Republish 0.3.0. | Findings are not package-blocking. |
| Change npm registry behavior. | Local PATH and DNS conditions are environmental. |
| Hide failed evidence. | Evidence must remain visible. |
| Implement broad docs cleanup beyond generated governed warnings. | Scope is the fresh governed init warning. |

## Finding 1: Exact npx / Global PATH Ambiguity

### Desired Rule

Published-package validation should prefer a temp-prefix installed binary when local PATH/global state may be stale:

```bash
tmp="$(mktemp -d)"
npm --prefix "$tmp" install hadara@0.3.0
"$tmp/node_modules/.bin/hadara" version --json
```

Exact `npx hadara@<version>` remains useful, but it is not authoritative if the executed binary path cannot be trusted.

### Implementation Options

| Option | Scope | Notes |
|---|---|---|
| Documentation only | Small | Update README/dev docs/release validation docs with temp-prefix canonical path. |
| Runtime origin warning | Medium | `version --verbose --json` can expose executed bin/path trust guidance. |
| Package recycle helper | Larger | Add a read-only or dev-only helper that runs temp-prefix validation. |

rc1 should start with documentation and testable command guidance unless a runtime path fix is clearly needed.

## Finding 2: Governed Generated Docs Doctor Warning

Fresh governed init should not put historical docs in default Required Reading.

Desired outcome:

```text
hadara init --profile governed --json
hadara docs doctor --json
```

returns `ok:true` with no avoidable `DOC_HISTORICAL_REQUIRED_READING` warning for generated docs.

If a warning is intentional, it must include a reason and remediation hint.

## Files Likely to Change

| File Area | Purpose |
|---|---|
| init template/source files | Adjust governed Required Reading generation if needed. |
| docs doctor / required-reading tests | Lock warning-free or intentional-warning behavior. |
| README or release validation docs | Document canonical temp-prefix installed-package validation. |
| `docs/AGENT_HANDOFF.md` | Remove or downgrade findings after validation. |

## Tests

Recommended focused tests:

```bash
npm run test:focused -- tests/unit/init.test.ts tests/unit/docs-doctor.test.ts tests/unit/docs-required-reading.test.ts tests/unit/runtime-version.test.ts
```

Installed-package smoke for the cleanup capsule should use disposable paths and may remain manual if registry/network is unavailable.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | Stable package validation guidance names temp-prefix installed-bin as the canonical proof path when PATH may be stale. |
| AC-2 | Exact npx ambiguity is documented or runtime-warned without treating T-0317 as package failure. |
| AC-3 | Fresh governed init docs doctor warning is removed or explicitly accepted with reason/remediation. |
| AC-4 | T-0317 findings are either resolved or carried forward with clearer severity. |
| AC-5 | No publish or registry mutation occurs. |

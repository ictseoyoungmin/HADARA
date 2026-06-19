# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused tests | Validate C4 context slice, done-level harness, and protocol drift behavior. | Yes | Passed: 3 files / 57 tests. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |
| `npm run dev:docker-sync-build` | Full Docker build/test and workspace `dist` refresh. | Yes | Passed: 134 files / 880 tests; built version reported `distLooksStale:false`. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |
| `git diff --check` | Whitespace/conflict-marker hygiene. | Yes | Passed: no output. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI byte-budget smoke | Yes | Public CLI failure contract changed. | Passed: over-budget explicit range returned `ok:false`, `CONTEXT_SLICE_TOO_LARGE`, `slices:[]`, exit 6. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |
| Built CLI `.hadara/local` boundary smoke | Yes | Raw local cache reads are now denied. | Passed: `.hadara/local/cache/context/source-manifest.json` returned `CONTEXT_SLICE_OUTSIDE_PROJECT`, exit 6. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |
| Security smoke | Yes | Local/private/cache read boundary changed. | Passed via unit and built CLI boundary coverage; no new permission or write surface added. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |
| Integration smoke | Yes | Public context-slice CLI behavior changed. | Passed via built CLI smokes. | `ev:T-0372:153fbfd1cc37407a99fd7ec1` |

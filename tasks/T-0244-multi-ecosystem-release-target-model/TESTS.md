# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Run the full Docker repository check. | Yes | Passed: 92 files, 613 tests. | Command output; evidence record. |
| `npm run dev:docker-sync-build` | Build in Docker and refresh workspace `dist`. | Yes | Passed: 92 files, 613 tests; `distLooksStale:false`. | Command output; evidence record. |
| `node dist/cli/main.js release dry-run --json` | Built CLI smoke for descriptor-backed release dry-run. | Yes | Expected blocked release artifact freshness; descriptors present. | Command output; evidence record. |
| `node dist/cli/main.js package smoke --dry-run --json` | Built CLI smoke for npm provider metadata. | Yes | Passed; provider `npm-package-smoke` present. | Command output; evidence record. |
| `git diff --check` | Whitespace sanity. | Yes | Passed. | Command output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Python preview unit coverage | Yes | `pyproject.toml` must be preview-only, not publish/build support. | Passed | `tests/unit/release-dry-run.test.ts`; Docker check. |
| Npm provider metadata coverage | Yes | Package smoke must identify its current provider-specific smoke profile. | Passed | `tests/unit/package-smoke-dry-run.test.ts`; Docker check. |
| Security smoke | No | No new secret loading, network call, or release mutation is introduced. | Not Required | Release boundary docs and tests cover no publish execution. |
| Integration smoke | No | No provider execution surface is added. | Not Required | Docker check plus built dry-run smoke are sufficient. |

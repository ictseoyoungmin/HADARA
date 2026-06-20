# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Host focused `npm run test:focused -- tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/help.test.ts` | Initial host focused validation. | No | Failed: host `vitest` executable unavailable in local node_modules. | ev:T-0400:f9a10997a38640bfa2113827 |
| `git diff --check` | Whitespace/diff sanity check. | Yes | Passed. | ev:T-0400:d04cbca880124d57a3e5174d |
| Docker focused `npm run test:focused -- tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/help.test.ts tests/unit/lifecycle-guide.test.ts tests/unit/command-registry.test.ts tests/unit/command-portfolio-audit.test.ts` | Validate docs, init templates, registry help, lifecycle projection, and command portfolio contract. | Yes | Passed: 6 files, 46 tests. | ev:T-0400:8bfd40cfd47f4f4b88882d64 |
| `npm run dev:docker-sync-build` | Full Docker build/test and `dist` refresh. | Yes | Passed: 141 files, 929 tests; `distLooksStale:false`. | ev:T-0400:d792e4cabcdb49398eed875b |
| Built CLI help/init smoke | Verify refreshed `dist` exposes finalize-first help JSON and generated init docs. | Yes | Passed; also resolves the host-focused validation environment failure. | ev:T-0400:e1d131f54fc247d38022fe3a |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not required. |
| Integration smoke | No | No integration surface changed. | Not Run | Not required. |

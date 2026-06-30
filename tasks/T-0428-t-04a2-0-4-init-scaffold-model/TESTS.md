# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar -xf /tmp/hadara-dev-head.tar -C /tmp/hadara && cd /tmp/hadara && git apply /tmp/hadara-dev-work.patch && npm ci && npm run build && npm run test:focused -- tests/unit/init.test.ts'` | Build current dirty worktree in Docker and run focused init tests. | Yes | Passed; 7 tests passed. | `ev:T-0428:f09b011734c84cab8034facf` |
| Built CLI governed init/doctor smoke | Verify refreshed workspace `dist` creates governed 0.4 scaffold and doctor returns `ok:true`. | Yes | Passed. | `ev:T-0428:f09b011734c84cab8034facf` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable |

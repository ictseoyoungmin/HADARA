# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar -xf /tmp/hadara-dev-head.tar -C /tmp/hadara && cd /tmp/hadara && git apply /tmp/hadara-dev-work.patch && npm ci && npm run build && npm run test:focused -- tests/unit/init.test.ts'` | Build current dirty worktree in Docker and run focused init tests. | Yes | Passed; 8 tests passed. | `ev:T-0429:ab675a5933c84286b8d255fc` |
| Built CLI governed init/doctor template smoke | Verify refreshed workspace `dist` creates governed 0.4 scaffold, doctor returns `ok:true`, and key template ownership strings are present. | Yes | Passed. | `ev:T-0429:ab675a5933c84286b8d255fc` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable |

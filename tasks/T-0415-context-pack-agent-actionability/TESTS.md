# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused context-pack/schema validation | Build in `/tmp/hadara`, run focused context-pack/context CLI/session/schema tests, and refresh `/workspace/dist`. | Yes | Passed | ev:T-0415:6c8f98833d5549ea84a7bcdd |
| Built CLI context pack smoke | Run workspace `dist` context pack for a disposable `/tmp` project and inspect `agentActions`. | Yes | Passed | ev:T-0415:0c6e6ab98080440ea5a11fd3 |
| Mounted workspace built CLI context pack smoke | Attempt full mounted T-0415 live context pack. | No | Failed, accepted residual | ev:T-0415:570b2021b1bf4b1c869b836a, ev:T-0415:ac54506b4fc544969254a059 |
| `git diff --check` | Whitespace validation. | Yes | Passed | ev:T-0415:06c1d66f50b445389b6b4c20, ev:T-0415:af5ab0cb5c29418fa355b1ed |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No read/write boundary expansion; actions are read-only hints. | Not Run | Not required. |
| Full suite | No | This capsule changes a focused context-pack read model; full release-line validation remains for later readiness capsules. | Not Run | Not required. |

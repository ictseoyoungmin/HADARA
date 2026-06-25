# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused init/schema validation | Build in `/tmp/hadara`, run focused init/schema tests, and refresh workspace `dist`. | Yes | Passed | ev:T-0416:54d2ca94759b4088ae2fbb7e |
| Built CLI init smoke | Run built CLI `init --profile standard --json` in disposable `/tmp` project and inspect generated docs. | Yes | Passed | ev:T-0416:da44946c779d43bea82e4547 |
| `git diff --check` | Whitespace validation. | Yes | Passed | ev:T-0416:457505ea8ab74c4f85347fd5, ev:T-0416:da46032ef0e14be299557e77 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changes. | Not Run | Not required. |
| Integration smoke | No | Optional integrations remain out of scope. | Not Run | Not required. |

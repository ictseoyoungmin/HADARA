# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -e "JSON.parse(require('fs').readFileSync('docs/specs/0.4.0/productization-redesign/manifest.json','utf8')); console.log('manifest ok')"` | Verify canonical manifest JSON parses. | Yes | Passed | `ev:T-0424:b23c70b10a8945ef8289a073` |
| Stale nested-path search over canonical specs and shared state docs. | Verify old nested spec path references are gone from registration-facing docs. | Yes | Passed | `ev:T-0424:b23c70b10a8945ef8289a073` |
| `git diff --check` | Verify whitespace cleanliness. | Yes | Passed | `ev:T-0424:b23c70b10a8945ef8289a073` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full test suite | No | This capsule changes design specs and no CLI runtime code. | Not Run | Not applicable |
| Docker validation | No | No TypeScript source, dist, or package behavior changed. | Not Run | Not applicable |

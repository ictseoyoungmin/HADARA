# TEST_STRATEGY

## Suites

| Suite | Command | Purpose |
|---|---|---|
| Unit | `npm run test:unit` | Core functions and schemas |
| Contract | `npm run test:contract` | Provider/tool interface compatibility |
| Harness | `npm run test:harness` | Task capsule and fake workflow |
| Full | `npm test` | All tests |
| Check | `npm run check` | TypeScript build + tests |

## Harness-First Rule

Real provider integration must not be implemented until MockProvider and ScriptedProvider workflows are stable.

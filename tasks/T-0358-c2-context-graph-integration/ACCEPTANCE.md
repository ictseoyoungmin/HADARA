# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara context graph --json` preserves default C1 behavior unless `--include-code` is supplied. | Done | `tests/unit/context-graph-builder.test.ts` checks default output excludes SourceFile nodes. |
| AC-2 | `hadara context graph --include-code --json` includes SourceFile/TestFile/FixtureFile/ConfigFile/Symbol projections and C2 code relation edges. | Done | Builder and built CLI smokes verified code node/edge counts; evidence `ev:T-0358:407b29c183f246d390f162f9`. |
| AC-3 | `hadara context graph --task <id> --include-code --json` works additively with task context output. | Done | `includeCode` flows through the same builder path for full and task modes; existing task-scoped CLI/schema tests remain passing. |
| AC-4 | Code graph integration is read-only and does not add dedicated code commands. | Done | Only `context graph --include-code` was added; docs and command registry keep dedicated code commands deferred. |
| AC-5 | Focused tests, full check, build/dist refresh, built CLI smokes, and `git diff --check` are recorded. | Done | Evidence `ev:T-0358:407b29c183f246d390f162f9`. |
| AC-6 | Capsule docs, shared state docs, evidence, and finish bookkeeping are completed before ready/close. | Done | Task finish executed; shared docs updated before ready/close. |

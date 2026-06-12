# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused tests | Validate init, doctor, protocol migration, docs registry, and required-reading changes. | Yes | Passed | `docker exec hadara-dev ... npm run test:focused -- tests/unit/init.test.ts tests/unit/doctor.test.ts tests/unit/protocol-migration.test.ts tests/unit/docs-registry.test.ts tests/unit/docs-required-reading.test.ts` passed 5 files / 33 tests. |
| Docker build and dist refresh | Build changed CLI code and refresh workspace `dist`. | Yes | Passed | `docker exec hadara-dev ... npm run build && cp -R /tmp/hadara/dist/. /workspace/dist/` passed. |
| Built CLI smoke | Prove built init/doctor/docs and protocol migrate context behavior. | Yes | Passed | Three-profile fresh init/doctor/docs smoke passed; legacy migration dry-run reported `context-anchor` planned. |
| git diff check | Check Markdown/code whitespace before close. | Yes | Passed | `git diff --check` passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Context forbids secrets, but no secret-handling implementation changed. | Not Run | Not required. |
| Full Docker check | No | Focused CLI/docs surfaces plus build/built smoke cover this narrow capsule; full check remains for release/readiness capsules. | Not Run | Deferred by scope. |

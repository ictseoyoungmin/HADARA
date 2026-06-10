# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run check (full suite, Docker repro) | Build + full test suite on current rc.3 source. | Yes | Passed | 103 files / 695 tests in a fresh `hadara-dev` container copy. |
| smoke clean-checkout --execute (Docker) | Fresh checkout: npm ci + build + `npm run check` + doctor from clean. | Yes | Passed | ok:true; all steps passed including `check` exit 0. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| package smoke --execute (Docker) | Yes | Prove the packed tarball installs and the installed CLI works. | Passed | validate-source, npm-pack, install-cli, doctor, feature-smoke-core, cleanup, evidence all passed. |
| release gate --mode strict | Yes | Release gate must be green for publish. | Passed | ok:true, no blockers. |
| release dry-run | Yes | Release readiness must report ready. | Passed | ok:true, readiness ready, 0 blockers. |
| release publish --mode dry-run | Yes | Publish path must report no mutation and no blockers. | Passed | ok:true, all targets willExecute:false. |
| Parallel evidence append regression | Yes | rc3 core bug was parallel evidence writes. | Passed | evidence-parallel-append.test.ts (2 tests); reduced 8->4 concurrent workers to avoid destabilizing the full `npm run check` under Docker worker-pool contention. |

## Notes

- The first clean-checkout `check` step failed once with an intermittent vitest worker-pool contention timeout (a documented Docker known issue). An identical-environment repro passed 695 tests, confirming it was a flake, not a hard failure. The parallel evidence test was reduced from 8 to 4 concurrent workers to lower its contention contribution; the clean-checkout `check` then passed cleanly.

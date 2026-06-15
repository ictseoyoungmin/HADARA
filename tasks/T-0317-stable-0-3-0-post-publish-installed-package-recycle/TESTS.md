# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.0 version --registry=https://registry.npmjs.org` | Verify stable package visibility. | Yes | Passed | Returned `0.3.0`. |
| `npm view hadara@0.3.0 --json --registry=https://registry.npmjs.org` | Verify stable package metadata and dist-tag state. | Yes | Passed | Latest dist-tag `0.3.0`, publish time `2026-06-15T05:29:26.368Z`, metadata fields present. |
| `npx -y hadara@0.3.0 version --json` | Verify npx executes the published stable package. | Yes | Failed / environment | Source-checkout run resolved stale global rc.2; isolated `/tmp` clean-PATH runs hit `EAI_AGAIN` twice. See `command:T-0317:npx-exact-check` and `FINDINGS.md`. |
| Temp-prefix `npm install hadara@0.3.0` plus installed-bin smokes | Verify installed package execution without relying on global `hadara`. | Yes | Passed | Installed one package; installed bin reported `packageVersion:"0.3.0"` and `distLooksStale:false`; lifecycle help and commands JSON passed. |
| Installed-bin `hadara init --profile basic|standard|governed --json` plus docs smokes | Verify fresh first-run project profiles and docs surfaces. | Yes | Passed with warning | All profiles created context and docs registry artifacts; governed docs doctor warning recorded in `FINDINGS.md`. |
| Installed-bin `docs list`, `docs doctor`, `docs required-reading`, and `docs explain` | Verify docs registry and command-facing docs surfaces. | Yes | Passed with warning | Basic/standard clean; governed docs doctor `ok:true` with historical Required Reading warnings. |
| Installed-bin `protocol migrate --target 0.3.0` dry-run/execute | Verify 0.3 migration adoption on a disposable legacy fixture. | Yes | Passed | Dry-run planned 7 writes with before-hash; execute changed 7 and preserved legacy `evidence.jsonl`. |
| Installed-bin `task finish --execute` preservation smoke | Verify Task Board human/mixed-owned cells survive finish. | Yes | Passed | Preserved `Notes` value `human note` and extra `Owner` value `reviewer`. |
| Installed-bin `task ready`, `task close --execute`, and `task audit-close` mini lifecycle smoke | Verify the installed package can close a small consumer capsule. | Yes | Passed | Fresh basic lifecycle fixture reached `auditVerdict.verdict:"closed-valid"`. |
| `git diff --check` | Check whitespace in repository changes. | Yes | Passed | No whitespace errors. |
| `node dist/cli/main.js harness validate --task T-0317 --level draft --json` | Validate capsule structure before finish. | Yes | Passed | Returned `ok:true` with no issues. |
| `node dist/cli/main.js evidence lint --task T-0317 --json` | Verify evidence syntax and Markdown/JSONL alignment. | Yes | Passed | Latest lint returned `ok:true` with 0 issues. |
| `node dist/cli/main.js task ready --task T-0317 --level done --json` | Verify done-level readiness before close. | Yes | Passed | Returned `ok:true`, blockers 0, warnings 0 after npx finding classification and README cleanup evidence. |
| `node dist/cli/main.js task close --task T-0317 --execute --json` plus `task audit-close` | Verify canonical close evidence after close-source doc updates. | Yes | Passed | Latest audit returned `closed-valid` with source hash matching the latest close evidence. |
| README release-status inspection | Verify package README is less crowded after stable publish. | Yes | Passed | Release Status table now names current stable, previous RC, and historical RC reference instead of listing every RC. |
| README dev-command scope check | Verify HADARA-dev-only validation examples are not in the package README. | Yes | Passed | `rg` found no README matches for old RC rows, `dev:docker-check`, `dev:docker-sync-build`, or `release-dry-run.test.ts`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | Yes | Published-package consumer surfaces are the purpose of this task. | Not Run | Covered by installed-package smokes above. |
| Full Docker source validation | No | T-0317 validates the npm-published package and README/docs-only cleanup; T-0315 remains the stable source/full Docker readiness baseline. | Not Run | Published package validation is the compensating check. |

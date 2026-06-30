# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker build/version smoke via `git archive HEAD`, `docker cp`, `npm ci`, `npm run build`, `cp -R dist/. /workspace/dist/`, and `node /workspace/dist/cli/main.js version --verbose --json --project /workspace` | Recreate deleted container, build HADARA in Docker, refresh workspace CLI, and verify current built CLI. | Yes | Passed: `packageVersion:"0.3.4-rc.0"`, `head:"b0f65f3..."`, `distLooksStale:false`. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `node dist/cli/main.js docs doctor --scope registry --json` | Validate docs registry JSON/projection registration health. | Yes | Passed: `ok:true`, no registry errors; existing `DOC_ARCHIVE_CANDIDATE` warning only. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `node dist/cli/main.js docs explain --path docs/specs/0.4.0/productization-redesign/README.md --json` | Verify 0.4 README is registered and routed for task-start. | Yes | Passed: registered, `readWhen:["task-start"]`, `shouldReadNow:true`. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `node dist/cli/main.js docs explain --path docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md --json` | Verify worker plan is registered and routed for task-start. | Yes | Passed: registered, `kind:"implementation-guide"`, `readWhen:["task-start"]`, `shouldReadNow:true`. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `rg -n 'docs/specs/0.4.0/productization-redesign' .hadara/docs-registry.json docs/DOC_REGISTRY.md docs/IMPLEMENTATION_SOP.md` | Confirm registry/projection/SOP contain canonical 0.4 path. | Yes | Passed: expected canonical entries found. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `rg -n 'hadara_0_4_breaking_productization_redesign_specs|productization_redesign_specs/productization_redesign_specs' .hadara/docs-registry.json docs/DOC_REGISTRY.md docs/IMPLEMENTATION_SOP.md` | Confirm removed nested spec package path is not registered. | Yes | Passed: no matches. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| `git diff --check` | Check tracked diff whitespace. | Yes | Passed. | `ev:T-0427:8f087c4cf64747628829a5dc` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |

# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -e "JSON.parse(require('fs').readFileSync('.hadara/docs-registry.json','utf8'))"` | Validate docs registry JSON after adding the audit doc. | Yes | Passed | `ev:T-0381:45c7ad2200ce4ec1bbb2fb33` |
| `node dist/cli/main.js docs explain --path docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md --json` | Verify the new audit doc is registered and explainable. | Yes | Passed | `ev:T-0381:45c7ad2200ce4ec1bbb2fb33` |
| `rg -n "future session start|future context pack|largest remaining performance risk|CI or focused tests fail" docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` | Confirm known stale phrases were removed. | Yes | Passed; no matches. | `ev:T-0381:45c7ad2200ce4ec1bbb2fb33` |
| `git diff --check` | Check Markdown/diff whitespace hygiene. | Yes | Passed | `ev:T-0381:45c7ad2200ce4ec1bbb2fb33` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | Not applicable; no security boundary implementation changed. |
| Integration smoke | No | Only if integration surface changes. | Not Run | Not applicable; no runtime integration surface changed. |
| Full Docker validation | No | T-0381 changes docs/registry only; T-0380 passed Docker baseline and T-0382+ will cover runtime hardening. | Not Run | Explicitly skipped for docs-only audit capsule. |

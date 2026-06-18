# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -e "JSON.parse(require('fs').readFileSync('.hadara/docs-registry.json','utf8')); console.log('docs-registry json ok')"` | Validate machine-readable docs registry JSON after manual registration. | Yes | Passed | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| `rg -n "docs/specs/context-routing" docs .hadara AGENTS.md` | Confirm stale unversioned context-routing path no longer appears. | Yes | Passed, no matches | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| `node dist/cli/main.js docs doctor --scope registry --json` | Validate docs registry can be read and has no missing registered documents. | Yes | Passed with pre-existing `DOC_ARCHIVE_CANDIDATE` warning only | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| `node dist/cli/main.js docs explain --path docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md --json` | Confirm overview spec is registered as conditional reference. | Yes | Passed | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| `node dist/cli/main.js docs explain --path docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md --json` | Confirm worker implementation plan is registered as conditional reference. | Yes | Passed | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| `git diff --check` | Check Markdown/JSON diff whitespace. | Yes | Passed | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable |
| Integration smoke | No | No runtime integration surface changed. | Not Run | Not applicable |
| Full Docker check | No | Documentation routing only; no runtime source changed. | Not Run | Document-focused validation used instead. |

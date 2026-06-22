# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -e "JSON.parse(require('fs').readFileSync('.hadara/docs-registry.json','utf8'))"` | Validate machine-readable docs registry after spec registration. | Yes | Passed | ev:T-0403:d087eb9162d34a17afa8fa9d |
| `node dist/cli/main.js docs explain --path docs/specs/0.3.3/dogfood/00_Procedural_Asset_SaaS_Dogfood_Spec.md --json` | Verify dogfood spec is registered and routable. | Yes | Passed | ev:T-0403:d087eb9162d34a17afa8fa9d |
| `rg -n "PF-022\|grass-field-v1\|docker compose\|hadara@0.3.3-rc.0" docs/specs/0.3.3/dogfood/00_Procedural_Asset_SaaS_Dogfood_Spec.md` | Verify core spec anchors exist. | Yes | Passed | ev:T-0403:d087eb9162d34a17afa8fa9d |
| `git diff --check` | Whitespace validation for docs-only changes. | Yes | Passed | ev:T-0403:d087eb9162d34a17afa8fa9d |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker validation | No | Docs/spec-only change; no runtime source behavior changed. | Not Run | n/a |
| Security smoke | No | No runtime security boundary changed; spec records future requirements only. | Not Run | n/a |
| Integration smoke | No | No app implementation exists in this capsule. | Not Run | n/a |

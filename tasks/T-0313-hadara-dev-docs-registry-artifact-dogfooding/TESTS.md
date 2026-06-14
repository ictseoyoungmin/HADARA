# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js docs list --json` before artifact creation | Establish baseline missing-registry behavior. | Yes | Passed | Reported `registryPresent:false`, `inferred:true`, and `DOC_REGISTRY_MISSING`. |
| `node dist/cli/main.js docs required-reading --json` before artifact creation | Confirm read-routing impact. | Yes | Passed | Returned `ok:false` with `DOC_REGISTRY_MISSING`. |
| `node dist/cli/main.js docs list --json` after artifact creation | Verify committed registry is used. | Yes | Passed | Reported `registryPresent:true`, `inferred:false`, no issues, and 14 documents. |
| `node dist/cli/main.js docs required-reading --json` after artifact creation | Verify tiered required-reading output works. | Yes | Passed | Returned `ok:true` with tier metadata. |
| `node dist/cli/main.js docs doctor --json` | Verify docs registry is present and non-blocking. | Yes | Passed | Returned `ok:true`; no `DOC_REGISTRY_MISSING` issue remained. |
| `node dist/cli/main.js docs explain --path docs/PROJECT_STATE.md --json` | Verify registry guidance for a canonical current-state doc. | Yes | Passed | Returned canonical `project-state` guidance with no issues. |
| `node dist/cli/main.js protocol doctor --scope docs --json` | Verify broader docs protocol remains non-blocking. | Yes | Passed | Returned `ok:true` with warning-only historical drift. |
| `node dist/cli/main.js protocol migrate --target 0.3.0 --json` | Confirm broad self-migration remains dry-run-only. | Yes | Passed | Dry-run still planned broader project-wide writes; no execute was run. |
| `git diff --check` | Check whitespace. | Yes | Passed | No whitespace errors. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/Hermes integration changed. | Not Run | Not applicable. |
| Full Docker suite | No | Artifact adoption only; no runtime source code changed. | Not Run | T-0311/T-0312 remain the recent source/package validation baselines. |

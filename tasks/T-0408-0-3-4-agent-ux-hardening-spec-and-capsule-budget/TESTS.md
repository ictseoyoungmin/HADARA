# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -e "JSON.parse(...)"` for `.hadara/docs-registry.json` | Verify registry JSON remains parseable. | Yes | Passed | `ev:T-0408:ea558cb668db4ba99c505e8e` |
| `hadara docs explain --path docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md --json` | Verify spec is registered and explainable. | Yes | Passed | `ev:T-0408:ea558cb668db4ba99c505e8e` |
| `rg` registration/path checks | Verify SOP, registry, and spec contain expected 0.3.4 routing/budget text. | Yes | Passed | `ev:T-0408:ea558cb668db4ba99c505e8e` |
| `git diff --check` | Verify whitespace. | Yes | Passed | `ev:T-0408:ea558cb668db4ba99c505e8e` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker/source test suite | No | T-0408 is docs/spec registration only. | Not Run | Not applicable. |
| Release/package smoke | No | No release mutation or package behavior changed. | Not Run | Not applicable. |

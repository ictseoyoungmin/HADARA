# T-0282 Release candidate 0.2.0-rc.2 publish readiness

## Metadata

| Field | Value |
|---|---|
| ID | T-0282 |
| Title | Release candidate 0.2.0-rc.2 publish readiness |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Prepare and publish `hadara@0.2.0-rc.2` through the approval-gated npm helper. | The operator needed only npm authentication, a clean committed worktree, and `scripts/release/manual-publish-rc.sh T-0282 --execute`; the helper performed final validation, artifact refresh, dry-runs, confirmation, publish, and npm view verification. |

## Scope

| In Scope | Reason |
|---|---|
| Bump npm package metadata from `0.2.0-rc.1` to `0.2.0-rc.2`. | Required before npm can publish the next immutable package version. |
| Refresh README, release notes, release readiness docs, manual helper examples, and current-state docs for rc.2. | Prevent operators and package users from following stale rc.1 instructions. |
| Refresh workspace `dist` from Docker build output. | Published package whitelist includes `dist/`. |
| Run Docker validation and built-CLI smokes without npm/GitHub/Docker/PyPI mutation. | Confirms the source state that the approval-gated helper will publish after operator confirmation. |
| Prepare optional GitHub Release draft note. | The manual helper can create a draft if the operator opts in with `--github-draft`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish execution outside the approval-gated helper. | Registry mutation must remain operator-confirmed and helper-mediated. |
| GitHub Release creation or tag push. | Optional and still gated by `--github-draft` plus helper confirmation. |
| Docker image publishing. | Deferred release target. |
| PyPI/TestPyPI publish or Python bridge version bump. | The Python bridge is a separately published `hadara==0.2.0rc1` preview bridge and is not part of this npm RC. |
| Installer execution or MCP release/package execution. | Deferred/no-mutation boundaries remain unchanged. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-07 | Draft | Initial task scaffold. | Task create output. |
| 2026-06-07 | Active | Preparing npm `0.2.0-rc.2` publish readiness. | This capsule. |
| 2026-06-07 | Done | rc2 source metadata/docs/build/package/clean-checkout readiness were prepared and closed before the operator helper run. | T-0282 evidence. |
| 2026-06-07 | Done | Operator helper regenerated release artifact/package/clean evidence, published `hadara@0.2.0-rc.2` to npm, and verified npm view returned `0.2.0-rc.2`; GitHub draft was not requested. | T-0282 publish evidence. |

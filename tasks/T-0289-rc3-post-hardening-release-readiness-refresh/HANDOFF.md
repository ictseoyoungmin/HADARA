# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0289 |
| Status | Done |
| Last Updated | 2026-06-09 |

## Last Completed

| Item | Evidence |
|---|---|
| rc3 release readiness re-proven after T-0288 in the Docker baseline. | package smoke + clean-checkout smoke passed; release gate strict / dry-run / publish dry-run green; see EVIDENCE.md. |

## Operator Publish Runbook (remaining steps)

The only steps left to publish `hadara@0.2.0-rc.3` are the three the operator owns:

| Step | Command | Notes |
|---|---|---|
| 1. Commit a clean worktree | `git add -A && git commit` | The helper aborts on any dirty/untracked file. Commit this capsule and the state-doc updates first. |
| 2. Authenticate npm | `npm login` (or `npm login --registry=https://registry.npmjs.org --auth-type=legacy`) | The helper requires `npm whoami` to succeed. |
| 3. Publish via the helper | `scripts/release/manual-publish-rc.sh T-0289 --execute` | Run a dry-run first (`scripts/release/manual-publish-rc.sh T-0289`) to confirm all steps pass, then `--execute` and type exactly `publish` at the prompt. |

Run the helper from an environment where `npm run check` passes (the operator's normal publish environment). Do not run it from the raw `/mnt/f` host shell, where node_modules is empty/symlink-broken and `npm run check` (step 1 of the helper) would fail.

The helper itself re-runs `npm run check`, rebuilds and verifies the release artifact, regenerates package smoke and clean-checkout smoke evidence under `--task T-0289`, runs the release gates, checks that `0.2.0-rc.3` is not already on npm, and only then publishes after the interactive `publish` confirmation.

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Operator runs the publish runbook above. | Source readiness is proven; only operator-gated commit/auth/publish remain. | scripts/release/manual-publish-rc.sh |
| Optional: GitHub Release draft after publish. | Secondary, token-gated. | `--execute --github-draft` on the helper. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host `/mnt/f` cannot run `npm run check`. | The publish helper would abort at step 1 on the raw host. | Publish from the operator's working environment, not the `/mnt/f` shell. |
| This capsule is not git-committed by the agent. | Working tree carries T-0289 + state-doc updates. | The operator commits as publish step 1. |

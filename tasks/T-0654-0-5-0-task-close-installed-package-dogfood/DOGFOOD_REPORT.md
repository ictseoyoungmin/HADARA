# T-0654 Installed Package Dogfood Report

## Summary

Verdict: pass for the installed-package `task close` slice.

The latest source tarball installed into an external `/tmp` project, initialized a governed scaffold, blocked an un-authored capsule without writes, closed an authored baseline capsule through one public `task close` call, and treated a second close as an idempotent no-op without duplicate close proof.

## Environment

| Item | Value |
|---|---|
| Package source | `/tmp/hadara-0.5.0-rc.0.tgz` from current source/dist |
| External project | `/tmp/hadara-close-dogfood/project` |
| Installed entrypoint | `/tmp/hadara-close-dogfood/node_modules/hadara/dist/cli/main.js` |
| Package version | `0.5.0-rc.0` |

## Results

| Scenario | Result | Evidence |
|---|---|---|
| Install and init | Passed | `npm install --prefix /tmp/hadara-close-dogfood --no-bin-links /tmp/hadara-0.5.0-rc.0.tgz`; `init --profile governed --json` returned `ok:true`. |
| Blocked close | Passed | Pre-authoring `task close --task T-0001 --json` returned `ok:false`, `mode:dry-run`, `closeState:blocked`, `readOnly:true`, `executedWrites:0`, and lock order `project-lifecycle -> task-board -> task-scoped -> evidence-append`. |
| Clean close | Passed | Authored T-0001 plus validation evidence closed with one `task close --task T-0001 --json`; report returned `ok:true`, `closeState:closed-valid`, `executedWrites:2`, `closeProofAppended:true`, ordered locks, and `operation.phase=closed-valid` with `persisted:false`. |
| Idempotent retry | Passed | Second `task close --task T-0001 --json` returned `executedWrites:0`, `closeProofAppended:false`, `idempotentNoop:true`; evidence file had one `close-proof` record. |

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| F-1 | Low | `npm pack` needed `NPM_CONFIG_CACHE=/tmp/hadara-npm-cache` in the sandbox because the default home npm cache was read-only. | Environment-only; not a product blocker. |

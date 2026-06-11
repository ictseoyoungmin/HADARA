# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0297 |
| Status | Done / closed |
| Last Updated | 2026-06-11 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0297 created for prepublish cleanup and final readiness. | `tasks/T-0297-0-3-0-rc-0-prepublish-cleanup-and-final-readiness/` |
| README/package metadata/lifecycle feedback applied; duplicate Phase 7 bundle removed. | `README.md`, `package.json`, `src/services/release-artifact.ts`, `.gitignore` |
| Release readiness rerun passed without publish mutation. | Focused tests; Docker sync build; package smoke; Docker clean-checkout smoke; release artifact; strict release gate; release dry-run; publish dry-run. |
| T-0297 lifecycle closed valid. | Finish executed; ready passed; close evidence appended; audit-close returned closed-valid. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Operator may npm publish `hadara@0.3.0-rc.0` from the repository root after pulling this final commit. | T-0297 readiness is green and publish remains manual approval-gated. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Publish remains operator-only. | This task must not run real `npm publish` or create external releases. | Stop at release dry-run and publish dry-run; provide manual instructions. |
| npm login and helper must run from repo root, not from a docs/task subdirectory. | The helper expects `package.json`, `dist/`, `dist-release/`, git status, and built CLI paths relative to the root. | Run `cd /mnt/f/NowWorking/HADARA-dev`, `npm login --registry=https://registry.npmjs.org`, `npm whoami --registry=https://registry.npmjs.org`, then `bash scripts/release/manual-publish-rc.sh T-0297 --execute`. |
| Host clean-checkout failed at `npm ci`; Docker clean-checkout passed. | Host npm environment can be unreliable, but Docker evidence is the release source. | Use the helper from a normal authenticated shell; the helper reruns validation before prompting for publish. |

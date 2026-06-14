# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Validate `hadara@0.3.0-rc.2` through `npx` and a temp-prefix package install rather than the operator's global `hadara`. | Accepted | The operator already observed a stale global CLI path; post-publish recycle should prove the registry package independently. | `npx hadara@0.3.0-rc.2 version --verbose --json` and `/tmp/hadara-t0312-install/node_modules/.bin/hadara version --verbose --json` returned package version `0.3.0-rc.2`. |
| D-2 | Do not execute broad HADARA-dev self-migration in T-0312. | Accepted | The dry-run plans registry artifacts plus protocol-version, COMMAND_SURFACE, and SOP marker writes; that is wider than a post-publish recycle hotfix. | `protocol migrate --target 0.3.0 --json` self dry-run recorded in T-0312 findings. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|

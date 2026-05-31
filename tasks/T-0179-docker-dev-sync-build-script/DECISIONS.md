# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0179-1 | Add repo-level npm scripts before adding a self-hosted HADARA dev command. | Accepted | A shell helper avoids the recursion of using an untrusted/stale HADARA CLI to rebuild itself. | `scripts/dev-docker-sync-build.sh`; helper evidence. |
| D-0179-2 | Use `version --verbose --json` as the default built CLI smoke. | Accepted | Runtime origin diagnostics directly verify the refreshed workspace dist path. | `npm run dev:docker-sync-build` evidence. |

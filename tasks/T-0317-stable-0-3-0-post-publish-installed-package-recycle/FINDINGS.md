# Findings

| ID | Finding | Severity | Status | Evidence |
|---|---|---|---|---|
| F-1 | `npx -y hadara@0.3.0 version --json` was not a clean stable-package proof in this workspace. From the source checkout, `npx`/`npm exec` resolved the stale global `hadara@0.3.0-rc.2`; from isolated `/tmp` with a clean PATH, `npx` reached the registry but failed twice with DNS `EAI_AGAIN`. | Medium | Carry forward | Temp-prefix installed bin `/tmp/hadara-t0317-install/node_modules/.bin/hadara` correctly reported `packageVersion: "0.3.0"` and `distLooksStale:false`; record `command:T-0317:npx-exact-check` as failed environment evidence. |
| F-2 | Fresh governed `docs doctor` returned `ok:true` but warned `docs/REFACTOR_LOG.md` is historical while appearing in Required Reading. | Low | Carry forward | Basic and standard docs doctor were clean; governed docs doctor had two warnings: `DOC_ARCHIVE_CANDIDATE` and `DOC_HISTORICAL_REQUIRED_READING`. |

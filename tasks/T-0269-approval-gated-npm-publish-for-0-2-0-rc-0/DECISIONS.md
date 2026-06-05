# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `docs/assets/hadara_sub_right_name.png` as the repo-local README asset location. | Accepted | `docs/assets/` is appropriate for documentation imagery; package README rendering needs a committed remote URL or package whitelist adjustment before publish. | README uses a GitHub raw URL for the top image. |
| D-2 | Do not run publish execute or manual npm publish in this pass. | Accepted | `NPM_TOKEN` is missing, no explicit execute approval was given, and README changes require fresh package/release evidence before real publish. | T-0269 dry-run evidence and risks. |
| D-3 | Treat `release publish --mode execute` as a gate/audit report, not the real npm publisher. | Accepted | Current code sets all release targets `willExecute:false` and never runs `npm publish`; real publish remains the manual script path or future runner. | `src/services/release-publish.ts`; dry-run report privacy flags. |

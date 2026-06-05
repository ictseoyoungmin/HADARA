# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Current HEAD cleanliness is confirmed before publish preparation. | Done | `git status --short` returned no output before T-0269 task creation. |
| AC-2 | Release dry-run and release publish dry-run are rerun without mutation. | Done | Release dry-run ready; publish dry-run ok with token absence warnings only; all mutation flags false. |
| AC-3 | npm token and approval conditions are checked without exposing token values. | Done | `NPM_TOKEN` missing; GitHub release token missing; publish execute not run. |
| AC-4 | README install/npx examples and release boundary language are updated for `0.2.0-rc.0`. | Done | README rewritten; top image points at `docs/assets/hadara_sub_right_name.png` through a GitHub raw URL. |
| AC-5 | Publish execute is not run without explicit approval and fresh post-README evidence. | Done | No `release publish --mode execute`, manual publish script, `npm publish`, `npm view`, or registry mutation was run. |
| AC-6 | Evidence and handoff/project/release docs are updated. | Done | T-0269 evidence records attached; RELEASE_NOTES, RELEASE_READINESS, PROJECT_STATE, AGENT_HANDOFF, DEVELOPMENT_SLICES, and capsule docs updated without claiming publish. |

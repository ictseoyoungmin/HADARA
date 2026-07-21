# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0671 |
| Title | Release Artifact Evidence Journal |
| Status | Done |
| Created | 2026-07-21T22:12 |
| Updated | 2026-07-21T22:22 |
## Last Completed

| Item | Evidence |
|---|---|
| Implemented release artifact journal-first source/evidence root separation and self-invalidation guard. | ev:T-0671:ab1f6210270546fc889c2e74 |
| TypeScript build passes after implementation. | ev:T-0671:324879edc6c74a3eb8312b51 |
| Docker sync-build, built CLI journal smoke, and docs doctor passed. | ev:T-0671:991aa7227760421d9c700e43, ev:T-0671:758e82217e4d4ac99cdad97d, ev:T-0671:787c10c8f97d4fa4af9e8865 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Close T-0671 and commit, then start T-0672 Package Smoke Isolation and Timeout Policy. | T-0671 validation is complete; remaining reviewer capsules are separate release-readiness recycle work. | `docs/TASK_WORKFLOW_COMMANDS.md`, reviewer release recycle plan |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `--allow-source-evidence-write` exists only as an explicit escape hatch. | Same-root release artifact evidence can still self-invalidate if misused. | Default behavior fail-closes with `RELEASE_ARTIFACT_SELF_INVALIDATION_RISK`; release flow should use clean source clone + separate evidenceRoot. |
| T-0672 through T-0675 remain unstarted. | Release-readiness recycle design is not complete after T-0671 alone. | Continue with T-0672 Package Smoke Isolation and Timeout Policy next. |

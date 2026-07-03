# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Created a GitHub draft prerelease for `v0.4.0-rc.0` titled `HADARA 0.4.0-rc.0`. | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` |
| Verified the draft is `isDraft=true`, `isPrerelease=true`, `tagName=v0.4.0-rc.0`, and targets `964a8431cc08c2e89460be46560c8a8d98b451e1`. | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` |
| Prepared release-note and command artifacts under the T-0488 capsule. | `tasks/T-0488-0-4-0-rc-0-github-release-draft/artifacts/` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the stable readiness decision capsule. | Required pre-stable capsule 7 is complete; the next gate is promote/no-promote review across the RC, dogfood, and pre-stable cleanup capsules. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `docs/AGENT_HANDOFF.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The draft release URL returned by GitHub uses an `untagged-*` path while the draft remains unpublished. | The URL may look odd even though `gh release view` verifies `tagName=v0.4.0-rc.0`. | Use `gh release view v0.4.0-rc.0 --repo ictseoyoungmin/HADARA-dev --json tagName,isDraft,isPrerelease,url,targetCommitish` for verification. |
| Stable `0.4.0` is not published by this capsule. | The RC draft does not imply stable promotion. | Continue with the stable readiness decision capsule before any stable publish. |

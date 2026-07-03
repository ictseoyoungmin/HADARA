# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0489 stable readiness decision | Decision artifact says proceed to stable publish preparation for `hadara@0.4.0`, but not to publish from current rc metadata. Evidence: `ev:T-0489:a15c2fd8548c496593c2d31f`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open stable `0.4.0` publish preparation capsule. | T-0489 accepts the pre-stable cleanup line and routes publish to a separate approval-gated capsule. | `tasks/T-0489-0-4-0-stable-readiness-decision/artifacts/STABLE_READINESS_DECISION.md`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Stable `0.4.0` is not yet published and source metadata still targets `0.4.0-rc.0`. | Publishing without a stable preparation capsule would ship rc metadata. | Retarget metadata/docs/artifacts and rerun release validation before publish. |
| T-0481 audit has one post-close diagnostic report hash warning. | The warning should not block stable prep, but should be visible in the decision trail. | Treat as accepted because blockers are 0 and source/slot hashes match. |
| RC GitHub Release remains a draft prerelease. | Public GitHub release visibility is not equivalent to npm rc visibility. | Leave rc draft as-is unless the operator explicitly publishes it; handle stable GitHub Release separately. |

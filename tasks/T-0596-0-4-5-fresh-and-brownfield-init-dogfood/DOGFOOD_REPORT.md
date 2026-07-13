# T-0596 Dogfood Report

## Summary

`ok: true`

The current built CLI passed the 0.4.5 init adoption dogfood set across fresh projects, governed lifecycle use, brownfield adoption, and fail-closed safety cases.

## Coverage

| Scenario | Result | Notes |
|---|---|---|
| Fresh `basic` init | Passed | `init doctor`, `docs doctor --scope all`, and `task status` all succeeded. |
| Fresh `standard` init | Passed | `init doctor`, `docs doctor --scope all`, and `task status` all succeeded. |
| Fresh `governed` init | Passed | `init doctor`, `docs doctor --scope all`, and `task status` all succeeded. |
| Governed lifecycle | Passed | Created one task, authored required capsule docs, and closed with `task finalize --execute --auto`; final state was `closed-valid`. |
| Brownfield dry-run | Passed | Existing project returned `hadara.init.adoption.v1` with zero writes and did not create `.hadara`. |
| Brownfield execute | Passed | Matching plan hash wrote adoption surfaces, preserved existing project docs, produced registry v3, and kept manifest-derived `currentRelease` as `3.2.1`. |
| Plan hash safety | Passed | Missing hash and mismatched hash both exited fail-closed with status 6. |
| Unsafe/partial safety | Passed | Partial `.hadara` and unsafe symlink cases were detected and not adopted. |

## Artifact

The machine-readable summary is `artifacts/dogfood-summary.json`.

## Residual Notes

The first Node child-process harness attempt hit host `spawnSync` `EPERM`, which is a recurring environment limitation for nested process launch in this workspace. The final dogfood run used direct shell CLI invocations and passed.

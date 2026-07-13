# HADARA 0.4.4-rc.0

Release candidate for the external/delegated dogfood hardening line after stable 0.4.3.

## Highlights

- Validates HADARA in external project shapes before release: delegated basic-profile dogfood, standard-profile external validation, and an independent Claude Code governed-profile run that completed 8 Task Capsules.
- Fixes fresh-project continuation drift found by dogfood: bootstrap "first task" guidance now retires after real task history, generated governed handoff no longer starts with empty completed-task tables, and Product metadata can be initialized from package metadata.
- Improves installed/consumer CLI UX: conventional `-v` behavior, non-HADARA-root version freshness diagnostics, generated read ranges, context-pack guidance, and finish-only status hints.
- Clarifies closed task status output by separating valid close proof from skipped fast-path done-level checks.
- Keeps the primary workflow unchanged: `task status`, `task create`, `validation run` / `evidence add-command`, and guarded `task finalize`.

## Validation Line

- T-0572 defined the v0.4.4 external-repository validation plan.
- T-0573 through T-0577 ran delegated/external dogfood across basic, standard, and governed profiles.
- T-0575 and T-0578 fixed the dogfood findings selected for pre-release cleanup.
- T-0579 prepares this prerelease source/readiness state and leaves npm/GitHub mutation to the operator publish flow.

## Boundaries

- npm publish should use the `next` tag for `0.4.4-rc.0`.
- Stable `latest` remains `hadara@0.4.3` until a later stable promotion decision.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and post-publish installed-package recycle are out of scope for this release-preparation capsule.
- After publication, run a separate installed-package recycle capsule against `hadara@next` expected `0.4.4-rc.0`.

# HADARA 0.4.2

Stable release for the 0.4.2 command-surface reduction, status performance, init structure, and stable-preflight dogfood line.

## Highlights

- Promotes the `0.4.2-rc.0` command portfolio cleanup: retired public command surfaces and stale redirect stubs stay removed, while current workflow guidance stays centered on `task status`, `task finalize`, `validation run`, and evidence list/add-command.
- Improves status/read-model performance with faster default status output, explicit full/detail modes, and invocation-local selected-task read memoization.
- Keeps `task finalize --execute --auto` as the ordinary guarded close path, with close-plan blockers detected before partial finish writes.
- Adds response-only evidence append-lock diagnostics and preserves direct-result validation recovery for restricted agent environments.
- Fixes stable-preflight dogfood issues from the published RC line: consumer `context pack` source/release-warning leakage, empty-project first-task guidance, similar handoff-to-open-task matching, EOF slice truncation semantics, and validation recovery guidance.
- Adds final profile-aware cleanup: `basic` and `standard` projects do not warn about optional missing `docs/AGENT_HANDOFF.md`, and task-selection required-reading recommendations only include docs present in the project profile.

## Verification Line

- `0.4.2-rc.0` was published on npm with `next` and released as a public GitHub prerelease.
- RC installed-package recycle passed from consumer paths.
- Installed toy-project dogfood covered `basic`, `standard`, and `governed` profiles.
- Stable-preflight source dogfood rerun in T-0544 confirmed the prior findings stayed fixed and closed a governed toy task through the current workflow.
- Stable source preparation in T-0545 retargets metadata/docs to `0.4.2` and leaves npm/GitHub publication as explicit operator actions.

## Boundaries

- npm publish uses the `latest` tag for `0.4.2`.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and full 0.5 state-first adoption remain out of scope.
- After publish, run a separate installed-package recycle capsule against `hadara@latest` expected `0.4.2`.

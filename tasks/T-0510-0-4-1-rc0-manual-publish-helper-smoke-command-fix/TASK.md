# T-0510 0.4.1 rc0 manual publish helper smoke command fix

## Identity

| Field | Value |
|---|---|
| ID | T-0510 |
| Title | 0.4.1 rc0 manual publish helper smoke command fix |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix the 0.4.1-rc.0 manual publish helper so it uses the current package-smoke command surface. | The operator publish attempt stopped before npm publish because `manual-publish-rc.sh` still called removed `hadara package smoke`. |

## Scope

| Boundary | Items |
|---|---|
| In | Replace the stale helper command and add a focused regression test. |
| Out | npm publish, GitHub Release draft creation, and broader release-helper refactors. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Identify the stopped publish step from operator log. | Done |
| 2 | Change fresh release evidence from `package smoke` to `smoke package`. | Done |
| 3 | Add a regression test against the removed command. | Done |
| 4 | Validate script syntax, focused tests, and build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `manual-publish-rc.sh` calls `run_hadara smoke package --execute ...`, not `run_hadara package smoke ...`. | Done | `ev:T-0510:14f8ebc85ed5466ab51be7be` | `scripts/release/manual-publish-rc.sh` |
| AC-2 | Regression coverage prevents the stale removed command from returning. | Done | `ev:T-0510:4fd82837a221488dbdc309b3` | `tests/unit/manual-publish-script.test.ts` |
| AC-3 | Focused validation passes in Docker/ext4 and the TypeScript build passes. | Done | `ev:T-0510:4fd82837a221488dbdc309b3`, `ev:T-0510:85f18464c12c47698a85df05` | Validation rows |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| bash -n scripts/release/manual-publish-rc.sh | Yes | Passed | ev:T-0510:14f8ebc85ed5466ab51be7be |
| bash scripts/release/manual-publish-rc.sh --help | Yes | Passed | ev:T-0510:fb14e919c4a44bc2bd499828 |
| docker exec hadara-dev ... npx vitest run tests/unit/manual-publish-script.test.ts --reporter=dot | Yes | Passed | ev:T-0510:4fd82837a221488dbdc309b3 |
| npm run build | Yes | Passed | ev:T-0510:85f18464c12c47698a85df05 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Operator publish log | reference | active | First `--github-draft` attempt stopped because `gh` was missing; second npm-only attempt stopped at stale `package smoke` before publish. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Approval-gated publish helper. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Current command-surface routing and removed-command boundary. |

## Changes

| Area | Summary |
|---|---|
| Release helper | Replaced stale `run_hadara package smoke` with canonical `run_hadara smoke package`. |
| Tests | Added a script regression assertion for canonical package smoke usage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | GitHub draft creation in the publish container still requires `gh`; npm-only publish can proceed without it, or install/auth `gh` before using `--github-draft`. | Open | `scripts/release/manual-publish-rc.sh` |
| RF-2 | Risk | Host Vitest still hits environment-specific `spawnSync bash EPERM`; Docker/ext4 focused test passed. | Closed | Validation evidence |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Publish helper stale command fixed and focused validation passed. |

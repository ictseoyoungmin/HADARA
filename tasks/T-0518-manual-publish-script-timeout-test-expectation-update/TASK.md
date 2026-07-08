# T-0518 manual publish script timeout test expectation update

## Identity

| Field | Value |
|---|---|
| ID | T-0518 |
| Title | manual publish script timeout test expectation update |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Align manual publish helper tests with the new package-smoke timeout contract. | T-0517 changed the helper to pass `--timeout "${PACKAGE_SMOKE_TIMEOUT}"`; the unit test should assert the new canonical command and timeout documentation instead of the old exact string. |

## Scope

| Boundary | Items |
|---|---|
| In | `tests/unit/manual-publish-script.test.ts` expectation for canonical `smoke package` command, timeout default, help text, and timeout pass-through. |
| Out | Changing release helper behavior, reducing release smoke coverage, npm publish, GitHub Release publication, or committing T-0516 operator evidence. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Update the manual publish script unit-test assertion to include `PACKAGE_SMOKE_TIMEOUT` and `--timeout` pass-through. | Done |
| 2 | Validate direct shell syntax and timeout wiring checks. | Done |
| 3 | Record the local Vitest `execFileSync('bash') EPERM` residual without treating it as a helper contract failure. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Manual publish script test expects the new `smoke package --timeout "${PACKAGE_SMOKE_TIMEOUT}"` invocation. | Done | ev:T-0518:015ca50115d84a83ae2e130a | `tests/unit/manual-publish-script.test.ts` |
| AC-2 | Direct helper syntax validation still passes. | Done | ev:T-0518:117c66c7a27d47458cddff7a | `scripts/release/manual-publish-rc.sh` |
| AC-3 | Local focused unit-test residual is documented and resolved as an environment `execFileSync('bash') EPERM`, not a failed assertion. | Done | ev:T-0518:8270c73684da4874bbe64571 | `tests/unit/manual-publish-script.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `bash -n scripts/release/manual-publish-rc.sh` | Yes | Passed | ev:T-0518:117c66c7a27d47458cddff7a |
| `rg timeout expectation wiring` | Yes | Passed | ev:T-0518:015ca50115d84a83ae2e130a |
| `npx vitest run tests/unit/manual-publish-script.test.ts --reporter=dot` | No | Blocked | ev:T-0518:aff1ec6932be4ad6b4ce5b3a; resolved by ev:T-0518:8270c73684da4874bbe64571 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `scripts/release/manual-publish-rc.sh` | reference | active | Helper contract changed in T-0517 to include timeout pass-through. |
| `tests/unit/manual-publish-script.test.ts` | reference | active | Unit test that guards helper script behavior. |

## Changes

| Area | Summary |
|---|---|
| Tests | Updated manual publish script expectation to match T-0517 timeout behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run the focused unit test in Docker/ext4 or normal CI where `execFileSync('bash')` is not blocked by the tool sandbox. | Open | `tests/unit/manual-publish-script.test.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Test expectation updated; direct validation passed; local Vitest launch residual documented. |

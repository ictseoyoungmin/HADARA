# T-0563 0.4.3 seven-metric workflow measurement

## Identity

| Field | Value |
|---|---|
| ID | T-0563 |
| Title | 0.4.3 seven-metric workflow measurement |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Expand the primary workflow harness from timing/call count to all seven requested product metrics across init profiles. | Keep the four-command/six-call primary budget and report setup/probe calls separately. |

## Scope

| Boundary | Items |
|---|---|
| In | Measurement v2 report; seven metrics; structured dropout report; recommendation outcomes; onboarding first-file routing; generated scaffold fixes; all-profile built-CLI runs; docs/tests. |
| Out | Public telemetry; raw prompts/transcripts; external repository study; package publish/deploy; new public commands; claiming built-CLI time as package-install time. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define seven metric semantics, privacy boundary, and installed-package limitation. | Done |
| 2 | Implement v2 success/failure reports and fix generated first-file routing. | Done |
| 3 | Run all-profile measurements, focused/full validation, and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | One report contains all seven metrics with explicit methods and count boundaries. | Met | Measurement v2 schema and focused assertions passed. | `ev:T-0563:c2961dbcf55a491c8bf2ddd7` |
| AC-2 | Failures emit the first dropout stage instead of losing the report. | Met | Host EPERM run emitted a structured `init` dropout; static regression covers the failure contract. | `ev:T-0563:c2961dbcf55a491c8bf2ddd7` |
| AC-3 | Generated onboarding routes the first current-state read to `.hadara/state/current.json`. | Met | Init/registry/session focused tests passed and every profile selected the canon first. | `ev:T-0563:c2961dbcf55a491c8bf2ddd7`, `ev:T-0563:f91b077b38c848879b1fd749` |
| AC-4 | Basic, standard, and governed built-CLI toys close-valid in six primary calls with zero stale references. | Met | All three Docker runs closed-valid under the budget with currentness `clean`. | `ev:T-0563:f91b077b38c848879b1fd749` |
| AC-5 | Installed-package inclusion remains an explicit release-readiness follow-up, not an optimistic built-CLI claim. | Met | Default reports say `includesPackageInstallation:false` and emit `PRIMARY_PACKAGE_INSTALL_NOT_INCLUDED`; installed-package mode accepts measured install duration. | `ev:T-0563:c2961dbcf55a491c8bf2ddd7` |
| AC-6 | Focused and full Docker validation pass without public telemetry or a new command. | Met | Focused 52/52 and full Docker 1049/1049 passed; the harness remains a repo script. | `ev:T-0563:c2961dbcf55a491c8bf2ddd7`, `ev:T-0563:6ecd43540a0c4fc9947762fa` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Measurement/onboarding focused tests | Yes | Passed | ev:T-0563:c2961dbcf55a491c8bf2ddd7 |
| Basic/standard/governed measurement matrix | Yes | Passed | ev:T-0563:f91b077b38c848879b1fd749 |
| Full Docker sync-build | Yes | Passed | ev:T-0563:6ecd43540a0c4fc9947762fa |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User P2/v0.4.3 request | constraint | active | Measure the seven product signals rather than add features. |
| docs/PRIMARY_WORKFLOW_BUDGET.md | implementation-source | active | Preserve four primary commands and six calls. |
| T-0561/T-0562 contracts | implementation-source | active | First-file canon and currentness verdict feed the metrics. |

## Changes

| Area | Summary |
|---|---|
| measurement | Replaced the timing-only report with v2 seven-metric success/failure reports, explicit call kinds, dropout stages, recommendation outcomes, and installed-package boundaries. |
| onboarding | Routed generated session start and required reading to `.hadara/state/current.json` before prose projections. |
| registry | Registered the structured canon as required current-state input and taught required-reading checks to accept JSON. |
| validation | Added regression assertions and ran all init profiles plus the full Docker suite. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Installed-package duration must be supplied by the final release-readiness run. | Deferred | 0.4.3 release capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Seven-metric, privacy, profile matrix, and install-boundary scope accepted. |
| 2026-07-10 | Done | All seven metrics, all-profile matrix, onboarding routing, focused tests, and full Docker validation completed. |

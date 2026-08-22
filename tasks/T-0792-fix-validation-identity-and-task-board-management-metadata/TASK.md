# T-0792 Fix validation identity and Task Board management metadata

## Identity

| Field | Value |
|---|---|
| ID | T-0792 |
| Title | Fix validation identity and Task Board management metadata |
| Status | Done |
| Created | 2026-08-22T16:32 |
| Updated | 2026-08-22T16:41 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make validation retry resolution and Init v1 document ownership agree with their actual identity and write boundaries. | A retry resolves an earlier validation attempt only when the check label and exact command argv match; fresh Init records `docs/TASK_BOARD.md` as `command-managed`. |

## Scope

| Boundary | Items |
|---|---|
| In | Validation check-identity documentation/registry alignment, Init v1 document-management type/schema/model alignment, focused regressions, generated workflow guidance, and fresh built-CLI verification. |
| Out | Broad validation evidence redesign, release publication, and unrelated public docs or lifecycle behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map P2-5/P2-6 findings to validation, capability, Init model, schema, and generated-document owners. | Done |
| 2 | Align check identity wording and Init `TASK_BOARD.md` management metadata. | Done |
| 3 | Add focused regressions and run fresh built-CLI dogfood. | Done |
| 4 | Run Docker full validation and prepare proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Validation retry resolution requires the same check label and exact command argv, and reusing a label with a different command does not auto-resolve an earlier failure. | Met | `ev:T-0792:f70c9d1e18a9499e8efe1477` | `src/services/validation-run.ts`; `tests/unit/validation-run.test.ts` |
| AC-2 | Capability registry and generated/current workflow guidance describe check identity rather than check name alone. | Met | `ev:T-0792:5afb779c39ce4e819d561580` | `src/services/capability-registry.ts`; `src/init/templates.ts`; `docs/HADARA_WORKFLOW.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | Fresh Init v1 `documents.json` records `docs/TASK_BOARD.md` as `command-managed`, and the runtime type/schema accept that value. | Met | `ev:T-0792:f70c9d1e18a9499e8efe1477` | `src/init/model.ts`; `src/init/types.ts`; `src/schemas/init-documents.schema.json` |
| AC-4 | Focused, full, Docker, and fresh built-CLI validation pass without a functional regression. | Met | `ev:T-0792:988531888a14442c84986901`; `ev:T-0792:f2c93210ac9a4e22a54e21ac`; `ev:T-0792:f70c9d1e18a9499e8efe1477` | Validation records below; fresh init and validation-identity dogfood |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused P2 regression suites | Yes | Passed | Validation identity, Init model/planner, workflow docs, schema fixtures, docs registry, and help tests passed. | ev:T-0792:5afb779c39ce4e819d561580 |
| Core full suite | Yes | Passed | Docker npm run check passed core 131 files and 1,071 tests. | ev:T-0792:988531888a14442c84986901 |
| HADARA-dev full suite | Yes | Passed | Docker npm run check passed HADARA-dev 18 files and 145 tests. | ev:T-0792:f2c93210ac9a4e22a54e21ac |
| Built CLI fresh Init dogfood | Yes | Passed | Fresh standard Init produced command-managed TASK_BOARD metadata; same-label/different-command validation retry produced no resolution tag. | ev:T-0792:f70c9d1e18a9499e8efe1477 |
| Source hygiene | Yes | Passed | git diff --check passed. | ev:T-0792:ac4d6111c0a04562810c7864 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0790-repair-docs-site-diagrams-for-visual-readability/artifacts/current-build-init-capsule-doc-audit.md` | background | active | Defines P2-5 check identity and P2-6 management metadata mismatches. |
| `src/services/validation-run.ts` | implementation-source | active | Existing identity key and conservative resolution behavior. |
| `src/init/model.ts`; `src/init/types.ts`; Init schemas | implementation-source | active | Canonical document ownership and runtime validation boundary. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Validation and evidence semantics. |

## Changes

| Area | Summary |
|---|---|
| Validation identity | Kept retry resolution keyed by check label plus exact command argv, aligned capability/help and generated/current workflow wording, and locked the behavior with existing plus new help regressions. |
| Init ownership | Added `command-managed` to Init document management types/schema and changed fresh `docs/TASK_BOARD.md` registry entries to that ownership. |
| Verification | Added Init ownership and generated workflow assertions; passed focused tests, Docker full check, fresh built-CLI Init dogfood, and identity retry dogfood. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Generate a fresh release candidate from the current source; retained RC6 bytes predate T-0790 through T-0792. | Open | T-0790/T-0791 handoff; release readiness docs |

## Close Summary
Aligned validation retry resolution with the check label plus exact command argv identity, corrected Init v1 `TASK_BOARD.md` ownership to `command-managed` across model/types/schema/generated output, and passed focused tests, Docker full validation, and built-CLI dogfood.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-22 | Draft | Initial task scaffold. |
| 2026-08-22 | Draft | Implemented P2-5/P2-6 source, schema, generated-guidance, and regression changes; focused and built-CLI checks passed. |
| 2026-08-22 | Draft | Docker full check passed core 1,071 tests and HADARA-dev 145 tests; prepared close sources. |
| 2026-08-22 | Done | Completed P2-5/P2-6 implementation and validation; prepared proof-last close. |

# T-0609 0.4.6 validation execution capture hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0609 |
| Title | 0.4.6 validation execution capture hardening |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden `validation run` command output capture for delegated-agent environments. | Use file-backed stdout/stderr capture by default, expose capture metadata in JSON, and preserve direct-result recovery for launch-permission failures. |

## Scope

| Boundary | Items |
|---|---|
| In | `validation run` execution capture, JSON schema, focused tests, Docker build/test/dist refresh, and task evidence. |
| Out | Rewriting the validation service to async process execution, changing package/release smoke subprocess wrappers, or expanding current-state validation history fields. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add file-backed stdout/stderr capture metadata to `validation run`. | Done |
| 3 | Validate focused tests, direct-result recovery, file-capture JSON smoke, build, and Docker dist freshness. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default `validation run` execution reports `execution.capture.mode=file` and byte counts for stdout/stderr. | Done | `ev:T-0609:e3bdac7c97b3473caf2f15ed` | `src/services/validation-run.ts` |
| AC-2 | Direct-result and injected-spawn paths keep explicit capture metadata without changing recovery semantics. | Done | `ev:T-0609:d02711fef4904796956f552b` | `tests/unit/validation-run.test.ts` |
| AC-3 | Docker build/test/dist refresh passes after the change. | Done | `ev:T-0609:e6fca1ddbc0345c7aac257b2` | `npm run dev:docker-sync-build` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused validation-run tests | Yes | Passed | `ev:T-0609:d02711fef4904796956f552b` |
| File capture JSON smoke | Yes | Passed | `ev:T-0609:e3bdac7c97b3473caf2f15ed` |
| TypeScript build | Yes | Passed | build output before Docker sync |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0609:e6fca1ddbc0345c7aac257b2` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0607-0-4-6-codex-delegated-onboarding-dogfood/DOGFOOD_REPORT.md` | reference | active | Delegated Codex onboarding found repeated validation-wrapper launch/capture friction. |
| `.hadara/local/feedback/T-0607-codex-delegated-onboarding-findings.md` | reference | active | Local feedback summary; not committed. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | `validation run` remains the validation evidence surface and direct-result recovery path. |

## Changes

| Area | Summary |
|---|---|
| `src/services/validation-run.ts` | Default subprocess capture now writes stdout/stderr to temporary files and reports capture metadata. |
| `src/schemas/validation-run.schema.json` | Added `execution.capture` schema fields. |
| `tests/unit/validation-run.test.ts` | Added coverage for file, direct-result, and injected capture modes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full async `execFile`/`spawn` refactor remains out of scope; current patch keeps the synchronous API and solves pipe-capture loss only. | Open | Future execution-layer capsule |
| RF-2 | Follow-up | `npx`/`npm` launch EPERM can still occur in restricted tool environments; `--direct-result` remains the supported recovery path. | Open | `ev:T-0609:bba6e77fc9d9434387477cf7` resolved by `ev:T-0609:d02711fef4904796956f552b` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Implemented file-backed validation capture and capture metadata. |
| 2026-07-14 | Done | Validated focused tests, file-capture JSON smoke, build, and Docker full suite. |

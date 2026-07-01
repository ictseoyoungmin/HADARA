# T-0455 Agent UX Validation Latest Attempt Projection

## Identity

| Field | Value |
|---|---|
| ID | T-0455 |
| Title | Agent UX Validation Latest Attempt Projection |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| tasks/T-0454-agent-ux-validation-attempt-auto-resolution/HANDOFF.md | reference | approved | implemented | sha256:1d22b2979b8cefaca58af81d7d8924aed2f1506af44ab4700e2c87314cd35ac7 | Routed this work from auto-resolution to latest-attempt projection. |
| .hadara/context/MEMORY.md | background | approved | implemented | sha256:0aa97ccfd65ac18a6632c295bc6f8df1b02d0e548cfcf186f3069f03f9b153b2 | Dogfood notes for validation attempt projection and wrapper/help follow-ups. |
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:64d6545e66e3cee113bf140d853b972ef1c62b9c1113976206e9fd6c16683907 | `task status` workbench read model. |
| src/schemas/task-workbench.schema.json | implementation-source | approved | implemented | sha256:56f46cd8cfcc588cfc24a708dbc4d0b61692f8b8b644e1f8bc6e825f6a92f76e | Workbench schema field classification. |
| tests/unit/task-workbench.test.ts | implementation-source | approved | implemented | sha256:b7c66e578aba933bf4de82e9d946d1b41a2c898de6b82dd7b8ff6a0c7e4f1463 | Focused workbench projection tests. |

## Goal

| Goal | Notes |
|---|---|
| Show current validation-attempt state in `task status`. | Agents should not have to inspect raw `evidence list` records to answer which validation checks are currently passed, unresolved, or resolved. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Add `sources.evidenceList.validationAttempts` to the workbench report. | Done | `ev:T-0455:ec70182bf0f9491292013cf1` |
| 2 | Group validation-run attempts by stable check key or summary fallback and account for exact resolution tags. | Done | `ev:T-0455:ec70182bf0f9491292013cf1` |
| 3 | Expose compact text output and schema field classification. | Done | `ev:T-0455:d17cc01c4fd4444da2e9ace8`, `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task status --json` exposes per-check validation attempt summaries with total checks, unresolved failed/blocked count, latest evidence id, latest outcome, and resolution evidence ids. | Yes | Met | `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` | Required | `src/services/task-workbench.ts` |
| AC-2 | Resolved failed/blocked validation attempts are not reported as unresolved when later exact resolution tags exist. | Yes | Met | `ev:T-0455:ec70182bf0f9491292013cf1` | Required | `tests/unit/task-workbench.test.ts` |
| AC-3 | Text `task status` output includes a compact validation-check count and unresolved count when attempts exist. | Yes | Met | `ev:T-0455:ec70182bf0f9491292013cf1` | Required | `src/services/task-workbench.ts` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused task-workbench tests | `cd /tmp/hadara && npx vitest run tests/unit/task-workbench.test.ts` | Yes | Passed | `ev:T-0455:ec70182bf0f9491292013cf1` |
| TypeScript build | `cd /tmp/hadara && npm run build` | Yes | Passed | `ev:T-0455:d17cc01c4fd4444da2e9ace8` |
| Built CLI smoke | `node dist/cli/main.js task status --task T-0454 --json` includes `validationAttempts.checks=4` and `unresolvedFailedOrBlocked=0`. | Yes | Passed | `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/services/task-workbench.ts` | N/A | Added validation attempt projection and text summary to `task status`. | Reduce raw evidence inspection for current validation state. | `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` |
| `src/schemas/task-workbench.schema.json` | N/A | Classified `sources.evidenceList.validationAttempts` as additive. | Make consumer expectations explicit. | `ev:T-0455:d17cc01c4fd4444da2e9ace8` |
| `tests/unit/task-workbench.test.ts` | N/A | Added regression coverage for passed retry and explicit resolution of blocked attempts. | Prevent loss of the latest-attempt projection semantics. | `ev:T-0455:ec70182bf0f9491292013cf1` |
| `tasks/T-0455-agent-ux-validation-latest-attempt-projection/*` | N/A | Completed capsule docs and evidence projection. | Prepare capsule for finalize/audit. | `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `task status` remains slow on the mounted workspace because it still composes broad close/docs/protocol reports. A future UX capsule should consider a faster status tier or progress diagnostics. | Open | T-0455 dogfood |
| RF-2 | Follow-up | T-0454's wrapper/help hazards remain open: nested spawn EPERM handling and `evidence add-command --help` mutation. | Open | `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/HANDOFF.md` |

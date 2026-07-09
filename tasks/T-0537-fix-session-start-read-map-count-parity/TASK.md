# T-0537 Fix session start read map count parity

## Identity

| Field | Value |
|---|---|
| ID | T-0537 |
| Title | Fix session start read map count parity |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix session start docs read-map count/list parity. | `docsReadMap.readFirstCount` should describe the returned `readFirst` preview array, while the full total remains available under an explicit total field. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara session start --json` docs read-map JSON contract, schema fixture, focused tests, built CLI smoke. |
| Out | Changing docs registry ranking, context pack counts, or broader session-start routing behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce and define the count contract. | Done |
| 2 | Split preview counts from total counts in session-start docs read-map output. | Done |
| 3 | Validate focused tests, build, Docker dist refresh, and built CLI smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docsReadMap.readFirstCount` equals `docsReadMap.readFirst.length` in session-start JSON. | Done | `ev:T-0537:2eade83b52764d7d962d8456` | `src/context/session-start.ts` |
| AC-2 | Full read-first totals remain machine-readable through an explicit total count field. | Done | `ev:T-0537:2eade83b52764d7d962d8456` | `src/schemas/session-start.schema.json` |
| AC-3 | Validation evidence is recorded for focused tests, build, Docker refresh, and built CLI smoke. | Done | `ev:T-0537:2eade83b52764d7d962d8456` | `tests/unit/session-start.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/unit/session-start.test.ts --reporter=dot` | Yes | Passed | `ev:T-0537:2eade83b52764d7d962d8456` |
| `npm run build` | Yes | Passed | `ev:T-0537:2eade83b52764d7d962d8456` |
| `npm run dev:docker-sync-build -- --smoke-command "session start --task T-0537 --json"` | Yes | Passed | `ev:T-0537:2eade83b52764d7d962d8456` |
| `node dist/cli/main.js session start --task T-0537 --json` | Yes | Passed | `ev:T-0537:2eade83b52764d7d962d8456` |
| session-start read map parity validation | Yes | Passed | ev:T-0537:585550c5431a4a3d80f3de0d |
| session-start read map parity command suite | Yes | Passed | ev:T-0537:2eade83b52764d7d962d8456 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | implementation-source | active | Routes T-0535 dogfood follow-up for session-start read-map count/list mismatch. |
| `src/context/session-start.ts` | implementation-source | active | Builds `hadara.sessionStart.v1`. |
| `tests/unit/session-start.test.ts` | reference | active | Focused regression coverage. |

## Changes

| Area | Summary |
|---|---|
| Session start | `docsReadMap.readFirstCount` and `driftWarningCount` now describe the returned preview arrays; additive total fields preserve full registry totals. |
| Schema/tests | `hadara.sessionStart.v1` fixture documents `docsReadMap` preview/total fields and focused tests assert parity. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Downstream callers may already read `readFirstCount` as total; additive `readFirstTotalCount` preserves the total for migration. | Closed | `src/context/session-start.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | Done | Fixed session-start docs read-map preview count parity and validated through Docker sync-build. |

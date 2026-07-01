# T-0456 Agent UX Evidence Help Mutation Guard

## Identity

| Field | Value |
|---|---|
| ID | T-0456 |
| Title | Agent UX Evidence Help Mutation Guard |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| .hadara/context/MEMORY.md | background | approved | implemented | sha256:50854cb2f7c0fb747729a961e9fdb60db70ee7b04936d909f1e707e9b29146e5 | Dogfood note identifying `evidence add-command --help` mutation as an agent UX repair candidate. |
| src/cli/evidence.ts | implementation-source | approved | implemented | sha256:c2cc53aa9471e288787b1a3c7d294569cbda197b1f28562e53a447fce91d8303 | Evidence command handler and mutation boundary. |
| tests/unit/evidence-json.test.ts | implementation-source | approved | implemented | sha256:a2c8c7f7fef3ebbe84e9a87a546238042f868e0dbbc7573f38b13cff6c1f26b5 | Evidence CLI regression coverage. |

## Goal

| Goal | Notes |
|---|---|
| Make evidence help reads non-mutating. | `hadara evidence add-command --task T-XXXX --help` must print help and must not append evidence or require a task id before showing help. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Add an evidence-command help guard before mutation branches. | Done | `ev:T-0456:3575c0472d5b464585261a79` |
| 2 | Add regression tests for task-supplied and no-task `add-command --help`. | Done | `ev:T-0456:3575c0472d5b464585261a79` |
| 3 | Validate focused tests, TypeScript build, and built CLI non-mutation smoke. | Done | `ev:T-0456:3575c0472d5b464585261a79`, `ev:T-0456:dbf8b1a1dc8d4707b5d9469c`, `ev:T-0456:2c697ca98ea7410a9a9f23d9` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `evidence add-command --task <id> --help` prints help without appending to `evidence.jsonl` or mutating `EVIDENCE.md`. | Yes | Met | `ev:T-0456:2c697ca98ea7410a9a9f23d9` | Required | `src/cli/evidence.ts` |
| AC-2 | `evidence add-command --help` prints help without first requiring `--task`. | Yes | Met | `ev:T-0456:3575c0472d5b464585261a79` | Required | `tests/unit/evidence-json.test.ts` |
| AC-3 | Existing evidence mutation behavior remains valid under initialized 0.4 test fixtures. | Yes | Met | `ev:T-0456:3575c0472d5b464585261a79` | Required | `tests/unit/evidence-json.test.ts` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused evidence CLI tests | `cd /tmp/hadara && npx vitest run tests/unit/evidence-json.test.ts` | Yes | Passed | `ev:T-0456:3575c0472d5b464585261a79` |
| TypeScript build | `cd /tmp/hadara && npm run build` | Yes | Passed | `ev:T-0456:dbf8b1a1dc8d4707b5d9469c` |
| Built CLI smoke | `node dist/cli/main.js evidence add-command --task T-0456 --help`; before/after `evidence.jsonl` line count stayed 0 and `EVIDENCE.md` hash stayed `d78157636ffb51e669d234131710e829629d7992063a74bc3571f5fa75bfeabb`. | Yes | Passed | `ev:T-0456:2c697ca98ea7410a9a9f23d9` |
| Close preflight | Done-level harness validate, evidence lint, task status, and `git diff --check`. | Yes | Passed | `ev:T-0456:d26da6fd327f45c7acd95e12` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/evidence.ts | N/A | Added early help handling for evidence commands before mutation guards and required task parsing. | Prevent help reads from appending evidence. | `ev:T-0456:2c697ca98ea7410a9a9f23d9` |
| tests/unit/evidence-json.test.ts | N/A | Added non-mutation help tests and initialized 0.4 project fixtures for mutation tests. | Preserve regression coverage under the legacy mutation boundary. | `ev:T-0456:3575c0472d5b464585261a79` |
| dist/* | N/A | Refreshed built CLI from Docker build output. | Keep workspace CLI current for dogfood smoke and next capsules. | `ev:T-0456:dbf8b1a1dc8d4707b5d9469c` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `validation run` nested spawn EPERM handling remains the next high-signal agent UX hazard. | Open | `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/HANDOFF.md` |
| RF-2 | Follow-up | Help/mutation guard should become a shared command-family invariant, not only an evidence-handler local fix. | Open | `src/cli/main.ts`, `src/cli/help.ts` |

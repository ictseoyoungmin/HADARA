# T-0457 Agent UX Validation Wrapper Error Semantics

## Identity

| Field | Value |
|---|---|
| ID | T-0457 |
| Title | Agent UX Validation Wrapper Error Semantics |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| .hadara/context/MEMORY.md | background | approved | implemented | sha256:8b7555f5b63ec2768b3ef57cfc068f6d7fff6277773365c1a7f931230d530ae7 | Dogfood note carrying wrapper EPERM/launch-error friction forward. |
| src/services/validation-run.ts | implementation-source | approved | implemented | sha256:be9a4608e505aadd0bcd99f00a62bdda157510b5593797cee1b34759b05de911 | Validation runner execution and evidence semantics. |
| src/cli/validation.ts | implementation-source | approved | implemented | sha256:58ad4124326fa413c6beda4d6b7ec18a86620a410ec1a260b70fa49acd0ccd53 | Validation CLI text/JSON surface. |
| src/schemas/validation-run.schema.json | constraint | approved | implemented | sha256:30eb0b662b369e8d92e2252426089741c94ae286b5cc317514c6ecfa8c32835b | Validation run JSON schema. |
| src/services/capability-registry.ts | reference | approved | implemented | sha256:c2deb948197a9e93c8dbc957c099f9b18c0c7fffeebd9d10c81e6f3e650d987d | Registry/help notes for validation run. |
| tests/unit/validation-run.test.ts | implementation-source | approved | implemented | sha256:dc6e3854b675709c69f7e68eefb1ff74bb398924406ab11c8c7e6da2896bcae0 | Focused regression coverage. |

## Goal

| Goal | Notes |
|---|---|
| Make validation wrapper launch failures agent-readable. | `validation run` should distinguish command/test failure from wrapper launch failure such as ENOENT, EPERM/EACCES, or timeout, and should provide actionable fallback guidance. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Add structured execution semantics for launch errors, timeouts, and non-zero exits. | Done | `ev:T-0457:63bc490c0f524cc0b5b748e3` |
| 2 | Add fallback next actions and text output for blocked wrapper outcomes. | Done | `ev:T-0457:ded129c4252440a593372c75` |
| 3 | Validate focused tests, build, and built CLI blocked-wrapper smoke. | Done | `ev:T-0457:63bc490c0f524cc0b5b748e3`, `ev:T-0457:28fb374a36e641bab90bd53d`, `ev:T-0457:ded129c4252440a593372c75` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Launch failures expose `execution.commandStarted:false`, a stable `execution.failureKind`, and structured `execution.error` metadata. | Yes | Met | `ev:T-0457:ded129c4252440a593372c75` | Required | `src/services/validation-run.ts` |
| AC-2 | EPERM/EACCES, ENOENT, timeout, and non-zero exit semantics are distinguishable from each other in tests. | Yes | Met | `ev:T-0457:63bc490c0f524cc0b5b748e3` | Required | `tests/unit/validation-run.test.ts` |
| AC-3 | Blocked wrapper reports include copy-safe fallback guidance to run directly or record the direct result. | Yes | Met | `ev:T-0457:ded129c4252440a593372c75` | Required | `src/services/validation-run.ts` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused validation-run tests | `cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts` | Yes | Passed | `ev:T-0457:63bc490c0f524cc0b5b748e3` |
| TypeScript build | `cd /tmp/hadara && npm run build` | Yes | Passed | `ev:T-0457:28fb374a36e641bab90bd53d` |
| Built CLI blocked-wrapper smoke | `node dist/cli/main.js validation run --task T-0457 --check "Wrapper launch failure smoke" --json -- definitely-not-a-real-hadara-test-command` produced `failureKind:"command-not-found"`, `commandStarted:false`, shell-safe fallback nextAction, and no duplicate append on retry; expected blocked evidence was resolved. | Yes | Passed | `ev:T-0457:ded129c4252440a593372c75` |
| Close preflight | Done-level harness validate, evidence lint, task status, and `git diff --check` after Source Documents role repair. | Yes | Passed | `ev:T-0457:4e0b7aa8ec2d4fcf8eca3886` |
| Post-close polish revalidation | Focused validation-run tests and TypeScript build after fallback nextAction message polish. | Yes | Passed | `ev:T-0457:39f53f784bae492e92fd9a54` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/validation-run.ts | N/A | Added execution failure classification, structured launch error metadata, fallback nextActions, injectable spawn test seam, and shell-safe next-action quoting. | Make blocked wrapper outcomes understandable and recoverable for agents. | `ev:T-0457:63bc490c0f524cc0b5b748e3` |
| src/cli/validation.ts | N/A | Prints next actions in non-JSON blocked validation output. | Keep text-mode UX actionable. | `ev:T-0457:ded129c4252440a593372c75` |
| src/schemas/validation-run.schema.json | N/A | Documents additive execution semantics and nextActions fields. | Keep machine-readable contract aligned. | `ev:T-0457:63bc490c0f524cc0b5b748e3` |
| src/services/capability-registry.ts | N/A | Notes structured blocked launch failure behavior for `validation.run`. | Align help/registry metadata with implementation. | `ev:T-0457:63bc490c0f524cc0b5b748e3` |
| tests/unit/validation-run.test.ts | N/A | Added ENOENT and EPERM coverage plus shell-safe fallback command assertion. | Prevent regression of wrapper failure semantics. | `ev:T-0457:63bc490c0f524cc0b5b748e3` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Long `task status` / `task finalize` runs on mounted workspaces still need progress or a faster close path. | Open | T-0456/T-0457 dogfood |
| RF-2 | Follow-up | JSON help output remains text-only for command help surfaces such as `evidence add-command --help --json`. | Open | T-0456 handoff |

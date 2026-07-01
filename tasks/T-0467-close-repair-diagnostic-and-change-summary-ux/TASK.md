# T-0467 Close repair diagnostic and change summary UX

## Identity

| Field | Value |
|---|---|
| ID | T-0467 |
| Title | Close repair diagnostic and change summary UX |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/task/task-close-repair-plan.ts | implementation-source | approved | implemented | sha256:eb89424088475974c83405233e68b721fa8ffe1f95033b3a9c7733919cfbe88e | Existing read-only repair-plan classification contract. |
| src/task/task-close.ts | implementation-source | approved | implemented | sha256:2db509ff5a118ba3da455526c084cf4de4d41a6580ee28dc03793ab3197ef469 | Current close-source evidence writer semantics used by repair-plan tests. |
| src/harness/validate.ts | implementation-source | approved | implemented | sha256:df727f1db8e82e455a1b5c728de5de76ac0c40e1a9820ee127b10b39fc8bb784 | Change Summary line-range validator. |
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:4350e46a4019fa3ba7f91bc40033753c37b0ea0bf6c0718c03a27481746be438 | `task status` authoring suggestion read model. |
| src/schemas/task-workbench.schema.json | implementation-source | approved | implemented | sha256:056b3e76c2531ec9d9414cc40477961db20bfd2c6899261e403c26e09058b781 | `task.status` JSON contract for authoring suggestions. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | approved | implemented | sha256:0d806302c8c60f6a5b3701249aa65f349610c6e3f19eec1840e5afb865697de3 | User-facing lifecycle command guidance. |
| docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md | constraint | approved | implemented | sha256:99a25056cf312cfd9fcfe5fc1db7e15319a18e580b38932dfee922e12093fff9 | TASK.md controlled value and line-range spec. |

## Goal

| Goal | Notes |
|---|---|
| Clarify `task close-repair-plan` as a conditional repair diagnostic and improve Change Summary line-range authoring UX. | Keep ordinary capsule flow on `task status` / `task finalize`; use git-derived Change Summary rows as read-only suggestions, not automatic TASK.md writes. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Repair the `task-close-repair-plan` test fixture drift against the current close-source model. | Done | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| 2 | Mark close-repair-plan guidance as conditional diagnostic rather than ordinary lifecycle loop command. | Done | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| 3 | Accept ergonomic Change Summary line ranges and expose git-based read-only candidate rows in `task status`. | Done | `ev:T-0467:e6450a6e21b6450dbaae39ed`, `ev:T-0467:a469046512334522b0bc0418` |
| 4 | Validate focused code paths, schema, and built CLI smoke. | Done | `ev:T-0467:e6450a6e21b6450dbaae39ed`, `ev:T-0467:a469046512334522b0bc0418` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task close-repair-plan` remains a read-only repair diagnostic and current close-source hash tests pass. | Yes | Met | `ev:T-0467:e6450a6e21b6450dbaae39ed` | Required | tests/unit/task-close-repair-plan.test.ts |
| AC-2 | Change Summary validation accepts useful single-line, range, comma-separated, and special marker syntax with clearer errors. | Yes | Met | `ev:T-0467:e6450a6e21b6450dbaae39ed` | Required | tests/harness/harness-validate.test.ts |
| AC-3 | With `.git` present, `task status` suggests Change Summary candidate rows without writing TASK.md or inventing prose. | Yes | Met | `ev:T-0467:e6450a6e21b6450dbaae39ed`, `ev:T-0467:a469046512334522b0bc0418` | Required | tests/unit/task-workbench.test.ts |
| AC-4 | The additive `authoringSuggestions.changeSummary` payload is covered by schema validation and build. | Yes | Met | `ev:T-0467:e6450a6e21b6450dbaae39ed` | Required | src/schemas/task-workbench.schema.json |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker tests | `npx vitest run tests/unit/task-close-repair-plan.test.ts tests/unit/task-workbench.test.ts tests/harness/harness-validate.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts` | Yes | Passed | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| TypeScript build | `npm run build` in `/tmp/hadara`, then refresh `/workspace/dist` | Yes | Passed | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| Built CLI smoke | `node dist/cli/main.js task status --task T-0467 --json` | Yes | Passed | `ev:T-0467:a469046512334522b0bc0418` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/harness/validate.ts | L317-L325, L428-L434 | Broadened Change Summary line validation and improved invalid-format examples. | Reduce authoring friction around final-state line ranges. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| src/services/task-workbench.ts | L2, L74-L78, L495-L496, L503-L516, L625-L720 | Added read-only git-derived Change Summary candidate rows to `task status` authoring suggestions. | Let `.git` assist line/path authoring without auto-writing agent-owned prose. | `ev:T-0467:e6450a6e21b6450dbaae39ed`, `ev:T-0467:a469046512334522b0bc0418` |
| src/schemas/task-workbench.schema.json | L173, L180-L204 | Added schema coverage for `authoringSuggestions.changeSummary`. | Keep JSON consumers aligned with the additive status payload. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| src/services/capability-registry.ts | L555, L574 | Reworded close-repair-plan registry metadata as conditional repair diagnostic. | Prevent agents from treating it as a normal lifecycle-loop command. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| docs/TASK_WORKFLOW_COMMANDS.md | L179, L203 | Clarified `task close-repair-plan` use after stale, invalid, duplicate, or missing close proof findings. | Keep ordinary task work on `task status` and `task finalize`. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| docs/specs/0.4.0/lifecycle/02_Command_Deprecation_Plan.md | L38 | Classified close-repair-plan as a special repair diagnostic. | Match status-first lifecycle design. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md | L176-L177, L187 | Documented accepted ergonomic Change Summary line formats. | Align product spec with validator behavior. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| tests/unit/task-close-repair-plan.test.ts | L9, L58, L93, L140-L150 | Updated repair-plan fixtures to use current close evidence and close-source drift surfaces. | Resolve T-0466 RF-1 without changing product repair-plan behavior. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| tests/unit/task-workbench.test.ts | L2, L25-L29, L172-L201 | Added git-backed Change Summary suggestion coverage and read-only assertion. | Prove `.git` assists authoring without mutating TASK.md. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| tests/harness/harness-validate.test.ts | L150-L194 | Added accepted and rejected Change Summary line-range fixtures. | Lock the UX/parser behavior. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Mounted `task status` still took about 32s on this workspace; performance remains a separate UX optimization candidate. | Open | `ev:T-0467:a469046512334522b0bc0418` |

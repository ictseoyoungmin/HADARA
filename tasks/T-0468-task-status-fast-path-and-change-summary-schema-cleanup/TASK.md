# T-0468 Task status fast path and Change Summary schema cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0468 |
| Title | Task status fast path and Change Summary schema cleanup |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:95cb5be6e68617a8eb61fb4ab8a144cc4a338a76818d182c069056d810a535a2 | Selected-task status read model and authoring suggestions. |
| src/cli/task.ts | implementation-source | approved | implemented | sha256:d0034c01118b60e0265b4a18e79b995f8d77a2a12789f6fb327d2d9074a75155 | CLI status option parsing. |
| src/harness/validate.ts | implementation-source | approved | implemented | sha256:67707fbbb16a567dc5745de68c0dcce87b0c1e1239ded4d8ace48782a52bb7ad | TASK.md Change Summary schema validation. |
| src/task/task-capsule.ts | implementation-source | approved | implemented | sha256:357ff360052246039f2047e372cd89beab5ba94cac6569dd222049176f68c744 | Default Task Capsule scaffold. |
| src/task/task-templates.ts | implementation-source | approved | implemented | sha256:244bc978835a4edb98521c047646372831b3d93a9a0505b702d2390f3356d32e | Template Task Capsule scaffold. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | approved | implemented | sha256:0397f46d9315b0d6dd6464b56b38f8f2766cc607a4644b20aab3f553ec71c307 | Task workflow semantics. |
| docs/CLI_JSON_CONTRACT.md | reference | approved | implemented | sha256:e25a080a65ba06310cd59df879fbe5769f7526950bb64cb8324978a670f07e3a | CLI JSON behavior contract. |

## Goal

| Goal | Notes |
|---|---|
| Make default selected-task `task status` fast again and replace Change Summary line ranges with stable Area values. | Keep close-grade diagnostics available through `task status --detail full` and `task finalize`; remove default git-based Change Summary suggestions. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Split default selected-task status into a fast loop cockpit and explicit full diagnostics. | Done | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| 2 | Remove default git-derived Change Summary candidate generation. | Done | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| 3 | Change new Task Capsule Change Summary schema from Lines to Area while preserving legacy Lines validation. | Done | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| 4 | Update command docs/generated init guidance and validate focused paths. | Done | `ev:T-0468:91055b787fda40469bca06b5` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Default CLI `task status --task T --json` skips close/protocol heavy checks and returns fast loop guidance. | Yes | Met | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` | Required | tests/unit/task-workbench.test.ts |
| AC-2 | `task status --task T --detail full --json` keeps the heavier readiness/protocol diagnostic path available. | Yes | Met | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` | Required | tests/unit/task-workbench.test.ts |
| AC-3 | Change Summary authoring no longer depends on git-derived candidate rows in default status. | Yes | Met | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` | Required | tests/unit/task-workbench.test.ts |
| AC-4 | New Task Capsule templates use `Path / Area / Change / Reason / Evidence`, while legacy `Lines` tables remain accepted. | Yes | Met | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` | Required | tests/unit/task-capsule.test.ts, tests/harness/harness-validate.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker tests | `npx vitest run tests/unit/task-workbench.test.ts tests/harness/harness-validate.test.ts tests/unit/task-capsule.test.ts tests/unit/init.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts`; final focused rerun `tests/unit/task-workbench.test.ts` | Yes | Passed | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:ea4c3539ac3144bd8d299aab` |
| TypeScript build | `npm run build` in `/tmp/hadara`, then refresh `/workspace/dist` | Yes | Passed | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:ea4c3539ac3144bd8d299aab` |
| Built CLI status smoke | `node dist/cli/main.js task status --task T-0468 --json` and `--detail full` | Yes | Passed | `ev:T-0468:73df1894fd45461c9d043e28` |
| Fresh init/template smoke | `init --profile basic`, then `task create`, then inspect `TASK.md` Change Summary header | Yes | Passed | `ev:T-0468:73df1894fd45461c9d043e28` |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/task-workbench.ts | module:task status workbench | Added fast selected-task status behavior, removed git Change Summary candidates, made Change Summary guidance Area-based, and corrected fast closed-valid readiness metadata. | Keep the always-used cockpit responsive and avoid stale line-range suggestions while preserving valid close-proof state. | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28`, `ev:T-0468:ea4c3539ac3144bd8d299aab` |
| src/cli/task.ts | command:task status | Added `--detail fast|full` parsing and made CLI default selected-task status use fast mode. | Preserve full diagnostics as an explicit opt-in. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/harness/validate.ts | section:Change Summary validation | Accepted new `Area` header while keeping legacy `Lines` validation. | Avoid breaking existing capsules while moving new tasks away from stale line ranges. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/task/task-capsule.ts | scaffold:default TASK.md | Changed new default Task Capsule Change Summary header to Area. | Make new capsules use stable module/function/section areas. | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| src/task/task-templates.ts | scaffold:template TASK.md | Changed template-generated Change Summary header to Area. | Keep template capsules aligned with the default scaffold. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/task/authoring-guidance.ts | module:authoring guidance | Updated guidance from final line ranges to stable areas/modules. | Match the new schema and reduce stale references. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/cli/init.ts | generated workflow docs | Documented fast status versus full diagnostics/finalize boundary. | Keep fresh init guidance aligned with the current lifecycle UX. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/services/capability-registry.ts | command:task.status | Documented `--detail fast|full` in registry metadata and examples. | Keep registry-backed help aligned with CLI behavior. | `ev:T-0468:91055b787fda40469bca06b5` |
| src/schemas/task-workbench.schema.json | schema:authoringSuggestions.changeSummary | Restricted candidate rows to empty and removed `suggested` status from Change Summary suggestions. | Reflect removal of git-derived suggestions from status. | `ev:T-0468:91055b787fda40469bca06b5` |
| docs/TASK_WORKFLOW_COMMANDS.md | section:command semantics | Added `--detail full` and fast/default status boundary. | Keep lifecycle workflow docs accurate. | `ev:T-0468:91055b787fda40469bca06b5` |
| docs/CLI_JSON_CONTRACT.md | section:task status | Clarified fast/default status versus full diagnostics/finalize. | Keep JSON consumers from treating default status as a close-grade gate. | `ev:T-0468:91055b787fda40469bca06b5` |
| docs/specs/0.4.0/productization-redesign | module:Change Summary specs | Replaced line-range wording with stable Area wording in current 0.4 specs/templates. | Align product design docs with the new schema. | `ev:T-0468:91055b787fda40469bca06b5` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Full status/finalize diagnostics remain slow on mounted workspaces because they still run close/protocol-grade checks. | Open | `ev:T-0468:73df1894fd45461c9d043e28` |

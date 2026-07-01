# T-0461 Agent UX task status authoring suggestions

## Identity

| Field | Value |
|---|---|
| ID | T-0461 |
| Title | Agent UX task status authoring suggestions |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:4e3e977620f9823489ffba05e81ece76bb12b713c1cfcac975f6e3f6432a9072 | Workbench report and authoring suggestion implementation. |
| src/services/dashboard-task-detail.ts | implementation-source | approved | implemented | sha256:d992295bfb9724618606a442a46bec81ce8efe66791d2d5257aaf4d062da7dab | Dashboard fast workbench report compatibility. |
| src/schemas/task-workbench.schema.json | constraint | approved | implemented | sha256:e1dd10a36bd202c6502c7a5f07428659cc5fca0033f35c6b7f40ceadf4bca0cd | Public JSON schema for task status workbench. |
| tests/unit/task-workbench.test.ts | reference | approved | implemented | sha256:122abf1d3a94cf9275c7312c6bd1a1ba3edbb48432edee31681aa13365fd1d73 | Focused coverage for authoring suggestions. |
| tests/unit/schema-fixtures.test.ts | reference | approved | implemented | sha256:360b42680e46ae1ebba0ecb14c5f8027a568eb67cbb7a4909acd4f5f6ba6f766 | Schema fixture validation. |
| tests/unit/dashboard-task-detail.test.ts | reference | approved | implemented | sha256:4b53b19929b34c15e6a82a4229c334dd8c9007c1d7ed4e2ff31876da717828b6 | Dashboard compatibility validation. |

## Goal

| Goal | Notes |
|---|---|
| Add conservative task authoring suggestions to `task status --task`. | Help agents choose better task titles, Source Documents rows, source hashes, and acceptance criteria without auto-writing task prose or inventing task-specific requirements. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the authoring suggestion boundary as read-only, conservative, and non-prose-writing. | Done | ev:T-0461:dd3a7a42646e4e8cae779c1c |
| 2 | Add `authoringSuggestions` to the task workbench read model and schema. | Done | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| 3 | Preserve dashboard fast report compatibility with the additive field. | Done | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| 4 | Validate focused tests, schema fixtures, build, and built CLI smoke. | Done | ev:T-0461:d6486726fd0b4eea8775d3b0; ev:T-0461:dd3a7a42646e4e8cae779c1c |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task status --task` exposes additive `authoringSuggestions` with `readOnly:true` and `writesProse:false`. | Yes | Met | ev:T-0461:dd3a7a42646e4e8cae779c1c | Required | src/services/task-workbench.ts |
| AC-2 | Suggestions cover title cleanup, Source Documents guidance, and hash-row proposals for existing concrete source paths. | Yes | Met | ev:T-0461:d6486726fd0b4eea8775d3b0 | Required | tests/unit/task-workbench.test.ts |
| AC-3 | Acceptance guidance remains conservative and generic; it does not generate domain-specific requirements. | Yes | Met | ev:T-0461:d6486726fd0b4eea8775d3b0 | Required | src/services/task-workbench.ts |
| AC-4 | Dashboard selected-task detail remains schema/type compatible with the additive workbench field. | Yes | Met | ev:T-0461:d6486726fd0b4eea8775d3b0 | Required | src/services/dashboard-task-detail.ts |
| AC-5 | Focused tests, schema fixture validation, TypeScript build, and built CLI smoke pass. | Yes | Met | ev:T-0461:d6486726fd0b4eea8775d3b0; ev:T-0461:dd3a7a42646e4e8cae779c1c | Required | tests/unit/task-workbench.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker validation | `npx vitest run tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/dashboard-task-detail.test.ts && npm run build` in `/tmp/hadara` after overlaying changed files. | Yes | Passed | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| Built CLI smoke | `node dist/cli/main.js task status --task T-0461 --json` | Yes | Passed | ev:T-0461:dd3a7a42646e4e8cae779c1c |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/task-workbench.ts | L51-L604 | Added additive read-only `authoringSuggestions`, title/source/acceptance suggestion helpers, text summary line, and duplicate title-signal suppression. | Provide agent guidance from the status read model without auto-writing task prose. | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| src/services/dashboard-task-detail.ts | L16-L97 | Populated authoring suggestions in the fast selected-task workbench report. | Keep dashboard report shape compatible with schema. | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| src/schemas/task-workbench.schema.json | L33-L168 | Added schema for the additive `authoringSuggestions` object. | Preserve JSON contract validation. | ev:T-0461:d6486726fd0b4eea8775d3b0 |
| tests/unit/task-workbench.test.ts | L73-L162 | Added regression coverage for placeholder guidance, title cleanup, source hash rows, candidate concerns, and non-duplicated title signals. | Lock in conservative suggestion behavior. | ev:T-0461:d6486726fd0b4eea8775d3b0 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Fresh `hadara init` remains doctor-clean but still verbose; a small quickstart/verbosity capsule should be next in the five-capsule UX line. | Open | T-0462 candidate |

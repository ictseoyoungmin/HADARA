# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -pe "JSON.parse(require('fs').readFileSync('docs/specs/0.4.0/productization-redesign/manifest.json','utf8')).package"` | Validate spec manifest JSON still parses. | Yes | Passed: returned `hadara_0_4_productization_redesign_specs`. | `ev:T-0426:9f04410013f0495abac959e0` |
| `rg -n '## Scope|## Out of Scope|Decisions / Risks / Follow-ups|Kind.*Decision|Goal, Scope|scope, plan|decisions, risks|Scope reason' docs/specs/0.4.0/productization-redesign` | Confirm removed task-template/schema concepts have no stale references. | Yes | Passed: no matches. | `ev:T-0426:9f04410013f0495abac959e0` |
| `rg -n '## Minimal Loop|## Read Authority Rules|## Lifecycle Entry Gate|Evidence must reflect real execution results|## Common Failure Modes' docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md` | Confirm workflow guardrail sections/text exist. | Yes | Passed: expected sections/text present. | `ev:T-0426:9f04410013f0495abac959e0` |
| `rg -n 'Required Reading authority|routing anchor|same-capsule lifecycle chores|Risks / Follow-ups' docs/specs/0.4.0/productization-redesign/templates/0.4 docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md docs/specs/0.4.0/productization-redesign/08_Project_State_Task_Board_and_Handoff.md` | Confirm clarified context/handing-off/task-section semantics exist. | Yes | Passed: expected terms present. | `ev:T-0426:9f04410013f0495abac959e0` |
| `rg -n "[ \t]+$" docs/specs/0.4.0/productization-redesign/templates/0.4 docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md docs/specs/0.4.0/productization-redesign/08_Project_State_Task_Board_and_Handoff.md docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md tasks/T-0426-0-4-template-final-review-hold-open docs/PROJECT_STATE.md docs/AGENT_HANDOFF.md docs/TASK_BOARD.md docs/DEVELOPMENT_SLICES.md` | Check touched docs for trailing whitespace. | Yes | Passed: no matches. | `ev:T-0426:9f04410013f0495abac959e0` |
| `git diff --check` | Check whitespace in tracked diffs. | Yes | Passed. | `ev:T-0426:9f04410013f0495abac959e0` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full test suite | No | T-0426 changes docs/spec templates only; no runtime code or generated CLI output changed. | Not Run | Scope note |
| Finalize/close | No | Operator explicitly requested T-0426 remain open until document finalization. | Not Run by design. | Operator constraint |

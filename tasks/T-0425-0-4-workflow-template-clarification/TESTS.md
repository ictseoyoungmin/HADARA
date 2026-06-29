# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node -pe "JSON.parse(require('fs').readFileSync('docs/specs/0.4.0/productization-redesign/manifest.json','utf8')).package"` | Validate spec manifest JSON still parses. | Yes | Passed | `ev:T-0425:721f9033978348c6a0790450` |
| `rg -n "Release Boundary|release-boundary guidance|release boundary|Release / Package Boundary" docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md docs/specs/0.4.0/productization-redesign/README.md docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md` | Confirm workflow-facing standalone release-boundary wording was removed. | Yes | Passed: no matches | `ev:T-0425:721f9033978348c6a0790450` |
| `rg -n "## Required Reading|## Task Document Timing|## Project Start" docs/specs/0.4.0/productization-redesign/templates/0.4/AGENTS.md docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md` | Confirm Required Reading stayed in AGENTS and workflow got project-start/document-timing sections. | Yes | Passed | `ev:T-0425:721f9033978348c6a0790450` |
| `rg -n "[ \t]+$" docs/specs/0.4.0/productization-redesign/templates/0.4/AGENTS.md docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md docs/specs/0.4.0/productization-redesign/README.md docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md tasks/T-0425-0-4-workflow-template-clarification` | Check touched docs for trailing whitespace. | Yes | Passed: no matches | `ev:T-0425:721f9033978348c6a0790450` |
| `git diff --check` | Check whitespace in tracked diffs. | Yes | Passed | `ev:T-0425:721f9033978348c6a0790450` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full test suite | No | T-0425 is docs/spec-template only with no runtime code changes. | Not Run | Scope note |
| Init smoke | No | T-0425 does not change generated CLI output. | Not Run | Scope note |

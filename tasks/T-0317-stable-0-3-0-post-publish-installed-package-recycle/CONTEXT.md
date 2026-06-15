# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact read-routing anchor. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command semantics and close-source boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and release/recycle state. | Read |
| docs/TEST_STRATEGY.md | Release/install validation baseline and package-smoke boundaries. | Read |
| docs/ROADMAP.md | Release/packaging scope boundary. | Read |
| tasks/T-0312-0-3-0-rc-2-post-publish-installed-package-recycle/* | Closest installed-package recycle precedent. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Stable `0.3.0` publish is complete, but consumer recycle is pending. | `docs/AGENT_HANDOFF.md`; user feedback. | Project state could overstate readiness if install/fresh-init/migration smokes fail. |
| T-0315 remains the source/full Docker readiness baseline. | `docs/AGENT_HANDOFF.md`; `docs/TEST_STRATEGY.md`. | Running broad source validation here would duplicate the wrong layer and still not prove npm-installed behavior. |
| Disposable `/tmp` fixtures are sufficient for installed-package recycle. | T-0312 precedent and package-smoke boundary docs. | If temp fixtures differ from real consumers, recycle may miss environment-specific issues. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run npm publish or mutate release channels. | T-0317 scope. | Validation only. |
| Keep raw npm logs, install trees, and package artifacts out of committed docs. | `docs/TEST_STRATEGY.md`. | Record reduced public summaries only. |
| Prefer `npx hadara@0.3.0` and temp-prefix installed bin paths over global `hadara`. | T-0312 risks. | Avoid stale global binary ambiguity. |

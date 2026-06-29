# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0426 open until explicit operator acceptance. | Accepted | The operator requested a new capsule and no close before document finalization. | T-0426 operator instruction |
| D-2 | Treat `.hadara/context/HADARA_CONTEXT.md` as a routing anchor, not a Required Reading authority. | Accepted | This prevents overlap with `AGENTS.md` while preserving fast session routing. | T-0426 review |
| D-3 | Remove default Task Capsule `Scope`, `Out of Scope`, and task-local `Decisions` sections. | Accepted | The 0.4 capsule should be smaller; task boundary can live in Goal/Acceptance, while durable decisions belong in project decision docs or follow-ups. | T-0426 operator instruction |
| D-4 | Add explicit agent failure-prevention rules to workflow. | Accepted | The reviewer feedback identifies common practical failures and is useful for default agent behavior. | T-0426 review |

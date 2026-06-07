# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Generated `hadara init` docs describe `basic` as core docs plus task workflow docs and use the current evidence/finish/ready/close/audit-close flow. | Done | `src/cli/init.ts`; focused init/workflow tests and generated scaffold smoke passed. |
| AC-2 | README and current state docs reflect that npm `hadara@0.2.0-rc.1` and PyPI `hadara==0.2.0rc1` are published. | Done | README, Project State, PyPI runbook, Agent Handoff updates. |
| AC-3 | Tests or explicit constraints are recorded. | Done | `tests/unit/init.test.ts`; `tests/unit/task-workflow-docs.test.ts`; Docker focused validation, full check, and scaffold smokes recorded in `TESTS.md`. |
| AC-4 | Evidence is attached. | Done | T-0280 evidence `ev:T-0280:883a3d3ff3ca4620bb27131f` and `ev:T-0280:6435924f102a4021af2a6de3`. |
| AC-5 | Handoff is updated. | Done | `docs/AGENT_HANDOFF.md`; task `HANDOFF.md`. |

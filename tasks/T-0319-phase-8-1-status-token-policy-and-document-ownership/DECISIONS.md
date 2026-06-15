# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat this capsule as policy/template guidance, not runtime enforcement. | Accepted | Later capsules implement handoff validation and state projection after vocabulary is documented. | `docs/specs/0.3.1/rc1/01_Status_Token_Policy_and_Document_Ownership.md` |
| D-2 | Document canonical CloseState while naming current compatibility tokens. | Accepted | Current read models expose compatibility strings such as `close-evidence-found-invalid`; hiding them would mislead workers before normalization work exists. | `src/services/task-workbench.ts`; `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` |

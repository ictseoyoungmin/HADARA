# Risks

| Risk | Mitigation |
|---|---|
| Moving task report builders could break existing CLI imports. | Keep `src/cli/task-json.ts` as a re-export facade and run existing task JSON tests. |
| MCP task read payload could drift from the shared service. | Add parity coverage comparing `hadara.task.read` directly with `createTaskReadReport`. |
| Broad service parity scope could grow too large for one capsule. | Limit this capsule to task read-model extraction and leave policy/harness/status follow-ups to later slices. |

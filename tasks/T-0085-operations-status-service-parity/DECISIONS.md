# Decisions

Record task-local design decisions here.

- Keep the existing `hadara.ops.status.v1` schema and formatting unchanged; this task is a service-boundary refactor only.
- Preserve `src/cli/status-json.ts` as a compatibility export to avoid unnecessary churn for existing imports while directing new code to `src/services/operations-status-service.ts`.

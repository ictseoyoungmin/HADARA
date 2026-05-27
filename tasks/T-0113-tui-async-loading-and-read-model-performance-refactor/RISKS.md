# Risks

| Risk | Mitigation |
|---|---|
| Fast TUI model may omit advisory debt/release detail visible in the full aggregate. | Mark deferred heavy reads with `TUI_HEAVY_READS_DEFERRED`; keep snapshot/full aggregate behavior unchanged. |
| Cache index could hide malformed/missing capsules. | Missing `TASK.md` is represented as a stable zero-size task-index entry and task list still reports `Unknown` status. |
| Startup is faster but not yet a full worker-thread architecture. | Record this as a scoped fast-path refactor; future work can add a broader async worker if needed. |

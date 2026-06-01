# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Selected-task detail still fans out after initial paint. | Selecting a task can still feel slow on larger projects. | Medium | T-0199 adds `/api/dashboard/task-detail` to collapse selected-task detail reads. | Deferred |
| Bootstrap is not cached yet. | Manual refresh still recomputes backend read models. | Medium | T-0201 owns process-memory TTL cache. | Deferred |
| Static HTML complexity is increasing. | Future UI changes may become harder without a frontend build system. | Medium | Keep changes scoped and test source-level boundaries; revisit framework only after Phase 5.5 audit if needed. | Accepted |

# Context

- User review identified that `createActiveRunResumeReport()` trusted the local mutable manifest `capsule` path too much.
- `.hadara/local/state/active-run.json` is local mutable state; read surfaces should degrade or warn instead of guiding agents to stale paths.
- Active-run read surfaces became stable in T-0086, but active-run projection/resume schema fixtures were not added in T-0079.
- `run-state resume` is a read-only guidance surface despite the verb-like CLI name.

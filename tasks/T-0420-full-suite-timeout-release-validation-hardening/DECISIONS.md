# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make bootstrap service default to `core`, not just the CLI route. | Accepted | The unit service is the source of the first-paint contract; leaving it `full` kept a slow path in release validation. | `src/services/dashboard-bootstrap.ts`, `ev:T-0420:80ee3d2f4d09409c9c3651b9` |
| D-2 | Use a 30s default Vitest timeout with env overrides. | Accepted | Some tests intentionally spawn processes, use git, or scan many fixtures; 5s is too tight under Docker/publish-clone contention and caused false failures. | `vitest.config.ts`, `ev:T-0420:80ee3d2f4d09409c9c3651b9` |

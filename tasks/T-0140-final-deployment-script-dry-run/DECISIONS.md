# Decisions

- Use a new read-only `hadara release dry-run --json` surface instead of overloading `release gate`; the gate remains a broad readiness report, while dry-run performs stronger linked-artifact evidence validation for final release planning.
- Register `hadara.releaseDryRun.v1` and assert it at runtime before returning reports.
- Attach release artifact evidence as a reduced public `hadara.releaseArtifact.v1` report under `tasks/<task-id>/artifacts/release-artifact/`; the report schema allows the added evidence metadata while retaining the same public privacy boundary.
- Treat install-matrix evidence as still deferred because no executable install-matrix smoke surface exists yet.

# Risks

| Risk | Mitigation |
|---|---|
| Release gate accidentally executes release/package/install work. | Implement evidence checks as file reads only and keep existing command surfaces out of the gate. |
| Evidence checks create a clean-checkout smoke cycle. | Use existing Task Capsule evidence records and keep install-matrix evidence non-blocking until its execution surface exists. |
| Public summary artifact schemas remain implicit. | Register `hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1` before optional artifact reads. |
| Raw logs or private paths leak into release-gate output. | Return reduced summaries only: task id, portable evidence path, timestamp, and issue code; never include artifact content or private paths. |

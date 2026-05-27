# Decisions

- Treat remote GitHub Actions status as observed evidence, not as a command the release gate executes.
- Add `REMOTE_CI_OBSERVATION_UNRECORDED` as a local documentation readiness check in `hadara release gate`.
- Keep advisory mode warning-only and strict mode blocking for missing readiness documentation, consistent with other release-readiness checks.
- Leave workflow triggering, reruns, publishing, deployment, and GitHub API calls out of the release gate.

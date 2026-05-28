# Acceptance Criteria

- [x] `hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1` are registered schema fixtures with runtime validation coverage.
- [x] Release gate reports package-smoke, clean-checkout smoke, and release-artifact evidence checks by reading existing evidence, not executing commands.
- [x] Strict mode can block on missing package-smoke, clean-checkout smoke, or release-artifact evidence with stable issue codes; advisory mode reports warnings.
- [x] Install-matrix evidence remains non-blocking until an executable install-matrix smoke surface exists, with a stable deferred summary.
- [x] Release gate remains read-only: no smoke/package/install/publish/GitHub/Docker/MCP execution.
- [x] Focused tests, full check, strict release-gate smoke, and done-level harness validation are recorded.

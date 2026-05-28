# Context

- `docs/DEVELOPMENT_SLICES.md` lists T-0138 as Release Gate Evidence Freeze after T-0137.
- `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` says T-0138 should move release gate readiness toward evidence-backed checks while remaining read-only.
- `docs/AGENT_HANDOFF.md` and T-0137 handoff require registering `hadara.smokeEvidenceSummary.v1` before reading smoke evidence artifacts and `hadara.releaseArtifact.manifest.v1` before reading release manifests directly.
- T-0136 evidence attachment records exist in `tasks/T-0136-smoke-evidence-integration/evidence.jsonl`; committed public summary artifacts may be absent in this checkout, so the gate should use `evidence.jsonl` as the stable index and validate artifacts only when present.
- T-0137 release artifact evidence exists in `tasks/T-0137-release-artifact-builder/evidence.jsonl`.
- The release gate must not execute smoke commands, npm pack, installer scripts, package installs, publish/deploy, GitHub calls, Docker builds, provider calls, or MCP writes.

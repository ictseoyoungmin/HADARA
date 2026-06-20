# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara@0.3.3-rc.0` is published to npm with dist-tag `next`. | Met | ev:T-0402:400a8a3c43b248cc8d4fcb0f |
| AC-2 | Registry verification confirms exact version and dist-tags. | Met | ev:T-0402:4addcdd15a8149afb69c2e40 |
| AC-3 | Published tarball/package-facing metadata and README are visible. | Met | ev:T-0402:400a8a3c43b248cc8d4fcb0f, ev:T-0402:4addcdd15a8149afb69c2e40 |
| AC-4 | Published package executes from a clean consumer install path. | Met | ev:T-0402:708f2b933fff46a3917b01dc |
| AC-5 | No GitHub Release, Docker/PyPI publish, installer execution, or MCP release/package mutation runs unless explicitly requested. | Met | ev:T-0402:400a8a3c43b248cc8d4fcb0f |
| AC-6 | Shared release state and handoff are updated after publish. | Met | RELEASE_READINESS/RELEASE_NOTES/README/AGENT_HANDOFF/PROJECT_STATE updates |

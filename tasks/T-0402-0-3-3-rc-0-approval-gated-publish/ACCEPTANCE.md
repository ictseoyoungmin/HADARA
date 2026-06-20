# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara@0.3.3-rc.0` is published to npm with dist-tag `next`. | Pending | Helper publish evidence |
| AC-2 | Registry verification confirms exact version and dist-tags. | Pending | `npm view hadara@0.3.3-rc.0 version`; `npm view hadara dist-tags --json` |
| AC-3 | Published tarball/package-facing metadata and README are visible. | Pending | npm/tarball verification evidence |
| AC-4 | Published package executes from a clean consumer install path. | Pending | temp-prefix installed-bin smoke |
| AC-5 | No GitHub Release, Docker/PyPI publish, installer execution, or MCP release/package mutation runs unless explicitly requested. | Pending | Helper output/evidence |
| AC-6 | Shared release state and handoff are updated after publish. | Pending | RELEASE_READINESS/AGENT_HANDOFF/TASK_BOARD updates |

# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | npm publish completes. | Pending | Operator helper execution |
| AC-2 | `npm view hadara@0.3.2-rc.0 version` returns `0.3.2-rc.0`. | Pending | npm registry verification |
| AC-3 | npm `next` dist-tag points to `0.3.2-rc.0`. | Pending | `npm view hadara dist-tags --json` |
| AC-4 | npm `latest` dist-tag remains stable release. | Pending | `npm view hadara dist-tags --json` |
| AC-5 | Tarball and README visibility are verified. | Pending | `npm pack` or registry tarball inspection |
| AC-6 | T-0338 recycle capsule is handed off. | Pending | `docs/AGENT_HANDOFF.md` and task handoff |

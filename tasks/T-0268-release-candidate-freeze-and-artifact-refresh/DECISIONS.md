# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `hadara@0.2.0-rc.0` as the next release-candidate evidence target. | Accepted | `0.1.0-rc.0` is already published and reviewer requested `0.2.0-rc.0` unless policy conflicted. | Package metadata and release dry-run report show `0.2.0-rc.0`. |
| D-2 | Keep release notes conservative about multi-agent compatibility. | Accepted | Phase 6/6.1 provides metadata/workflow hardening, not full multi-agent runtime safety. | `docs/RELEASE_NOTES.md` boundaries section. |
| D-3 | Generalize RC metadata readiness to `0.x.0-rc.N`. | Accepted | The previous `0.1.0-rc.N` read-model gate blocked the next RC despite package metadata being valid. | Focused Docker tests and strict release gate passed after hardening. |
| D-4 | Treat empty captured stdout from installed Node CLI smoke as acceptable only when exit code is 0. | Accepted | The current environment captures empty stdout for Node child processes while direct command output is valid; failure still returns non-zero. | Package smoke passed after focused regression coverage. |
| D-5 | Do not commit `dist-release/`. | Accepted | Release readiness docs classify it as ignored local release output. | Only reduced evidence artifacts under the task capsule were committed. |

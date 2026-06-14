# Findings

| ID | Finding | Severity | Status | Evidence |
|---|---|---|---|---|
| F-1 | README badge still showed the previous published npm release `0.3.0-rc.1` while the body correctly named `hadara@0.3.0-rc.2`. | Low | Fixed in T-0312 | README badge now names npm `0.3.0-rc.2` and source `0.3.0-rc.2`. |
| F-2 | `docs/RELEASE_READINESS.md` retained an old top-level registry observation about `hadara@0.1.0-rc.0` that could read like current state. | Low | Fixed in T-0312 | The line now identifies rc.0 as historical while the current rc.2 rows remain explicit. |
| F-3 | HADARA-dev `.hadara/context/HADARA_CONTEXT.md` routes readers to `docs/DOC_REGISTRY.md` and `.hadara/docs-registry.json`, but those project-owned registry artifacts are absent in the source checkout. | Medium | Carry forward | Published fresh init creates both files; self `protocol migrate --target 0.3.0` dry-run plans registry artifacts plus broader project writes, so a focused follow-up should decide and apply the HADARA-dev registry artifact policy. |
| F-4 | `docs patch --execute` still appears to be a direct managed-section file write rather than using the shared atomic text write helper. | Medium | Carry forward | Treat as stable-0.3 hardening follow-up with tests for path containment, temp cleanup, and failure preservation. |

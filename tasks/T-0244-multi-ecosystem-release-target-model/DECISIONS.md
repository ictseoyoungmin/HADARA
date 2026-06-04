# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add release target descriptors additively instead of replacing existing release dry-run target fields. | Accepted | Preserves current consumers while providing ecosystem/provider metadata for future targets. | `src/services/release-dry-run.ts`, schema/tests |
| D-2 | Keep npm as the only active executable package smoke provider. | Accepted | Current package smoke behavior is npm pack/install based; other ecosystems need their own capsules. | `src/services/package-smoke.ts`, docs |
| D-3 | Treat `pyproject.toml` as preview metadata only. | Accepted | Python build/smoke/publish support would require new execution, dependency, and credential boundaries. | `src/services/release-targets.ts`, docs |
| D-4 | Keep historical `package-smoke` evidence terminology. | Accepted | Existing release evidence and strict proof readers depend on the established category. | Risks and docs |

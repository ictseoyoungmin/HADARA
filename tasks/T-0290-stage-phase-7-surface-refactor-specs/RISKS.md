# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Planned Phase 7 commands could be documented as implemented too early. | Agents may run unavailable commands or treat planned behavior as stable. | Medium | README note uses planned-only wording; implementation specs are under `docs/specs/0.3.0/`. | Mitigated |
| rc3 release status could remain contradictory across docs. | Future release/readiness work starts from stale assumptions. | Medium | Reconcile README and release notes to the T-0289 handoff evidence while keeping future release mutation boundaries explicit. | Mitigated |
| `.gitignore` unignore could be too broad. | Other local planning specs could become accidentally trackable. | Low | Use `docs/specs/*` plus explicit unignore exceptions for only `docs/specs/0.3.0/` and `docs/specs/phase7_surface_refactor/`; check-ignore confirmed temp planning docs remain ignored. | Mitigated |
| Phase 7.0 could grow into runtime implementation. | Breaks dependency order and capsule boundaries. | Medium | Keep this capsule docs-only; leave command registry/help for Phase 7.1. | Mitigated |
| Focused protocol/init tests were attempted but unavailable. | Residual risk: lightweight adjacency tests did not execute in this environment. | Low | Blocked because host `vitest` is absent, Docker wrapper failed at temp-workspace, and direct Docker/`/tmp` copy fallbacks timed out before tests. Phase 7.0 is docs-only; `git diff --check` and file/phrase checks passed. Next step: rerun focused tests during Phase 7.1 runtime work or when Docker copy responsiveness is restored. | Accepted risk |

# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Validate `hadara@0.3.0` from npm-installed paths, not the local source checkout. | Accepted | T-0315 already proved stable source readiness; T-0317 must prove the registry-delivered consumer artifact. | `docs/AGENT_HANDOFF.md`; user feedback. |
| D-2 | Use disposable `/tmp` projects and temp npm prefixes for recycle smokes. | Accepted | Keeps install trees, npm cache, and raw logs out of committed project state while matching consumer behavior. | `docs/TEST_STRATEGY.md`; T-0312 precedent. |

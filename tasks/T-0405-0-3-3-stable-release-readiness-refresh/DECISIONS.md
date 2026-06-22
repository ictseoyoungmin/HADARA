# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare stable `0.3.3` source/readiness now. | Accepted | T-0402 published rc0, T-0404 fixed the dogfood stable considerations, and no additional release-blocking dogfood findings remain in the imported decision input. | `tasks/T-0404-0-3-3-dogfood-findings-release-hardening/artifacts/patternforge/STABLE_0_3_3_DECISION_INPUT.md` |
| D-2 | Keep stable npm publish as the next approval-gated capsule. | Accepted | Readiness should not load tokens or mutate the registry; operator approval remains required for publish. | `docs/RELEASE_READINESS.md` |

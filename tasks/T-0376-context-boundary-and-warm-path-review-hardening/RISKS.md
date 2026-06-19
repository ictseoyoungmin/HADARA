# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Over-broad `.hadara/**` slice deny blocks intentional public registry reads. | C4 candidate slicing could lose access to project registry metadata. | Medium | Default `.hadara/**` deny uses a small allowlist for `.hadara/docs-registry.json` and `.hadara/context/HADARA_CONTEXT.md`; CLI smoke confirmed docs-registry remains sliceable. | Mitigated |
| Graph-core stale tests become brittle if source-manifest extractor-key mapping changes. | False regressions could slow future extractor work. | Medium | Tests assert public helper behavior for task/project/handoff/evidence source categories and cache status, not raw hash values. | Mitigated |
| Benchmark timeout tests rely on process timing. | Timing-sensitive tests can flake. | Low | Coverage is script-contract based for SIGTERM/SIGKILL/error/killedSignal fields, avoiding timing-sensitive child execution. | Mitigated |
| `suggestedCommandArgs` changes schema expectations. | Context-pack consumers may depend on schema fixtures. | Low | Additive field only; `suggestedCommand` remains present and shell-quoted; schema/tests updated. | Mitigated |

# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Warning noise in release dry-run. | Operators may see config advisories even when npm release readiness is otherwise ready. | Medium | Keep warnings non-blocking and preserve `review-publish-dry-run` as the optional next action when no required blockers exist. | Mitigated |
| Preview config appears more authoritative than it is. | Operators may assume `.hadara/release-targets.json` is a real schema-backed config. | Medium | Document parser is preview-only and real support requires `hadara.releaseTargetConfig.v1`. | Mitigated |
| Lightweight Python TOML parser is overused. | Future release gates could depend on incomplete TOML parsing. | Medium | Document formal TOML parser requirement before Python readiness/publish gates. | Mitigated |

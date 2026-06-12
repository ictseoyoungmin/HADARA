# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Tier derivation could over-classify active specs as always-read current state. | Operators may read too much by default. | Medium | Only project-context/session-start core docs become `current-state`; active/reference docs default to `conditional-reference` unless task workflow related. | Mitigated |
| Schema change could accidentally require tier for old outputs. | Older consumers or fixtures could break. | Low | Added `tier` to produced output and schema definitions while preserving `additionalProperties` and existing arrays. | Mitigated |

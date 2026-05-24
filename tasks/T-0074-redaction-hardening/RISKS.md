# Risks

| Risk | Mitigation |
|---|---|
| New secret patterns could overmatch harmless text. | Keep patterns focused on well-known token prefixes or sensitive assignment keys and preserve existing clean-text test coverage. |
| Existing evidence callers could break if the public API changes. | Preserve `redactSecrets()` and `containsSecret()` signatures and behavior. |
| Capture-group and no-capture replacements can behave differently. | Test both assignment-prefix preservation and direct token replacement patterns. |

# Decisions

| Decision | Rationale |
|---|---|
| Use `basic`, `standard`, and `governed` as init profile names. | The names communicate project scale and governance weight clearly for general projects. |
| Make `standard` the default profile. | Ordinary projects usually need planning and validation docs, but not security/release/governance docs up front. |
| Treat HADARA-dev as governed. | This repository has long-lived release, security, MCP, TUI, and operational surfaces that justify the heavier documentation set. |
| Remove compatibility aliases. | The scaffold should expose one clear profile vocabulary and reject unsupported profile names instead of preserving confusing alternatives. |

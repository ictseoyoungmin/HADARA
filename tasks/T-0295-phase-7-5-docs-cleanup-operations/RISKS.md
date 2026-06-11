# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operators may expect `docs archive` to move files. | Misuse could lead to assuming cleanup executed when it only planned candidates. | Medium | Command schema and report set `mode: dry-run` and `executeSupported:false`; tests assert no moves. | Mitigated |
| Required Reading markdown can still mention superseded docs after registry status changes. | Agents may read stale docs until generated/manual Required Reading edits are applied. | Medium | `docs required-reading` reports effective exclusions; docs doctor warns on stale Required Reading; use `docs patch` separately for managed edits. | Mitigated |
| Canonical docs could be retired accidentally. | Protocol/state anchors could lose canonical status. | Low | `docs mark` rejects canonical->superseded unless `--force-canonical` is present. | Mitigated |
| Missing replacement targets could create registry drift. | Superseded docs would not point to a valid replacement. | Low | `docs mark` and docs doctor both flag `DOC_SUPERSEDES_MISSING_TARGET`. | Mitigated |

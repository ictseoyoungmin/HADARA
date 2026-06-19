# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Session Start accidentally performs extra broad scans by default. | Mounted workspaces become unusable again. | Medium | The initial smoke timed out, so default mode was changed to bounded no-live; `--live` is now explicit for full context-pack graph reads. | Mitigated |
| New public schema drifts from spec or registry. | Consumers cannot safely rely on the report. | Low | Added schema fixture, schema-index/runtime registration, command registry coverage, and Docker validation. | Mitigated |
| Defaults are too broad for routine session startup. | Slow first command in mounted workspaces. | Medium | Built smoke now returns in about 1.6s with degraded/cache metadata and no live graph scan. | Mitigated |
| Evidence writes were accidentally launched in parallel during validation recording. | HADARA evidence append serialization discipline could be violated. | Low | All append commands completed, evidence lint passed with 0 issues, and no manual evidence edits were made. Future evidence writes remain serialized. | Resolved |

# Risks

| Risk | Mitigation |
|---|---|
| Validation becomes too strict for older capsules. | Validate stable structure only: headings and table headers, not prose content. |
| Format checks duplicate template strings too broadly. | Keep checks narrow and code-specific. |
| Context compression causes future agents to bypass format rules. | Encode the format contract in `harness validate`, not only in handoff text. |

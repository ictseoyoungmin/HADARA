# Risks

| Risk | Mitigation |
|---|---|
| Contract language implies evidence writes are available now. | State repeatedly that T-0046 is contract-only and current runtime remains read-only. |
| Agents treat policy evaluation as execution approval. | Clarify `policy.evaluate` is informational and cannot authorize MCP execution. |
| Future evidence attach leaks private paths or secrets. | Require workspace boundary checks and public artifact redaction before committed copies. |

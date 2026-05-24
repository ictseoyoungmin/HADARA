# Risks

| Risk | Mitigation |
|---|---|
| Local state corruption could still hide real work context. | Surface warning issues while keeping Operations Status JSON alive. |
| Premature acceptance warning remains non-blocking. | Keep this as operational debt signal until a later harness-gate slice. |

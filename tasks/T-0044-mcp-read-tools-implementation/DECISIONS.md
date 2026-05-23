# Decisions

| Decision | Rationale |
|---|---|
| Separate `tool-schemas`, `tool-registry`, and `tool-dispatch`. | T-0044 adds real handlers, and keeping the JSON-RPC server small makes T-0045 contract testing easier. |
| Represent dispatch failures as JSON-RPC errors with `data.issue`. | This preserves protocol-level failure while retaining HADARA machine-readable issue codes. |
| Treat JSON-RPC notifications as no-response messages. | JSON-RPC notification semantics require no response when `id` is absent. |

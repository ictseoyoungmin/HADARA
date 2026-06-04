# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Provider support states are represented as `supported`, `preview`, or `unsupported`. | Accepted | This is compact enough for release reports while distinguishing safe planning from execution-capable support. | T-0246 implementation. |
| D-2 | Python provider starts as preview-only and does not parse metadata beyond existing presence detection in this capsule. | Accepted | T-0247 owns Python metadata parsing; T-0246 only creates the contract boundary. | User-requested capsule order. |

# Context

- `appendEvidence()` already writes canonical `time` fields.
- Recent manual dashboard task evidence used `timestamp`, which could be missed by future evidence viewers and projections.
- Harness validation previously accepted records with missing `time`, `summary`, or `visibility`.
- Docker remains the working validation path.

# Context

- T-0059 added static dashboard serving.
- T-0060 restricted routes, methods, and basic security headers.
- `fileResponse()` still read files directly and could throw if a file or project root was unavailable.
- This slice keeps the server static/sample-backed; it does not add live data.

# T-0062 Dashboard Server Failure Semantics

## Goal

Make the static dashboard server fail predictably when project roots or allowlisted files are unavailable.

## Scope

- Catch request-handler failures and return a structured static error response.
- Return safe 404 responses for missing allowlisted static files or wrong project roots.
- Preserve route allowlisting, GET/HEAD method restrictions, and static/sample-backed boundaries.
- Add regression coverage for missing roots/files and error response headers.

## Out of Scope

- Live status integration.
- Authentication, production server hardening, or multi-user behavior.
- Serving arbitrary static directories.
- Browser screenshot testing.

## Status

Done

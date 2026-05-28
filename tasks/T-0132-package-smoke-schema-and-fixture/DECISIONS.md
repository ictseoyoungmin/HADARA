# Decisions

- Keep `hadara.packageSmoke.v1` as a fixture-level schema with additive fields allowed, matching current schema posture.
- Require explicit privacy booleans to remain `false` for raw logs, raw package contents, private paths, environment secrets, and private store paths.
- Require package-smoke report execution markers to keep release mutation and publish execution `false`, even when future local package-smoke execution is represented.
- Store deterministic report examples under `tests/fixtures/package-smoke/` instead of committing real package artifacts or logs.

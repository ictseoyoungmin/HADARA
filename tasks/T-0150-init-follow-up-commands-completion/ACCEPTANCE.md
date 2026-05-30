# Acceptance Criteria

- [x] `hadara init doctor --json` reports stale scaffold issues without writing files.
- [x] `hadara init` no longer eagerly creates local/private runtime-store directories.
- [x] `hadara init upgrade --profile <profile> --json` dry-runs missing docs, and `--execute` creates only missing profile docs without overwriting existing files.
- [x] `hadara init register-doc --path <path> --when <text> --purpose <text> --json` dry-runs SOP registration, and `--execute` adds an idempotent Required Reading row.
- [x] `hadara init enable-integration --integration hermes|mcp --json` dry-runs optional integration docs, and `--execute` creates/registers docs explicitly.
- [x] Focused init tests pass.
- [x] Full repository validation passes.
- [x] Done-level harness validation passes.
- [x] Evidence is attached.
- [x] Handoff is updated.

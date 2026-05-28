# T-0132 Package Smoke Schema and Fixture

## Goal

Register `hadara.packageSmoke.v1` as the reduced package-smoke report contract before adding any package-smoke command implementation.

## Scope

- Add the JSON Schema fixture and schema-index/runtime registration.
- Add deterministic package-smoke fixtures for success, step failure, redacted paths, private/raw omission, and public reduced evidence.
- Add validation tests proving the schema and fixtures omit raw package content, raw npm logs, environment secrets, private paths, and private store paths.
- Add a regression proving the release gate still treats package smoke as read-only planning/reporting and does not emit a package-smoke report.

## Out of Scope

- No `hadara package smoke` CLI command.
- No `npm pack`, package installation, package artifact writes, evidence attachment, install mutation, publish, GitHub Release, Docker image build, MCP write surface, provider call, or shell execution.
- No release-gate execution of package smoke.

## Status

Done

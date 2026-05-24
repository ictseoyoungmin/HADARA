# T-0084 Harness Validate Service Parity

## Goal

Continue Service Parity Expansion by routing harness validation report creation through a named shared service.

## Scope

- Add `src/services/harness-service.ts` as the shared report-builder boundary for `hadara.harness.validate.v1`.
- Route CLI `harness validate` through the shared harness service.
- Route read-only MCP `hadara.harness.validate` through the shared harness service.
- Update parity/contract tests to compare MCP harness validate payloads against the shared service.
- Apply conservative `task.read` evidence exposure policy: private evidence metadata is excluded by default and only included when `includePrivate` is true.
- Document that `task.read` `files["evidence.jsonl"]` is a sanitized read-model view, not raw file bytes.

## Out of Scope

- No harness validation rule changes.
- No replay service refactor.
- No schema runtime validation or release gates.
- No MCP writes, shell execution, provider calls, or dashboard APIs.
- No full redaction scan for all Task Capsule Markdown files.

## Status

Done

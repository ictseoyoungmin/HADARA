# T-0037 Runtime Validation and Harness Semantics

## Goal

Address review feedback that found runtime validation gaps and fake-shell failure semantics that could weaken HADARA harness evidence.

## Scope

- Add shared runtime permission mode parsing and apply it to policy, run, and fake-shell paths.
- Treat failed fake-shell observations as failed agent loop runs.
- Validate evidence result values at CLI runtime.
- Strengthen harness validation for evidence JSONL enum values.
- Prevent run scaffold from silently reusing stale scenario files.
- Avoid including global flags in `task create` titles.

## Out of Scope

- Real shell execution.
- Real provider adapters.
- MCP server implementation.
- Broad CLI parser rewrite.

## Status

Done

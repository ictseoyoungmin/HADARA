# T-0005 Evidence Store

## Goal

Attach tests, command logs, diff summaries, and notes to Task Capsules and session evidence directories.

## Scope

- Append public evidence summaries to Task Capsule `EVIDENCE.md`.
- Maintain a machine-readable `evidence.jsonl` index per Task Capsule.
- Support evidence kind, result, attached path, and visibility metadata.
- Redact public summaries and suppress private evidence paths.
- Preserve session evidence directories for command logs, test results, diff summaries, screenshots, and release smoke.

## Out of Scope

- Binary artifact copying.
- Encrypted private evidence storage.
- Dashboard evidence browser.

## Status

Done

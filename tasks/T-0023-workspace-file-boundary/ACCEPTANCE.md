# Acceptance Criteria

- [x] `../../outside.jsonl` is rejected for CLI file inputs.
- [x] Absolute paths outside the project are rejected.
- [x] Symlink escapes outside the project are rejected.
- [x] Rejections in JSON mode return a JSON issue envelope.
- [x] Public evidence artifact copy cannot copy from outside the project.
- [x] `run --script`, `run --fake-shell-fixtures`, `harness replay`, and `evidence collect --path` use the shared workspace resolver.
- [x] `hadara run --max-steps` rejects non-integers, values below 1, and values above 32.
- [x] Evidence and handoff documents are updated.
- [x] Required Docker validation passes.

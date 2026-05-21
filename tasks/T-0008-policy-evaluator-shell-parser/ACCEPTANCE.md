# Acceptance Criteria

- [x] Shell command tokenizer is separated from classification.
- [x] Safe command allowlist covers `npm test`, `npm run check`, `pytest`, and read-only git commands.
- [x] `curl | sh` and `iwr | iex` are denied.
- [x] `sudo`, `git reset --hard`, and `git clean -fdx` are denied.
- [x] Assisted mode still asks for approval.
- [x] Tests and evidence are recorded.

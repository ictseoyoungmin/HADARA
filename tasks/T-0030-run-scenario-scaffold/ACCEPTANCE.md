# Acceptance Criteria

- [x] `hadara run scaffold --task <id> --command <command>` creates script and fixture JSON files.
- [x] Generated files live under `.hadara/scenarios/`.
- [x] Generated script requests the fake-shell command and then returns a final response.
- [x] Generated fixtures include command stdout, stderr, and exit code.
- [x] `--json` returns stable generated path metadata.
- [x] Scaffold rejects missing command values.
- [x] Required Docker validation passes.
- [x] Evidence and handoff documents are updated.

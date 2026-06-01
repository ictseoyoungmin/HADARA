# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Plan is mistaken for implemented migration. | Operators may expect v2 commands to exist. | Medium | Mark command names as proposed design and add docs test for non-goals. | Mitigated |
| Automatic rewrite is accidentally implied. | Evidence history could be rewritten too early. | Medium | Explicitly forbid automatic `evidence.jsonl` and `EVIDENCE.md` rewrite. | Mitigated |
| v2 stores derived strength as source of truth. | Analyzer and writer can drift. | Low | Plan keeps proof strength derived, not persisted. | Mitigated |

# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Finish command writes too broadly. | Could overwrite operator-authored project state. | Medium | Keep execute bounded to `TASK.md` and `docs/TASK_BOARD.md`; expose other docs as advisories. | Mitigated |
| Task Board duplicate rows cause ambiguous updates. | Could update the wrong row or mask drift. | Medium | Detect duplicates and return blocking `TASK_BOARD_ROW_DUPLICATE`. | Mitigated |
| Metadata status and body status diverge. | Protocol doctor may read stale metadata status. | Medium | Update the metadata `Status` row and `## Status` body together. | Mitigated |

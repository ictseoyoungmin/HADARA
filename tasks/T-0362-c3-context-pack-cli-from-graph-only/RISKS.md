# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Public CLI could accidentally scan/build more than needed. | Slow startup would undermine C6 goals. | Medium | Reuse one `buildContextPackReport()` call, which builds graph once and accepts code inclusion explicitly. Built smokes confirmed live mounted-workspace reads are still slow without C6, so C6.1 is the next speed slice. | Carry Forward |
| Command might imply C4 slicing is available. | Users could expect `context slice` to work. | Medium | Document slice candidates as metadata only and leave C4 command out of scope. | Mitigated |
| Budget option parsing could silently accept invalid values. | Bad inputs would produce confusing context packs. | Low | Use existing strict integer helper with bounded `--budget`, `--max-items`, and `--max-read-first` parsing. | Mitigated |
| Read-only command could create cache/local artifacts. | Violates C3/C6 boundary. | Low | Added read-only snapshot test and no cache warm/write APIs are called. | Mitigated |

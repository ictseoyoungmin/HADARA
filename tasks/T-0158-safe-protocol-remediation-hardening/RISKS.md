# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Remediation writes leave partial files after failure. | Protocol repair could damage user docs. | Low | Use temp-file write, rename commit, temp cleanup, rollback attempt, and error issue reporting. | Mitigated |
| Metadata remediation drops user-owned rows. | Project State ownership/details could be lost. | Medium | Upsert only the HADARA Profile row within the Metadata section/table and preserve other rows/sections. | Mitigated |
| Table remediation duplicates semantic tables. | Doctor/remediation consumers could see conflicting frames. | Medium | Warn and skip malformed Task Board frames and legacy Decisions tables instead of appending/inserting. | Mitigated |
| Report shape changes before schema registration. | T-0159 contract work may need to account for added hash/existence fields. | Medium | Keep additions optional and record next contract task. | Open |

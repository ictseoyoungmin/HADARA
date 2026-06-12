# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legitimate existing callers pass absolute or escaping paths. | Could break writes that previously worked by accident. | Low | Current callers pass project-relative constants/planned paths; focused caller tests passed. | Mitigated |
| Symlink-based escape is not fully resolved by lexical containment. | A symlink inside the project could still point outside. | Low | This capsule implements the requested lexical guard; realpath/symlink enforcement remains a future broader filesystem policy if needed. | Accepted |
| Post-publish recycle numbering drift. | Agents could try to run recycle before publish or under the wrong task id. | Medium | rc.2 spec, slices, Project State, and Agent Handoff make T-0312 the recycle capsule. | Mitigated |

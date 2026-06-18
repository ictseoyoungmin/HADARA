# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Task context candidates may over-read project docs. | Worker agents could lose the compact-routing benefit. | Medium | Prefer explicit task, evidence, known-problem, required-reading, and excluded-document signals; keep heuristic routing conservative. | Mitigated |
| Default extraction can surface existing degraded source warnings. | Graph report `ok` could be false for repository state unrelated to this builder. | Medium | Treat warnings as degraded but not fatal; only graph errors and state projection errors make the report fail. | Mitigated |
| CLI/cache concerns could leak into this capsule. | Scope creep may make validation and close harder. | Low | Keep CLI and persistent cache out of scope and record them for the next integration capsule. | Mitigated |

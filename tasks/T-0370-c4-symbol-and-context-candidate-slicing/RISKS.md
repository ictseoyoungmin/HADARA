# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Symbol body boundaries are approximate when C2 lacks `endLine`. | Returned slice can include neighboring code. | Medium | Use a bounded default neighborhood and report original line bounds/source hash; future C2 exact ranges can narrow it additively. | Accepted |
| Context-pack candidate resolution may require graph/pack construction. | Candidate slicing can be much slower than explicit path/range slicing on cold paths. | Medium | Resolve only one requested candidate for one task, reuse C6 graph/cache paths through existing pack builder, avoid implicit cache writes, and carry C6.6/C6.8 warm-path follow-up. | Accepted carry-forward |
| Unknown or stale candidate ids can be passed by workers. | Could return wrong context if accepted loosely. | Medium | Require exact candidate id match from the current pack report and return a structured error otherwise. | Mitigated |

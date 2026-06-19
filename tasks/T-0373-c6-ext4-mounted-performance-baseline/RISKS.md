# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Single-sample local timings may vary. | Results should not become brittle CI gates. | Medium | Record as local advisory baseline with command/script details, not as pass/fail thresholds. | Mitigated |
| Ext4 copy differs from mounted workspace. | Source counts and cache state are not perfectly identical. | Medium | Document that the ext4 copy excludes `node_modules`, `.git`, and `.hadara/local`; use relative performance as directional evidence. | Mitigated |
| Raw graph JSON can overwhelm logs. | Measurement evidence becomes hard to inspect. | High | Script suppresses raw stdout and records output byte counts plus parsed summaries. | Mitigated |
| `context cache warm --execute` remains unmeasured. | Warm write performance is still unknown. | Medium | Keep execute writes out of this read-boundary capsule and carry forward to C6 warm-shard implementation. | Open |

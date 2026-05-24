# Context

Post-T-0074 review identified that redaction severity exists in reports, but public artifact rejection still used the boolean compatibility wrapper. That is safe for current high/critical-heavy defaults, but it would make future low/medium heuristics block public evidence unexpectedly.

The same review called out that `findings.count` currently means per-pattern detection count, so overlapping patterns can double-count the same text span. This slice records that behavior rather than implementing span-level deduplication.

Planning docs also still used older future MCP tool names (`hadara.activeRun.read`, `hadara.resume.projection`) and a context export output example that implied MCP might write `.hadara/context/HADARA_CONTEXT.md`. This slice records the intended future names and memory-mode output shape without implementing those tools.

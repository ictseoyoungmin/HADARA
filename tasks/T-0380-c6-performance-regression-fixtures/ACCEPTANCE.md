# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Benchmark script includes default Session Start and include-code Session Start workloads. | Met | `ev:T-0380:4bf9cfb9548c411b9a94cc20` |
| AC-2 | Benchmark script can compare measured workloads against advisory threshold fixtures and optionally fail only with `--fail-on-regression`. | Met | `ev:T-0380:ff1d277e8bbb467e9f9f20af`, `ev:T-0380:4bf9cfb9548c411b9a94cc20` |
| AC-3 | Threshold fixture is registered and documented as local/advisory, not canonical source truth. | Met | `ev:T-0380:ff1d277e8bbb467e9f9f20af` |
| AC-4 | Focused tests, Docker validation, built script smoke, evidence, and handoff/state docs are complete. | Met | `ev:T-0380:ff1d277e8bbb467e9f9f20af`, `ev:T-0380:e9559e47ff9940999f1171cf`, `ev:T-0380:4bf9cfb9548c411b9a94cc20`, `ev:T-0380:2663ca3fd8d84a35b62486b0` |

# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| TD-1 | Keep protocol schema fixtures additive with optional remediation action hash/existence fields. | Accepted | Planned remediation actions carry `expectedBeforeExists`, `expectedBeforeHash`, and `afterHash`, but skipped actions validly omit them; fixture-level schemas should document without over-constraining additive report evolution. | Focused schema/protocol tests passed. |

# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add additive JSON reports instead of rejecting accepted `--json` flags. | Accepted | The CLI already accepted `--json`; structured output is more useful and less surprising. | Focused init/handoff tests passed. |
| D-2 | Keep `handoff update` as a write command and reserve dry-run behavior for `handoff suggest`. | Accepted | Existing behavior writes `docs/AGENT_HANDOFF.md`; changing it to dry-run would be breaking. | CLI JSON contract updated. |
| D-3 | Split lifecycle readiness clarity and performance into T-0274. | Accepted | Those findings touch task workbench/lifecycle behavior and are not first-run scaffold JSON/text issues. | Risks carry-forward rows. |

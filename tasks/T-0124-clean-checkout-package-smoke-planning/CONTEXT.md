# Context

Relevant required-reading sources:

- `docs/PROJECT_STATE.md` records strict release gate readiness as read-only and explicitly says the release gate does not create clean checkouts, run package/install smoke, diff generated artifacts, call GitHub, or execute remote CI.
- `docs/AGENT_HANDOFF.md` recommends clean-checkout/package smoke automation planning as the next capsule after T-0123.
- `docs/DEVELOPMENT_SLICES.md` lists T-0119 release/package track, T-0122 remote CI observation, and T-0123 high-severity debt mitigation as complete prerequisites.
- `docs/V1_0_CAPSULE_BACKLOG.md` keeps MCP release/package execution, broad writes, provider calls, and TUI/dashboard writes out of scope.
- `docs/TEST_STRATEGY.md` is the validation-policy home for Docker validation, remote CI observation, and now the clean-checkout package smoke plan.

Assumptions and constraints:

- Host Node/npm remains unreliable under this WSL sandbox; Docker is the validation path.
- The smoke plan in this capsule is an observation contract, not a release/package executor.
- Release gate checks may inspect docs and repository metadata, but they must remain read-only.

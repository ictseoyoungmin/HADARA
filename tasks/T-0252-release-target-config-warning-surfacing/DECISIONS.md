# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Surface config preview issues as non-blocking warnings, not blockers. | Accepted | User feedback explicitly said release readiness should not be blocked by preview config issues. | `RELEASE_TARGET_CONFIGURATION` check uses status `warning`; readiness remains ready when no error checks exist. |
| D-2 | Preserve exact config issue codes in `diagnostics.advisories`. | Accepted | Top-level issue generation uses check-level codes; diagnostics advisories give operators the precise nested issue code without changing blocker semantics. | Tests assert advisory codes for unsupported primary and invalid JSON. |
| D-3 | Keep schema/parser hardening as future work. | Accepted | Current config parser and TOML parser are preview-only; real config/readiness support needs separate schema/parser work. | `docs/PROJECT_STATE.md` records `hadara.releaseTargetConfig.v1` and formal TOML parser follow-ups. |

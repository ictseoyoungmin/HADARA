# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release target configuration issues produce non-blocking release dry-run warnings. | Done | Warning check `RELEASE_TARGET_CONFIGURATION` increments `readiness.warnings` while `ok` remains true when no blocking checks exist. |
| AC-2 | Exact release target configuration issue codes are visible in diagnostics advisories. | Done | `diagnostics.advisories` preserves `RELEASE_TARGET_PRIMARY_UNSUPPORTED` and `RELEASE_TARGET_CONFIG_INVALID_JSON` with `blocking:false`. |
| AC-3 | Invalid `.hadara/release-targets.json` remains non-blocking and keeps npm as effective primary. | Done | Regression test covers invalid JSON with effective primary `npm-package`. |
| AC-4 | Preview parser boundaries and future schema/TOML hardening notes are documented. | Done | `docs/PROJECT_STATE.md` records `hadara.releaseTargetConfig.v1` follow-up and Python TOML parser preview-only boundary. |
| AC-5 | Tests and evidence are attached, and handoff/state docs are updated. | Done | Evidence added through HADARA CLI; capsule and project handoff/state docs updated. |

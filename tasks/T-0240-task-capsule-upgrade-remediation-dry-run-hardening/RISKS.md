# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Breaking existing execute workflows. | Operators must now copy a hash from dry-run before executing planned upgrade/remediation writes. | Medium | Contract is intentional for dry-run-first safety; no-op/skipped execute paths still do not require a hash, and docs/workbench guidance now explain the hash. | Mitigated |
| Hash drift from harmless output changes. | Execute may refuse if the planned write set changes between dry-run and execute. | Low | Refusal is safer than writing an unreviewed plan; users rerun dry-run and execute with the new hash. | Mitigated |
| Per-action conflict checks become redundant or inconsistent with report hash. | Confusing diagnostics if both levels fail. | Low | Report hash gates reviewed plan; per-action checks still catch apply-time file drift after planning. Tests cover both. | Mitigated |

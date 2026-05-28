# Risks

| Risk | Mitigation |
|---|---|
| Accidentally turning release readiness planning into release/package execution. | Keep this capsule limited to docs, read-only release-gate checks, and tests; do not add package commands or artifact writes. |
| Release gate passes based on vague documentation rather than a concrete smoke sequence. | Require explicit command markers in `docs/TEST_STRATEGY.md` for the clean-checkout package smoke readiness check. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation, following the current handoff and SOP. |
| Future agents confuse remote CI observation with local reproducible validation. | Preserve separate TEST_STRATEGY wording: remote CI is a readiness signal, local Docker validation remains primary evidence. |

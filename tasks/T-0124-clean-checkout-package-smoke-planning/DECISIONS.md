# Decisions

- Keep the clean-checkout package smoke scope in `docs/TEST_STRATEGY.md` because it is validation procedure, not product state or release execution.
- Strengthen `CLEAN_CHECKOUT_SMOKE_UNCLEAR` by requiring explicit smoke-plan markers from `docs/TEST_STRATEGY.md` in addition to existing v1.0/schema and development-slice references.
- Do not add a `hadara release smoke` command in this capsule. Executable package smoke needs a later capsule with explicit artifact, audit, redaction, and permission boundaries.

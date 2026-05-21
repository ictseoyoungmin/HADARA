# Risks

| Risk | Mitigation |
|---|---|
| JSON shape churns as doctor gains more checks. | Version the report as `hadara.doctor.v1` and keep fields additive. |
| Doctor leaks absolute machine-local paths. | Doctor paths are environment diagnostics; do not include secrets, logs, or raw local state content. |
| Scope grows into full environment probing. | Limit this slice to existing bootstrap checks. |


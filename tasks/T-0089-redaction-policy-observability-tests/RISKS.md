# Risks

| Risk | Mitigation |
|---|---|
| Observability metadata could leak raw secret material. | Keep policy reports to redaction metadata and byte counts only; tests assert user-facing evidence collect output excludes report details and secret values. |
| Medium diagnostic patterns could unexpectedly block public evidence. | Keep the artifact policy threshold at `high` and test a medium finding through the full public artifact collection path. |
| Test-only injection could alter production defaults. | Make injected patterns optional and leave default registry behavior unchanged. |

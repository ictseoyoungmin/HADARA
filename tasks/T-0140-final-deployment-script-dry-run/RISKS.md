# Risks

| Risk | Mitigation |
|---|---|
| Existing historical evidence records may not have linked artifacts or git commit metadata. | `release dry-run` blocks missing linked artifacts and only checks git commit freshness when public artifacts provide git metadata. |
| Dry-run could be mistaken for publish readiness or execution. | Report privacy/planned-step fields explicitly keep publish, GitHub Release, Docker image build, token values, and release mutation false. |
| Release artifact report evidence might leak raw logs or private paths. | The artifact helper attaches the already reduced `hadara.releaseArtifact.v1` report and runs public artifact redaction policy before writing. |

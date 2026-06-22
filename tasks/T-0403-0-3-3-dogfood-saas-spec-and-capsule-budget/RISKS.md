# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Dogfood scope becomes open-ended ML research. | High | Medium | First line is user-assisted procedural material extraction with deterministic CPU defaults; universal segmentation and 3D reconstruction are out of scope. | Mitigated |
| Fifteen capsules hide production hardening or HADARA audit work. | Medium | High | Spec allocates 22 capsules and separates MVP, hardening, dogfood audits, findings, and stable-release decision input. | Mitigated |
| Docker Compose default requires GPU or external model downloads. | High | Low | Default architecture uses local CPU image processing; optional ML is deferred behind a later profile. | Mitigated |
| Public evidence accidentally includes raw uploaded images or private paths. | High | Medium | Spec requires reduced metadata evidence, no raw image artifacts, and generated/synthetic fixtures for public proof. | Mitigated |
| PatternForge dogfood findings are conflated with HADARA release blockers. | Medium | Medium | Spec defines explicit stable 0.3.3 release-blocking criteria and treats product-only shortcomings as dogfood findings. | Mitigated |

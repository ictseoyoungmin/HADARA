# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Thresholds become false CI blockers on mounted workspaces. | Operators lose trust in performance checks. | Medium | Keep comparison advisory by default and require explicit `--fail-on-regression`. | Mitigated |
| Unit tests become slow by running real context commands. | Development loop degrades. | Low | Test script behavior with a fake CLI fixture. | Mitigated |
| Threshold fixture drifts from workload labels. | Regression check misses intended budgets. | Medium | Add script test for new Session Start workloads and document fixture usage. | Mitigated |

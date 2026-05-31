# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Lint duplicates harness evidence validation. | Divergent issue codes could confuse agents. | Medium | Keep lint focused and surface stable codes through protocol doctor; do not remove harness validation. | Mitigated |
| Count-drift rough checks may warn on intentional summary differences. | False-positive warning noise. | Low | Treat Markdown/JSONL count drift as warning only. | Mitigated |
| New schema mistaken for strict release gate. | Consumers could block on additive fixture fields. | Low | Document fixture-level posture in schema docs. | Mitigated |

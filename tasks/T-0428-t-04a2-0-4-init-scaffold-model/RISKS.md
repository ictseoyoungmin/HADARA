# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Existing init tests encode legacy SOP/task-workflow defaults. | Focused tests fail until expectations are updated. | High | Replaced focused init expectations with the accepted 0.4 file set and doctor checks. | Mitigated |
| Removing default docs could break helper paths that assume SOP exists. | Init doctor or register-doc tests may fail. | Medium | Limited T-04A2 validation to init generation/doctor; register-doc redesign remains T-04A4. | Accepted |
| Template content work could expand beyond the slice. | Slower progress and duplicate T-04A3 work. | Medium | Kept generated prose minimal and deferred detailed template polish to T-04A3. | Mitigated |

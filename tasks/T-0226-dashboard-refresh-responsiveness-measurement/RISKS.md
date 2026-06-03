# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Direct route-handler measurement omits HTTP/socket overhead. | Numbers differ from `curl` against `dashboard serve`. | Medium | Document this clearly; use it to isolate route/event-loop behavior and keep manual curl as a complementary check. | Open |
| Refresh can finish before many core samples are captured on small projects. | p95 may be based on few samples. | Medium | Report `sampleCount` and task progress sample count so operators can judge confidence. | Open |
| `/tmp` comparison copies only `docs/` and `tasks/`. | It does not measure full repository checkout/build cost. | Low | Document that the comparison isolates dashboard project-data read costs. | Open |
| Slow-stage threshold can be noisy on loaded hosts. | Warnings may be advisory rather than failures. | Medium | Keep warnings in metadata and do not fail routine validation on warning presence. | Open |

# Risks

| Risk | Mitigation |
|---|---|
| Fake command output could contain secret-like content. | Reuse the public evidence artifact scanner before writing managed artifacts. |
| Evidence attachment could make no-tool runs noisy. | Attach only when fake-shell observation steps exist. |
| CLI run output could become unstable. | Add stable metadata shape and focused tests. |

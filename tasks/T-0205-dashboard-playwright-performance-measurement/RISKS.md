# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docker `/tmp` copy is faster than bind-mounted Windows workspace. | Report may understate local bind-mount latency. | Medium | Report explicitly states final numbers are from `/tmp` copy and direct bind-mount run was unsuitable. | Accepted |
| Node fetch timings are not browser paint timings. | User-perceived paint can differ. | Medium | Report labels shell load as HTML fetch and keeps values advisory. | Accepted |

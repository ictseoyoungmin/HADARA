# Risks

| Risk | Mitigation |
|---|---|
| Target decision is mistaken for approval to publish. | Explicitly state no publish/deploy, no GitHub Release creation, no Docker build, and no registry mutation in docs and release-gate summary. |
| Secret names lead to secret values being committed. | Document token names only and state values must stay in CI/provider secret storage. |
| T-0140 dry-run relies on weak T-0138 evidence checks. | Carry forward freshness, artifact schema cross-check, and release-artifact evidence flow as explicit prerequisites. |
| Docker target is prematurely included. | Mark Docker image publishing deferred unless product/server runtime scope changes. |

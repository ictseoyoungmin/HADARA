# Context

- T-0139 documented npm as the primary release target, GitHub Release as secondary, Docker publishing as deferred, and T-0140 evidence hardening requirements.
- Existing release gate evidence checks were intentionally weak enough to read records and optional smoke summaries; T-0140 strengthens the final dry-run path before publish/deploy scripts.
- Release dry-run must remain read-only: no publish, GitHub Release creation, Docker image build, token loading, package/install smoke execution, provider calls, MCP execution surface, or release mutation.
- Release artifact public evidence now has an explicit path: `hadara release artifact --execute --json --output dist-release --attach-evidence --task <task-id>`.

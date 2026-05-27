# Context

- `docs/AGENT_HANDOFF.md` records that post-T-0112 production TUI startup/full/detail paths measured around 18-24s in `hadara-cli-test`.
- The mockup felt faster because it used fixture/state-cache reads, async render timers, parallel CLI reads, partial fast refresh, and selected-detail-only refresh.
- Measured bottlenecks were the full TUI aggregate, especially operations status, operational debt, and release-gate reads.
- TUI cache writes could fail when a task directory existed without `TASK.md`, preventing fast cache hits.
- This capsule keeps the TUI read-only and focuses on a small production fast path rather than a broad runtime redesign.

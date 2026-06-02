# Plan

| Step | Status | Evidence |
|---|---|---|
| Normalize timeline events defensively in the data layer. | Done | model.ts normalizeTimeline. |
| Render the ActivityFeed (severity glyphs, relative time, evidence/task meta). | Done | ui.tsx ActivityFeed. |
| Design the empty-feed state. | Done | ActivityFeed EmptyState branch. |
| Verify the feed renders events and passes a11y. | Done | Visual gate: 5 events; axe pass. |

## Post-Review Fix Pass (2026-06-02)

| Finding | Fix | Evidence |
|---|---|---|
| F-5 offline empty states misleading | `ActivityFeed` (and recent/handoff lists) take an `offline` flag and show "Unavailable offline" instead of "No activity yet" when the source is fixture/inline. | Offline-source flag wired from `isLiveSource`; visual gate offline state. |

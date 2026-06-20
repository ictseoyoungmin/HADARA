# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and previous release readiness capsule pattern. | Done | T-0336 capsule, release readiness docs, command help |
| 2 | Bump source metadata/docs to `0.3.3-rc.0`. | Done | package metadata, README, release notes, release readiness, README assertion test update |
| 3 | Run release readiness validation matrix. | Done | Docker sync-build, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and diff check passed |
| 4 | Attach release/readiness evidence. | Done | ev:T-0401:1046d97d72a54ca6bd9dabf3, ev:T-0401:125c51d2304a4d689c957bab, ev:T-0401:698672f04c9e4ba394e616c2, ev:T-0401:211f174377cf41eaba9f707b, ev:T-0401:34875afe7c1c4a6c802a0a0d, ev:T-0401:9bffce41eea94e728636609a, ev:T-0401:3c4a72ff0ac3434ab3faabcc |
| 5 | Update shared state and handoff before finalize. | Done | Task Board, Project State, Development Slices, Agent Handoff |

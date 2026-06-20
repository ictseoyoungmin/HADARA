# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara@0.3.3-rc.0` source metadata and package-facing docs are aligned. | Met | Package metadata/lockfile, README, release notes, release readiness, and README assertions target `0.3.3-rc.0`. |
| AC-2 | Release readiness validation matrix passes without release mutation. | Met | ev:T-0401:1046d97d72a54ca6bd9dabf3, ev:T-0401:125c51d2304a4d689c957bab, ev:T-0401:698672f04c9e4ba394e616c2, ev:T-0401:211f174377cf41eaba9f707b |
| AC-3 | Publish readiness remains dry-run-only in this capsule, and failed sandbox environment evidence is resolved. | Met | ev:T-0401:34875afe7c1c4a6c802a0a0d, ev:T-0401:9bffce41eea94e728636609a, ev:T-0401:3c4a72ff0ac3434ab3faabcc |
| AC-4 | Handoff and shared state route next work to an approval-gated publish decision. | Met | Task handoff and shared handoff updated for `0.3.3-rc.0` readiness and next approval-gated publish decision. |

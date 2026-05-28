# Acceptance Criteria

- [x] `hadara package smoke --execute --json` performs explicit local package smoke with `npm pack`, isolated prefix install, installed `hadara doctor --json`, installed core feature smoke, timeout handling, and cleanup.
- [x] `hadara package smoke --dry-run --json` and flag omission remain default-safe and do not execute package/install/subprocess behavior.
- [x] Local success and failure reports are reduced, schema-valid, and do not include raw npm logs, raw package contents, environment secrets, private absolute paths, private store paths, publish markers, or release mutation markers.
- [x] Public evidence attachment remains deferred to T-0136 and is not performed by default.
- [x] Focused and full Docker validation are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.

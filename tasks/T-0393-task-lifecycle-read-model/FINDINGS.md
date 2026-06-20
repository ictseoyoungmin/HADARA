# Findings

| ID | Finding | Impact | Suggested Follow-up |
|---|---|---|---|
| F-1 | `task lifecycle` is correct but not cheap on the mounted workspace because it composes finish, ready, close, and audit-close reports. | Agents get a single next action, but the first implementation can still take tens of seconds on `/mnt/f`. | After T-0394/T-0395, consider a lighter phase read path that reuses close/audit computations or avoids repeated done-level scans when source hashes are unchanged. |
| F-2 | T-0393 includes basic `repair` metadata, but stale/invalid fixture coverage belongs in the dedicated repair command. | Consumers should not rely on full close repair taxonomy until T-0394. | Implement `task close-repair-plan` with explicit stale, invalid, not-closed, duplicate, and valid fixtures. |
| F-3 | Evidence append should remain serialized. | Parallel append happened during this capsule and was verified by `evidence list`, but the workflow should stay serialized to avoid relying on lock behavior unnecessarily. | Prefer one evidence append at a time in future capsules unless testing append concurrency directly. |

# Close Plan Stale-Hash Resolution

The stale reviewed hash caused no writes and did not alter capsule state. The task workflow explicitly defines `task close --json` as the ordinary guarded close transaction: it reviews the current plan internally, rechecks the plan before writing, performs bounded guarded writes, appends proof last, and succeeds only at `closed-valid`.

The user authorized T-0790 close after factual verification. The resolution is therefore to discard the stale external plan hash and execute the standard internally reviewed close path against current source. No bypass, manual status edit, or unchecked write is used.

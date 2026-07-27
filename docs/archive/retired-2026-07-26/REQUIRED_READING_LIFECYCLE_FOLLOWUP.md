# Required Reading Lifecycle Follow-up

## Phenomenon

`docs/IMPLEMENTATION_SOP.md` can register project-specific specs as Required Reading, but the current docs do not define a clear lifecycle for removing or downgrading those links after the implementation they guided is complete.

The existing Required Reading tiers already distinguish `current-state`, `task-work`, `conditional-reference`, `historical`, and `excluded`. The gap is operational: completed implementation specs can remain in active routing tables long after they stop being required for normal work. That makes old phase specs feel like default reading, increases session startup cost, and blurs the difference between live contracts and historical implementation context.

## Current Decision

Do not refactor this now.

For the current `0.3.2` sequence, keep the planned work order intact and do not create a detour before the next Evidence v2 task. This note records the issue so it can be handled deliberately in a later documentation-routing phase.

## Future Refactor Goal

A later phase should define a lifecycle for registered docs and specs:

- `active`: required for current work or current authoritative contracts.
- `conditional-reference`: read only when the active task touches the relevant surface.
- `historical`: completed implementation context, read only for regressions or archaeology.
- `superseded`: replaced by a newer contract or phase plan.
- `archived` or `excluded`: retained but not routed by default.

That phase should add a small "Completed Spec Routing" rule to `docs/IMPLEMENTATION_SOP.md` and move completed implementation specs out of active Required Reading rows when they are no longer needed for new work. Completed specs should remain discoverable through `docs/DEVELOPMENT_SLICES.md`, `docs/AGENT_HANDOFF.md` historical routing, a docs registry, or a dedicated completed-spec index.

## Non-goals For Now

- Do not delete completed specs just to shorten the SOP.
- Do not change `0.3.2` task numbering or the next Evidence v2 work sequence.
- Do not demote live contract docs such as CLI/MCP/security/test strategy documents.
- Do not perform broad docs-registry migration as part of the current work item.

## Future Phase Candidate

Suggested phase title: `Required Reading Lifecycle and Completed Spec Routing`.

Acceptance candidates:

- Active Required Reading contains only current-state docs, active phase specs, and live contracts.
- Completed implementation specs are routed as historical/reference material.
- The transition rule from active to historical/reference is explicit.
- Registry or index state, if present, agrees with the SOP routing.
- Validation catches broken Required Reading paths after routing changes.

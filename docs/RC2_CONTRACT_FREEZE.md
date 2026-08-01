# RC2 Contract Freeze

## Identity

| Field | Value |
|---|---|
| Release | `0.5.0-rc.2` |
| State | Candidate; pending T-0744 close evidence |
| Owner | T-0744 |
| Scope | Init v1 stages 6~8 acceptance and RC2 readiness |

## Freeze Boundary

The RC2 source candidate includes the completed T-0743 status/close reduction and the T-0744
release/document acceptance work. The ordinary HADARA lifecycle remains task-local:
`task status` -> validation/evidence -> reviewed `task close`.

The following are explicitly outside this freeze:

- New close transaction behavior beyond T-0743.
- New public schemas or schema runtime changes.
- Provider, MCP write, npm publish, GitHub Release, Docker publish, or registry mutation.
- Reintroduction of `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, `.hadara/state/current.json`, or any
  other retired global-state authority in active projections.
- Broad DAG/status redesign or unrelated roadmap expansion.

## Required Gate

The state can be changed to `Frozen` only after T-0744 records current-head evidence for source and
built CLI checks, docs registry parse/schema/render, package/consumer and clean-checkout smokes,
strict release gate, release dry-run, and installed Init v1 lifecycle/routing acceptance. Publish,
remote CI, and external release operations remain separate operator-controlled work.

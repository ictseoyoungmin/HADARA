# RC2 Contract Freeze

## Identity

| Field | Value |
|---|---|
| Release | `0.5.0-rc.2` |
| State | Frozen |
| Owner | T-0745 |
| Scope | Init v1 stages 6~8 acceptance and RC2 readiness |

## Freeze Boundary

The RC2 source candidate includes the completed T-0743 status/close reduction, the T-0744
release/document acceptance work, and the bounded T-0745 post-freeze integrity correction. The
ordinary HADARA lifecycle remains task-local:
`task status` -> validation/evidence -> reviewed `task close`.

The following are explicitly outside this freeze:

- New close transaction behavior beyond T-0743.
- New public schemas or schema runtime changes.
- Provider, MCP write, npm publish, GitHub Release, Docker publish, or registry mutation.
- Reintroduction of `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, `.hadara/state/current.json`, or any
  other retired global-state authority in active projections.
- Broad DAG/status redesign or unrelated roadmap expansion.

## Required Gate

T-0745 reran source and built CLI checks, package/consumer and clean-checkout smokes, strict release
gate, release dry-run, and the complete installed lifecycle. The contract is now `Frozen` locally;
publish, remote CI, and external release operations remain separate operator-controlled work.

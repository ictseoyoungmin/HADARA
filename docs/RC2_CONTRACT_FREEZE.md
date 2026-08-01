# RC2 Contract Freeze

## Identity

| Field | Value |
|---|---|
| Release | `0.5.0-rc.2` |
| State | Frozen |
| Owner | T-0747 |
| Scope | Init v1 stages 6~8 acceptance and RC2 readiness |

## Freeze Boundary

The RC2 source candidate includes the completed T-0743 status/close reduction, the T-0744
release/document acceptance work, the bounded T-0745 post-freeze integrity correction, and the
T-0746 close-contract/evidence reproducibility correction. T-0747 reopened the freeze boundary
to reconcile those shipped changes, then re-froze the current head only after the release artifact,
clean-checkout, strict gate, release dry-run, and installed lifecycle gates passed. The ordinary
HADARA lifecycle remains task-local:
`task status` -> validation/evidence -> reviewed `task close`.

The following are explicitly outside this freeze after the T-0747 re-freeze:

- Further close transaction behavior beyond the bounded T-0746 correction.
- Further public schemas or schema runtime changes beyond the reviewed T-0746 contract.
- Provider, MCP write, npm publish, GitHub Release, Docker publish, or registry mutation.
- Reintroduction of `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, `.hadara/state/current.json`, or any
  other retired global-state authority in active projections.
- Broad DAG/status redesign or unrelated roadmap expansion.

## Required Gate

T-0747 reran the current-head source/build checks, generated a release artifact with checksum and
manifest, ran package/consumer and clean-checkout smokes, strict release gate, release dry-run,
and the complete installed lifecycle. The contract is now `Frozen` locally under T-0747;
publication, remote CI, and external release operations remain separate operator-controlled work.

## Freeze History

| Transition | Capsule | Meaning |
|---|---|---|
| Initial freeze | T-0745 | RC2 was frozen after the first post-freeze integrity correction. |
| Reopened | T-0747 | T-0746 was found to include public schema, document, and close-read changes outside the prior recorded boundary. |
| Re-frozen | T-0747 | Current-head artifact, manifest/checksum, package, clean-checkout, strict gate, release dry-run, and installed lifecycle all passed. |

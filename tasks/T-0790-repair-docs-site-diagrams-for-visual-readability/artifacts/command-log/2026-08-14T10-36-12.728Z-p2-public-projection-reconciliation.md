# P2 public projection reconciliation

## Scope

This report covers only P2-1 through P2-4 from the current-build Init and Task Capsule document audit. P2-5 and P2-6 require generated-workflow or canonical metadata changes and remain outside this docs-site reconciliation.

## Reconciled contracts

| Finding | Public contract now stated |
|---|---|
| P2-1 READ_MAP boundary | Generated `.hadara/context/READ_MAP.md` has only `Document`, `Read Policy`, and `Status`; rich tiers, authority/edit policy, selected-task injection, and read groups come from `hadara docs read-map --task T-XXXX --json`. |
| P2-2 evidence density | A `validation run` projection can retain command preview, argv hash, exit/signal/duration, and stdout/stderr hashes in one Summary cell. The website example is representative but shortens hash values. |
| P2-3 Task Board lineage | `Targets` originates at task creation and is preserved. `Result` starts as `-` and is projected during close from the current `TASK.md` `Close Summary`; Close Summary is now included in the documented TASK anatomy. |
| P2-4 HANDOFF relationship | Only `actionable/yes` authorizes a new capsule. `waiting-for-operator`, `blocked`, `unresolved`, and `terminal` use `no`; continuation to an existing capsule uses `waiting-for-operator/no`. Pre-close must be `terminal/no` before Done close. |

## Validation

| Check | Result |
|---|---|
| `npm test` in `docs/site` | Passed: content contract includes explicit P2-1 through P2-4 regression assertions. |
| `npm run build` in `docs/site` | Passed: TypeScript and Vite production build completed. |
| Headless Edge, 1920px desktop | Project Protocol Files, Evidence & Projections, and Task Capsules rendered in full-height captures without observed table overflow or Markdown hierarchy failure. |
| User visual gate | Still pending. Agent headless inspection does not satisfy T-0790 AC-4. |


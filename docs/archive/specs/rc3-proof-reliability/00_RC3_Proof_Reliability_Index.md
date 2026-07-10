# HADARA rc3 Proof Reliability Plan

## Basis

This planning set is based on the `0.2.0-rc.2` comparative dogfooding result captured in:

- `docs/specs/temp_plan/HADARA_dogfooding_plan_0_2_0_rc1/FINDINGS_COMPARATIVE.md`
- `docs/specs/temp_plan/HADARA_dogfooding_plan_0_2_0_rc1/DECISION_GATE_RERANK.md`
- `docs/specs/temp_plan/HADARA_dogfooding_plan_0_2_0_rc1/_eval/w/bookmark-manager`
- `docs/specs/temp_plan/HADARA_dogfooding_plan_0_2_0_rc1/_eval/wo/bookmark-manager`

The dogfooding outcome reframed the near-term roadmap:

```text
HADARA did not produce better code in the Bookmark API comparison.
HADARA produced auditable, evidence-backed, honestly handed-off work.
```

## Reviewer Priority

| Priority | Work | Reason |
|---|---|---|
| P0 | Evidence writer idempotency and concurrency hardening | Proof surfaces are only trustworthy if evidence writes are race-safe and report the record they actually wrote. |
| P1 | Proof status / explain / freshness MVP | The strongest dogfooding signal was proof, known-problem, and runtime-conformance visibility. |
| P2 | CI gate MVP | Proof gains product leverage when it can be enforced outside an interactive session. |
| P3 | rc3 release readiness and installed-package recycle | rc3 should package the trust/readiness improvements and verify them from an installed package. |
| P4 | `session start` measurement | Resume-cost was not measured from transcripts, so session bootstrap remains held pending a transcript round. |

## Implementation Capsules

Actual task ids may differ from the reviewer note because this repository already completed T-0282.

| Order | Capsule Theme | Deliverable |
|---:|---|---|
| 1 | Planning | This spec folder and task sequence. |
| 2 | Evidence append hardening | Idempotent, task-scoped, lock-guarded evidence appends. |
| 3 | Proof MVP | `hadara proof status/explain --task <id> --json` read models. |
| 4 | CI gate MVP | `hadara ci gate --mode advisory\|strict --json` wrapper over protocol/evidence/proof checks. |
| 5 | rc3 readiness | Release metadata/evidence refresh and disposable installed-package recycle preparation. |

## Non-Goals for rc3

- `hadara session start`
- Project graph/projection generalization
- Mutation Plan Engine public or internal migration
- Protocol version migration
- Multi-agent coordination report
- Release target provider expansion
- Publish/deploy automation

## Release Framing

```text
0.2.0-rc.3 focuses on proof reliability after comparative dogfooding.

The release hardens evidence writes under repeated/parallel agent activity,
adds initial proof status/explain surfaces, and introduces a minimal CI gate
so HADARA's observed value - auditable, evidence-backed continuity - can be
checked outside a single interactive session.
```

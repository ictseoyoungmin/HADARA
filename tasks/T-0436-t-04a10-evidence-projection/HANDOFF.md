# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-04A10 made `EVIDENCE.md` a generated projection from canonical `evidence.jsonl`, added `evidence project`, updated projection-aware validation, and passed focused validation. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open T-04A11 Close Proof Placement. | Evidence projection is deterministic; the next accepted slice keeps close proof out of `TASK.md`/`HANDOFF.md` and routes it through evidence surfaces. | docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md; docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Close readiness snapshot is still not implemented. | Projection is deterministic, but close records do not yet carry the normalized readiness snapshot described in the spec. | Keep T-04A12 responsible for `hadara.evidence.readinessSnapshot.v1` / close-source contract work. |

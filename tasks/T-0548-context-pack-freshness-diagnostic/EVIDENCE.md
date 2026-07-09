# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0548:d32094ea16a5424891611b6d | passed | validation | Diagnosed context pack no-task path: broad degraded scan took about 99s before returning CONTEXT_PACK_TASK_NOT_FOUND; follow-up CP-1 records fail-fast guidance. |
| ev:T-0548:bf4ef3ba3d184736bc9aea71 | passed | validation | Diagnosed task-scoped context pack for T-0548: live pack completed but was degraded with stale extractor shards, cache miss, codeIndexAvailable=false, and budget truncation. |
| ev:T-0548:53f7e42d877e43e29fd8a236 | passed | validation | Diagnosed context graph freshness: full graph completed but was degraded, reported historical missing evidence.jsonl warnings, 1499 sources read, and zero code graph nodes. |
| ev:T-0548:fd8fa39a8d8f4a9bb6c46936 | passed | validation | Diagnosed bounded session path: session start for T-0548 returned a usable no-live context-pack envelope, read-map counts, and selected-task guidance without the 50s live graph scan. |
| ev:T-0548:880b0f2e37ba4337952d9bb8 | passed | validation | Task finalize done-level readiness for T-0548 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:43a68fe671daffaedfa06eabecffea78381c5c4fdf52d3dd1362b30ce43185e5 |
| ev:T-0548:d5cc37c878fe40dca6743def | passed | validation | Task finalize done-level readiness for T-0548 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:7b98905586e2793d6a419383e5fe232c0be9b545ff41079e98d511dc1db591e6 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0548:5b52cd4708e4452c9572b388 |
| close evidence | passed | ev:T-0548:1d62076894a94099ab2ff027 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->

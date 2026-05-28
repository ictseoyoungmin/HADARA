# Decisions

Record task-local design decisions here.

- Treat `evidence.jsonl` as the primary release-gate evidence index because public summary artifacts may not be committed in every checkout.
- Validate reduced public summary artifacts with registered schemas only when an `evidencePath` exists and the artifact file is present.
- Do not block strict mode on install-matrix evidence in T-0138 because install-matrix smoke execution is still future work; reserve the evidence code and summary instead.

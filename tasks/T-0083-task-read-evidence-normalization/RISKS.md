# Risks

| Risk | Mitigation |
|---|---|
| Consumers expecting raw `files["evidence.jsonl"]` may see normalized content. | Keep the field present and valid JSONL, and record the behavior as read-model sanitization. |
| Warning issues could be mistaken for task read failure. | Preserve `ok: true` when only warning issues are present, matching evidence-list behavior. |
| Normalization could diverge again later. | Reuse the exported evidence-list parser instead of duplicating JSONL parsing logic. |

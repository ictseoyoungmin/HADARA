# Decisions

- Normalize both `evidenceIndex` and `files["evidence.jsonl"]`; otherwise the raw file payload would continue to expose private paths or unredacted summaries.
- Keep Markdown Task Capsule files unchanged in `task.read`.
- Reuse evidence-list warning semantics so malformed and mismatched records degrade the read model without making the whole `task.read` report fail.

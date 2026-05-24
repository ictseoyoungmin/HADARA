# Decisions

- Operations Status JSON uses a safe active run projection so local mutable state cannot break the whole status report.
- Valid evidence means parseable `hadara.evidence.v1` records, not merely non-empty JSONL lines.
- Shared Markdown section extraction now requires exact heading-line matches.

# Context

`src/core/redaction.ts` previously used a plain regex array with one replacement shape. That protected existing evidence paths but made it hard to report pattern ids, severities, counts, or safely support patterns without capture groups. The v1.0 backlog calls for a registry/report model before evidence read surfaces and release gates grow.

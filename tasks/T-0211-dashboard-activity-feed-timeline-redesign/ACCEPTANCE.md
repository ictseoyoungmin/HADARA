# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Timeline renders as severity-colored, relative-time activity items. | Done | Visual gate activity feed renders events; home capture. |
| AC-2 | Semantic evidence identity is surfaced when available; display id is fallback only. | Done | normalizeTimeline + feed-meta render of evidenceId. |
| AC-3 | No private raw paths are exposed; read-only. | Done | Consumes timeline read model only; private path suppression preserved. |

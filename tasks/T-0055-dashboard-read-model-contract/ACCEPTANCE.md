# Acceptance Criteria

- [x] Operations Status JSON includes `health: "ok" | "degraded" | "error"`.
- [x] Warning-only reports use `health: "degraded"` while preserving `ok: true`.
- [x] `rawStatusCounts` preserves original Task Capsule status labels.
- [x] `normalizedStatusCounts` preserves normalized status names.
- [x] Dashboard read model contract maps cards/panels to status JSON field paths.
- [x] Empty/degraded state behavior and color/status semantics are documented.
- [x] A sample `hadara.ops.status.v1` fixture exists.
- [x] No dashboard UI is implemented.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.

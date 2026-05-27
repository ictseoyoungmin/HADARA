# Decisions

| Decision | Rationale |
|---|---|
| Fix input decoding instead of changing state reducer behavior. | The state reducer already handles `up`/`down` for Tasks and Detail panels; the gap is terminal escape decoding for additional arrow sequence variants. |
| Preserve ANSI while fitting colored text. | Narrow terminal clipping should keep colorized labels/read-model content colored while still preserving exact visible width. |

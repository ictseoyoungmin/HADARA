# Decisions

- Keep the existing audit JSONL compatibility fields (`time`, `actor`, `event_type`, `task_id`, `risk`, `summary`, `payload`) so prior audit tests and tools continue to work.
- Add a nested `event` field using `hadara.event.v1` rather than renaming the existing audit fields in place.
- Use `actor: "cli" | "mcp" | "system" | "agent" | "user"` in the structured event model, while preserving the older audit actor enum for compatibility.
- Register `hadara.event.v1` as a schema fixture, not a broad release gate.

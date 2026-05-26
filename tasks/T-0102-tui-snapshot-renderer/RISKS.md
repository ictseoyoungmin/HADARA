# Risks

| Risk | Mitigation |
|---|---|
| Snapshot output becomes mistaken for a stable public schema. | Keep schema id marked internal and do not register it in `src/schemas/schema-index.json`. |
| Renderer starts doing aggregation or mutation. | Accept only a `TuiReadModel` input and test project files before/after rendering. |
| Narrow terminals produce ragged lines. | Clip and pad every rendered line to fixed width and height. |

# Decisions

- This capsule is schema planning plus fixtures, not runtime enforcement.
- Use schema ids matching JSON `schemaVersion` values, with file names under `src/schemas/`.
- Keep first schemas permissive on additive fields to avoid freezing extension points too early.
- Start with read models already stabilized in recent capsules: evidence list, context export, and tools list.
- Add a schema index fixture so future runtime loading can have an explicit registry source.

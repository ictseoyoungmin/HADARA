# Decisions

- Default snapshot policy remains mockup-oriented and clamps to 78x24.
- Compact terminal output is opt-in via `widthPolicy: 'compact'`, with a 40x10 minimum.
- `generatedAt` is hidden by default from snapshot text to keep repeated renders byte-stable; callers can opt in with `includeGeneratedAt: true`.
- Markdown wrapping/table sizing uses terminal visible width, including wide Korean characters, instead of raw string length.
- The TUI remains internal and read-only; no CLI/runtime/cache/execution behavior is added.

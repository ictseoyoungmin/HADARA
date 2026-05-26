# Risks

| Risk | Mitigation |
|---|---|
| Hiding `generatedAt` could remove useful diagnostics. | Add explicit `includeGeneratedAt: true` opt-in for callers that need it. |
| Compact mode could drift from the visual mockup. | Keep default policy as `mockup` and require explicit `widthPolicy: 'compact'` for smaller outputs. |
| Wide-character handling can be subtle across terminals. | Use shared `visibleWidth()` checks and Korean regression tests for Markdown and snapshots. |

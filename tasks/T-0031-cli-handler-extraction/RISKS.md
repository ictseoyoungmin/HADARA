# Risks

| Risk | Mitigation |
|---|---|
| Moving code could alter CLI output. | Preserve existing functions and focused tests. |
| Extraction could hide dispatcher behavior. | Keep `main.ts` as dispatcher and move only self-contained helpers. |

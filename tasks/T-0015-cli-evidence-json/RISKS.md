# Risks

| Risk | Mitigation |
|---|---|
| Private path leaks through JSON output. | Reuse Evidence Store private visibility semantics and assert path suppression in tests. |
| Scope expands into artifact storage. | Keep this slice to JSON reporting only and defer copying artifacts. |
| Missing task errors become generic CLI failures. | Return a versioned error envelope and exit code `6`. |


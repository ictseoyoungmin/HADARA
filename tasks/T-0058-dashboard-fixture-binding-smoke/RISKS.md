# Risks

| Risk | Mitigation |
|---|---|
| Static tests may miss real browser layout issues. | Keep this capsule focused on fixture binding and defer screenshot review. |
| Derived fields may be mistaken for missing fixture paths. | Explicitly enumerate supported derived suffixes such as `.length` and approval guard labels. |

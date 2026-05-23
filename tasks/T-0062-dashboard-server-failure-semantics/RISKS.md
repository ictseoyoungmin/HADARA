# Risks

| Risk | Mitigation |
|---|---|
| Users may expect production-grade server behavior. | Keep scope explicit: this remains a static sample-backed helper. |
| Missing files could hide packaging mistakes. | Return 404 predictably and keep tests checking allowlisted files in the repository. |

# Risks

| Risk | Mitigation |
|---|---|
| Task JSON shape grows before task schema is mature. | Use a minimal versioned read model and keep fields additive. |
| Absolute paths leak into JSON. | Use project-relative portable capsule paths. |
| Missing task errors behave like generic CLI errors. | Return a JSON envelope and exit code `6` for `task show --json`. |


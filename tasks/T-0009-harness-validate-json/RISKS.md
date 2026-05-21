# Risks

| Risk | Mitigation |
|---|---|
| JSON output contract churns too early. | Use a small versioned envelope and avoid over-specifying future replay data. |
| Validator becomes too strict for existing capsules. | Validate only required files and basic evidence/index shape in this slice. |
| Private or machine-local data leaks into evidence. | Record summaries only and avoid raw logs or absolute local paths. |


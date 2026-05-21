# Risks

| Risk | Mitigation |
|---|---|
| Private evidence path leaks through copied artifacts. | Copy public artifacts only and test private suppression. |
| Managed artifact filenames are unstable across platforms. | Sanitize timestamp and basename for portable paths. |
| Evidence copy escapes the project boundary. | Resolve paths through project root and copy into the Task Capsule only. |


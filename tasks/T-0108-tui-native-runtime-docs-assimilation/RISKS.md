# Risks

| Risk | Mitigation |
|---|---|
| The detailed TUI design could be summarized and lose implementation requirements. | Import the source spec content unabridged into `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` and validate the body matches exactly. |
| Backlog docs could drift from the unabridged reference. | Keep backlog rows concrete but point to the unabridged implementation schema section as the authoritative planning detail. |
| TUI cache schema notes could imply an implemented public schema. | Mark `hadara.tui.cache.v1` as a future draft posture only, with no fixture or runtime validation in this capsule. |
| Documentation-only changes could accidentally imply new runtime behavior. | Explicitly keep cache, theme, mouse, adapter, and performance work as future capsules. |

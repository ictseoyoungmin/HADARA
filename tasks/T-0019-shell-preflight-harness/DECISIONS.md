# Decisions

- Keep the fake shell harness in `src/tools` because it models future Tool Runtime behavior.
- Do not use `child_process` in this slice.
- Treat approval-required commands as blocked observations in this harness until an explicit approval flow exists.

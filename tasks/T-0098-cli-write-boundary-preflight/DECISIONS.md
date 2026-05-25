# Decisions

- Use a dedicated read-only `hadara write preflight <command...> --json` surface instead of adding `--preflight` branches to each write command. This keeps the slice isolated and avoids changing existing write behavior.
- Keep `writes` as project-relative string paths to match the roadmap seed schema and make reports easy for external agents to consume.
- For timestamped/generated files, use placeholder path segments such as `<timestamp>` and `<evidence-id>` because preflight must not allocate ids or write files.
- For deferred run-state and debt writes, report the intended boundary paths and add warning issues where the backing write implementation is not present yet.

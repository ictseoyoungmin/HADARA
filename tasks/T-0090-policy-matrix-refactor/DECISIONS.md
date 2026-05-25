# Decisions

Record task-local design decisions here.

- Keep `src/policy/policy.ts` as the compatibility import surface for current CLI, MCP, fake-shell, and agent-loop callers.
- Release-risk commands such as `npm publish` are blocked outside release mode and still require explicit approval inside release mode.
- Network-risk commands require approval in auto/trusted mode.
- Classify unknown non-dangerous shell commands as `write` for now so future authorization work has an explicit bucket without changing current allow/ask behavior.
- Keep actor, surface, policy version, audit event, and CLI `--` delimiter work deferred to later policy/service capsules.

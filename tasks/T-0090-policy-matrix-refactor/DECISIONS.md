# Decisions

Record task-local design decisions here.

- Keep `src/policy/policy.ts` as the compatibility import surface for current CLI, MCP, fake-shell, and agent-loop callers.
- Make this capsule a structure-preserving refactor: the permission matrix encodes current decisions instead of tightening auto/trusted/release behavior.
- Classify unknown non-dangerous shell commands as `write` for now so future authorization work has an explicit bucket without changing current allow/ask behavior.
- Keep actor, surface, policy version, audit event, and CLI `--` delimiter work deferred to later policy/service capsules.

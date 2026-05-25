# SECURITY_MODEL

## Default Mode

Assisted mode.

## Invariants

- Never execute destructive commands automatically.
- Never print secrets into logs.
- Never write outside project root unless the user explicitly configures a path.
- Keep portable/local state under `data/`.
- Keep reproducible project state under `docs/`, `tasks/`, `.hadara/`, and context files.
- Public Task Capsule artifacts must be UTF-8 text and pass secret-pattern scanning before they are copied.
- Binary evidence and secret-bearing evidence must stay private until a dedicated sanitized artifact policy exists.
- Private evidence source artifacts are copied into the private portable store only when the source resolves inside the project boundary by default.
- External absolute private evidence paths may be recorded only as sanitized committed evidence metadata unless a future explicit override policy is added.

## Blocked by Default

- `rm -rf /`
- `git clean -fdx`
- `git reset --hard`
- `curl | sh`
- `iwr | iex`
- `sudo`
- disk formatting commands
- direct secret dumps

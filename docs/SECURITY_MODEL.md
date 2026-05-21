# SECURITY_MODEL

## Default Mode

Assisted mode.

## Invariants

- Never execute destructive commands automatically.
- Never print secrets into logs.
- Never write outside project root unless the user explicitly configures a path.
- Keep portable/local state under `data/`.
- Keep reproducible project state under `docs/`, `tasks/`, `.hadara/`, and context files.

## Blocked by Default

- `rm -rf /`
- `git clean -fdx`
- `git reset --hard`
- `curl | sh`
- `iwr | iex`
- `sudo`
- disk formatting commands
- direct secret dumps

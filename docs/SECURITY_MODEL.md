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
- Shell-executing evidence capture is not implemented. Future `evidence from-command` work must follow `docs/EVIDENCE_FROM_COMMAND_DESIGN.md`, require explicit execution mode, run policy preflight, bound raw logs, and keep raw/private output out of committed evidence by default.
- Init v1 apply requires a reviewed plan hash; brownfield apply additionally requires explicit adoption confirmation. Apply recomputes the plan under a project-local lock and rejects stale, conflicting, or partially safe plans before writes.
- Init v1 paths must remain inside the resolved project root, must not traverse symbolic-link path segments, must not collide by case, and must not create nested HADARA projects. Transaction locks and recovery journals stay under ignored `.hadara/local/` runtime state.
- Init v1 rollback restores only journaled transaction-owned mutations and verifies created-file hashes before removal; a path changed by another actor is retained and reported for manual recovery.
- Init v1 upgrade cannot change presets, features, document packs, project configuration, existing document-registry bytes, Task Board content, or optional user-authored documents. Malformed AGENTS managed markers and invalid canonical authority files block the whole upgrade before writes.

## Blocked by Default

- `rm -rf /`
- `git clean -fdx`
- `git reset --hard`
- `curl | sh`
- `iwr | iex`
- `sudo`
- disk formatting commands
- direct secret dumps

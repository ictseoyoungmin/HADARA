# T-0134 Local Package Smoke Execution

## Goal

Implement explicit local package smoke execution for HADARA packages while keeping dry-run as the default-safe mode.

## Scope

- Add an explicit `hadara package smoke --execute --json` local mode.
- Run `npm pack` in a disposable workspace for source-checkout input.
- Install the tarball into an isolated temporary npm prefix.
- Execute the installed `hadara doctor --json` command form.
- Execute the installed `hadara smoke run --profile core --json` command form.
- Emit a reduced, schema-valid `hadara.packageSmoke.v1` report without raw logs, private paths, package contents, publish, release mutation, global install, GitHub Release, or Docker image behavior.
- Keep default `hadara package smoke --dry-run --json` behavior read-only.

## Out of Scope

- Public evidence attachment beyond reduced report previews; full smoke evidence integration remains T-0136.
- Clean-checkout source smoke; this remains T-0135.
- Publish, release artifact generation, GitHub Release creation, Docker image builds, install matrix execution, broad MCP package-smoke surfaces, or global npm installation.

## Status

Done

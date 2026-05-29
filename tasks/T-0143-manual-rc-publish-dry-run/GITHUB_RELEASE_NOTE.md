# HADARA 0.1.0-rc.0

This is the first npm release candidate for HADARA, a portable agentic development workbench built around Task Capsules, evidence-backed handoffs, CLI JSON surfaces, and read-only operational views.

## Install

```bash
npm install -g hadara@0.1.0-rc.0
hadara doctor --json
```

## Highlights

- Publishes the HADARA CLI package to npm for the first release-candidate install path.
- Includes the built `hadara` command at `dist/cli/main.js`.
- Ships the current Task Capsule, evidence, release gate, package smoke, clean-checkout smoke, release artifact, TUI, dashboard, MCP read-model, and operations-status CLI surfaces.
- Keeps the package whitelist intentionally narrow: `dist/`, `README.md`, `LICENSE`, and `package.json`.
- Preserves the current safety boundary: MCP release/package execution, GitHub Release publishing, Docker image publishing, installer mutation, and broad write-capable MCP behavior remain out of scope.

## Verification

- `npm run check` passed in the manual RC publish container with 57 test files and 404 tests.
- Package smoke passed with reduced public evidence:
  `tasks/T-0143-manual-rc-publish-dry-run/artifacts/package-smoke/2026-05-29T02-15-40.993Z-summary.json`
- Clean checkout smoke passed with reduced public evidence:
  `tasks/T-0143-manual-rc-publish-dry-run/artifacts/clean-checkout-smoke/2026-05-29T02-16-49.438Z-summary.json`
- Release artifact generation passed with reduced public evidence:
  `tasks/T-0143-manual-rc-publish-dry-run/artifacts/release-artifact/2026-05-29T02-16-52.312Z-report.json`
- Strict release gate, release dry-run, and release publish dry-run returned `ok: true`.
- `npm publish ./dist-release/hadara-0.1.0-rc.0.tgz --dry-run --registry=https://registry.npmjs.org` passed without publishing.
- npm registry verification after publish returned:
  `https://registry.npmjs.org/hadara/-/hadara-0.1.0-rc.0.tgz`

## Release Assets

- `hadara-0.1.0-rc.0.tgz`
- `hadara-0.1.0-rc.0.tgz.sha256`
- `hadara-0.1.0-rc.0.tgz.manifest.json`

## Known Gaps

- Linux/WSL install scripts are not included yet.
- Windows install scripts are not included yet.
- USB portable install and launcher flows are not included yet.
- README release/install documentation still needs a follow-up pass.
- Docker image publishing remains deferred.

## Next

The next capsule should focus on user installation and release documentation: Linux/WSL install scripts, Windows install script, USB portable install/launcher flow, README install guidance, and optional GitHub Release draft/tag work.

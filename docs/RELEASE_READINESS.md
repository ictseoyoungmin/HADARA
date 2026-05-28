# RELEASE_READINESS

This document is the dedicated tracked source for release, install, installer, package-smoke, package metadata, install-matrix, release-artifact, and publish/deploy readiness details.

`hadara release gate --mode strict --json` may read this document and other tracked evidence, but it must remain read-only. It must not run installer scripts, package smoke, `npm pack`, install packages, publish packages, create GitHub releases, build Docker images, mutate PATH, write shell profiles, call GitHub, execute remote CI, or perform registry mutation.

## Package Metadata Release Readiness

Current bootstrap metadata mode:

- Package name decision: `hadara`.
- npm registry observation: `npm view hadara name version --registry=https://registry.npmjs.org` returned 404 on 2026-05-28; recheck immediately before publish.
- Current version remains `0.0.0-bootstrap`.
- Current package remains `private: true`.
- Current binary remains `bin.hadara` at `./dist/cli/main.js`.
- Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability.
- Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present.
- Scoped fallback decision: do not silently switch names; choose and document an explicit scope in a later release-target capsule if `hadara` is unavailable.
- Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0`.
- `private: true` remains until the package files whitelist, root README, license decision, and package-smoke dry-run evidence are complete.
- Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist.
- Do not add `files` entries for missing installer or portable paths in T-0127.
- MIT license decision: adopt MIT; package remains private until owner-approved `LICENSE` text exists.
- Publish target decision: npm package first, GitHub Release second, Docker image deferred.
- Installed CLI verification must use `hadara doctor --json`.
- T-0127 performs no publish, no `npm pack`, no install smoke, no release artifact build, no GitHub Release, no Docker image build, and no registry mutation.
- Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`.

## Installer Script Surface and Schema

T-0128 defines installer and portable launcher contracts only. It does not create installer scripts, portable launchers, install trees, symlinks, shell profile edits, package copies, package artifacts, or registry mutations.

Reserved installer script paths:

- `scripts/install.sh`
- `scripts/install.ps1`

Reserved portable launcher paths:

- `portable/bin/hadara`
- `portable/bin/hadara.cmd`
- `portable/bin/hadara.ps1`

Installer responsibilities:

- Installer scripts install or plan installation from a tarball or directory.
- Installer scripts must support dry-run planning before mutation.
- Installer scripts must emit `hadara.install.plan.v1` JSON for dry-run planning.
- Installer scripts must not use `sudo` by default.
- Installer scripts must not force `npm install -g`.
- Installer scripts must not mutate shell profiles or PATH by default.
- Installer scripts must not print full environment values, npm tokens, private absolute paths, raw npm logs, or private store paths.

Portable launcher responsibilities:

- Portable launchers invoke an installed or portable HADARA bundle.
- Portable launchers do not install dependencies.
- Portable launchers do not mutate PATH.
- Portable launchers do not modify project files.
- Portable launchers must prefer the installed `hadara` command form for user-facing validation.

Default install locations:

- POSIX prefix: `~/.local/share/hadara`
- POSIX bin link: `~/.local/bin/hadara`
- Windows prefix: `%LOCALAPPDATA%\HADARA`
- Windows cmd launcher: `%LOCALAPPDATA%\HADARA\bin\hadara.cmd`
- Windows PowerShell launcher: `%LOCALAPPDATA%\HADARA\bin\hadara.ps1`
- Windows USB portable root: `L:\HADARA`
- WSL USB portable root: `/mnt/l/HADARA`

Node and WSL checks:

- Installer plans must validate Node 22.
- Missing Node 22 must produce a friendly remediation message.
- WSL install plans must reject Windows `node.exe` shims.
- WSL install plans must require Linux Node.js.

Dry-run report schema:

- Schema id: `hadara.install.plan.v1`
- Command: `install.plan`
- Modes: `dry-run`, `execute`
- Platforms: `linux`, `windows`, `wsl`, `usb`; `posix` remains a compatibility alias for Linux-style installs.
- Actions must describe planned writes without performing them.
- Public output must be reduced and redacted.
- Target paths must be public path references, not raw absolute path strings.
- `target.prefix.displayPath` is a redacted or portable display path for humans, not a private raw path.
- `target.prefix.pathRedacted: true` is required for public install-plan output.
- `target.launcher.displayPath` is a redacted or portable display path for humans, not a private raw path.
- `target.launcher.pathRedacted: true` is required for public install-plan output.
- `source.pathRedacted: true` is required when source path details appear in public install-plan output.
- Optional `relativePath` values must be project-relative, bundle-relative, or portable-relative; they must not be private absolute paths.
- `execution.executeEnabled` must state whether mutation is available to the current command implementation.
- `mode: execute` is schema-reserved only until an explicit later capsule implements mutation.
- T-0129 dry-run implementation must reject execute mode or return `INSTALL_EXECUTION_DISABLED`.
- The schema fixture documents a future execute mode but does not authorize installer execution.
- Raw logs must be temporary or private/local only.

T-0128 release-gate boundary:

- The release gate checks installer surface and schema markers only.
- The release gate must not execute `scripts/install.sh`.
- The release gate must not execute `scripts/install.ps1`.
- The release gate must not create or invoke `portable/bin/hadara`.
- The release gate must not mutate install locations, PATH, shell profiles, package artifacts, GitHub Releases, Docker images, npm registry state, or user machines.

## Installer Dry-run Implementation

T-0129 implements installer planning only.

- Public command: `hadara install plan --json`.
- Supported flags: `--platform linux|windows|wsl|usb|posix`, `--source <path>`, `--source-kind tarball|directory|portable-bundle`, `--prefix <path>`, `--launcher <path>`, and `--mode dry-run|execute`.
- Successful dry-run output uses schema `hadara.install.plan.v1`.
- Dry-run actions describe planned writes with `wouldWrite: true` but perform no filesystem, PATH, profile, package, registry, or release mutation.
- Public source and target path fields use `pathRedacted: true`.
- User-supplied private absolute source, prefix, and launcher paths are not echoed in public output.
- `--mode execute` returns issue `INSTALL_EXECUTION_DISABLED` and does not execute installer behavior.
- Capability discovery marks `hadara install plan --json` as read-only.
- T-0129 creates no installer scripts, no portable launchers, no install directories, no package artifacts, and no MCP installer execution surface.

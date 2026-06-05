# RELEASE_READINESS

This document is the dedicated tracked source for release, install, installer, package-smoke, package metadata, install-matrix, release-artifact, and publish/deploy readiness details.

`hadara release gate --mode strict --json` may read this document and other tracked evidence, but it must remain read-only. It must not run installer scripts, package smoke, `npm pack`, install packages, publish packages, create GitHub releases, build Docker images, mutate PATH, write shell profiles, call GitHub, execute remote CI, or perform registry mutation.

## Package Metadata Release Readiness

Current release-candidate metadata mode:

- Package name decision: `hadara`.
- npm registry observation: `npm view hadara name version --registry=https://registry.npmjs.org` returned 404 on 2026-05-28; recheck immediately before publish.
- Current version is `0.1.0-rc.0`.
- Current package is `private: false`.
- Current package metadata includes `"license": "MIT"`.
- Current binary remains `bin.hadara` at `./dist/cli/main.js`.
- Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`.
- Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability.
- Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present.
- Scoped fallback decision: do not silently switch names; choose and document an explicit scope in a later release-target capsule if `hadara` is unavailable.
- Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0`.
- T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist.
- Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist.
- Do not add `files` entries for missing installer or portable paths in T-0127.
- MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist.
- Publish target decision: npm package first, GitHub Release second, Docker image deferred.
- Installed CLI verification must use `hadara doctor --json`.
- T-0142 performs no publish, no GitHub Release creation, no Docker image build, and no registry mutation; it transitions metadata and regenerates reduced release evidence only.
- Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`.

## CI Release Workflow Target Decision

T-0139 decides what release means before any publish or deploy script exists.

Release target decision:

- Primary release target: npm package.
- Secondary release target: GitHub Release with tarball, checksum, and manifest.
- Deferred release target: Docker image.
- Docker image publishing is deferred unless HADARA adds a server/runtime product surface that needs container distribution.
- npm package publish is the first approval-gated mutation path because HADARA is currently a Node CLI/workbench.
- GitHub Release is secondary for portable archive distribution and checksum/manifest inspection.

Required secret names:

- npm publish token name: `NPM_TOKEN`.
- GitHub Release token name: `GITHUB_TOKEN` or `HADARA_GITHUB_RELEASE_TOKEN`.
- Token values must never be written to repository files, public evidence, release artifacts, logs, manifests, or context export.
- Token presence checks may report only present/missing/redacted status.

Approval and mutation boundary:

- Publish/deploy remains explicit approval only.
- T-0139 performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading.
- Release mode is required before any future publish/deploy command may consider `NPM_TOKEN`, `GITHUB_TOKEN`, or `HADARA_GITHUB_RELEASE_TOKEN`.

Release target provider model:

- T-0244 introduces release target descriptors so release readiness can name ecosystem-specific targets without claiming every ecosystem is executable.
- The active primary descriptor is `npm-package` with ecosystem `npm`, manifest `package.json`, artifact kind `npm-tarball`, smoke profile `npm-package-smoke`, and publish provider `npm`.
- The active secondary descriptor is `github-release` with ecosystem `github-release`, retained tarball/checksum/manifest artifacts, and approval-gated publishing still blocked by the current implementation.
- The deferred descriptor is `docker-image` with ecosystem `docker`; Docker build and publish execution remain deferred.
- If `pyproject.toml` is present, release dry-run may surface `python-package-preview` with ecosystem `python`, artifact kinds `wheel` and `sdist`, smoke profile `python-package-preview`, and publish provider `pypi`.
- Python release target detection is read-only preview only. HADARA does not currently run `python -m build`, create wheels or sdists, run `pip install` smoke, run `twine check`, load PyPI credentials, or publish to PyPI.
- The existing `package-smoke` evidence category remains the historical npm package smoke evidence channel; new provider metadata identifies the current implementation as npm-specific through `npm-package-smoke`.
- Future release ecosystems such as Python, Cargo, Maven, Docker, or generic archives must add provider-specific smoke/readiness behavior in their own capsules and preserve the no-mutation-by-default release boundary.

T-0141 publish/deploy command boundary:

- `hadara release publish --mode dry-run|execute --json` emits `hadara.releasePublish.v1`.
- The command checks release dry-run readiness, package publishability metadata, approval metadata, and token presence without including token values.
- Execute mode requires `--approval-actor`, `--approval-reason`, and `--confirm publish-deploy`, and execute requests are privately audited before returning a blocked report.
- The current implementation never runs `npm publish`, creates a GitHub Release, builds a Docker image, mutates registries, uploads artifacts, calls GitHub APIs, or exposes an MCP release execution surface.

Evidence freshness and cross-check implementation for T-0140:

- `hadara release dry-run --json` is read-only and emits `hadara.releaseDryRun.v1`.
- The dry-run verifies the strict release gate, then cross-checks package-smoke, clean-checkout smoke, and release-artifact public evidence records.
- Release gate strictness means evidence existence, artifact schema validity, source/report `ok`, and expected category/mode/result.
- Release dry-run strictness is release gate strictness plus freshness checks for current package version, release artifact manifest hash, and git commit when public evidence artifacts include git commit metadata.
- T-0260 decomposes release dry-run internals into target configuration, provider advisory, evidence validation, readiness, and diagnostics services without changing the `hadara.releaseDryRun.v1` report shape or adding release mutation.
- Release artifact evidence flow is explicit: run `hadara release artifact --execute --json --output dist-release --attach-evidence --task <task-id>` to attach the reduced `hadara.releaseArtifact.v1` report under `tasks/<task-id>/artifacts/release-artifact/`.
- T-0140 still performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading.

Compatibility markers retained for the read-only strict release gate:

- Evidence freshness must compare evidence to the release candidate window.
- Evidence cross-check should follow this order: record exists, artifact exists, artifact schema valid, `sourceReport.ok` true when present, category/mode/result match the expected check.
- Release artifact evidence flow must be explicit: run `hadara release artifact --execute --json --output dist-release`.

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

Default install location suggestions:

- Linux/POSIX/WSL prefix suggestion: `~/.local/share/hadara`
- Linux/POSIX/WSL bin link suggestion: `~/.local/bin/hadara`
- Windows prefix suggestion: `%LOCALAPPDATA%\HADARA`
- Windows cmd launcher suggestion: `%LOCALAPPDATA%\HADARA\bin\hadara.cmd`
- Windows PowerShell launcher suggestion: `%LOCALAPPDATA%\HADARA\bin\hadara.ps1`
- Default POSIX/WSL/Windows install paths are suggestions, not silent decisions.
- Windows USB portable root: user-selected removable drive, for example `L:\HADARA`.
- WSL USB portable root for `--platform usb`: user-selected mounted removable drive, for example `/mnt/l/HADARA`.
- The drive letter or mount path must not be assumed.
- USB install roots must be explicitly provided.
- Install planning must require an explicit `--usb-root` or `--target` value for USB, or return a structured issue asking the user to choose one.
- `--platform wsl` uses Linux-style default install suggestions; mounted removable drives belong to `--platform usb`.

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
- `wouldWrite: true` means the action would write only in a future confirmed execute/apply mode; it does not mean the dry-run command wrote anything.
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

## Release Artifact Output Boundary

T-0137 introduces explicit local release artifact building through `hadara release artifact --execute --json`.

- Default artifact output is disposable and removed after the reduced report is created.
- Retained output requires an explicit `--output <dir>`.
- The recommended retained local output directory is `dist-release/`.
- `dist-release/` is ignored by git and should not be committed.
- Release artifact outputs may include tarballs, checksum files, and manifest files, but public reports must stay reduced and redacted.
- Release artifact building must not publish to npm, create GitHub Releases, build Docker images, call GitHub, mutate registries, or execute install-matrix behavior.
- The generated release artifact manifest currently uses `hadara.releaseArtifact.manifest.v1`; register that manifest schema before a future release gate reads manifest files directly.

## Installer Dry-run Implementation

T-0129 implements installer planning only.

- Public command: `hadara install plan --json`.
- Supported flags: `--platform linux|windows|wsl|usb|posix`, `--source <path>`, `--source-kind tarball|directory|portable-bundle`, `--target <path>`, `--usb-root <path>`, `--prefix <path>`, `--launcher <path>`, and `--mode dry-run|execute`.
- Successful dry-run output uses schema `hadara.install.plan.v1`.
- Dry-run actions describe planned writes with `wouldWrite: true` but perform no filesystem, PATH, profile, package, registry, or release mutation.
- `wouldWrite: true` means execute/apply mode would write if later confirmed; it is not evidence that dry-run wrote files.
- Public source and target path fields use `pathRedacted: true`.
- User-supplied private absolute source, prefix, and launcher paths are not echoed in public output.
- USB dry-run planning without `--usb-root` or `--target` returns issue `USB_ROOT_REQUIRED`.
- `--mode execute` returns issue `INSTALL_EXECUTION_DISABLED` and does not execute installer behavior.
- Dry-run JSON must never prompt.
- Future install execution must require either interactive confirmation or an explicit `--yes`.
- Capability discovery marks `hadara install plan --json` as read-only.
- T-0129 creates no installer scripts, no portable launchers, no install directories, no package artifacts, and no MCP installer execution surface.

## Install Matrix Smoke Plan

T-0130 defines install-matrix smoke planning only. It does not run installer scripts, run package smoke, call `npm pack`, install packages, create portable bundles, mutate PATH, mutate shell profiles, call GitHub, publish packages, create release artifacts, or write install-matrix evidence.

Required matrix rows:

- Matrix row: Linux source checkout
- Matrix row: Linux package install
- Matrix row: WSL source checkout
- Matrix row: Windows source checkout
- Matrix row: Windows package install
- Matrix row: USB portable on Windows
- Matrix row: USB portable on WSL
- Matrix row: installed CLI major-feature smoke

Matrix execution boundaries:

- Docker/Linux validation does not replace real Windows validation.
- Linux source-checkout rows may use Docker or native Linux as reproducible local evidence.
- WSL source-checkout rows must prove Linux Node.js is used, not a Windows `node.exe` shim.
- Windows rows must be observed on real Windows or an explicitly documented Windows runner.
- USB rows must require explicit user-selected USB roots.
- USB rows must not assume a drive letter or mount path.
- Package-install rows are blocked until package smoke and release artifacts exist.
- Source-checkout rows may keep `node dist/cli/main.js` as an internal fallback.
- Package/install/USB rows must prefer the installed `hadara` command form.
- Installed CLI major-feature smoke should use the future core smoke profile before release-readiness checks.

Matrix evidence boundaries:

- Matrix evidence must record platform, source kind, installer/package form, command form, and reduced public result.
- Public matrix evidence must not include raw install logs, npm token values, environment dumps, private absolute paths, private portable-store paths, or USB serial/device identifiers.
- Raw logs and private paths must stay temporary or private/local.
- Failure evidence should record stable issue codes, exit codes, and reduced remediation text.
- The release gate must not execute install matrix smoke.
- The release gate may only check this plan now and later read reduced evidence records.

Structured matrix follow-up:

- T-0130 keeps install matrix rows as planning markers only.
- Before adding more matrix rows or executable matrix results, move the matrix row list into a structured fixture such as `docs/release-readiness.json` or `src/fixtures/install-matrix.v1.json`.
- The future structured fixture schema should be `hadara.installMatrix.plan.v1`.
- The future fixture should include row fields such as `id`, `platform`, `sourceKind`, `commandForm`, and `status`.
- The read-only release gate should prefer the structured fixture over wording-sensitive Markdown markers once the fixture exists.

## Major Feature Smoke Runner Plan

T-0131 implements the core major-feature smoke runner before package-smoke or install-matrix execution. The first profile is `core`, so package smoke can reuse the same reduced feature checks without creating release-gate evidence cycles.

Current T-0131 boundary:

- The core profile calls internal service/read-model surfaces directly.
- It does not spawn `hadara`, resolve PATH, verify launcher wiring, install a package artifact, or prove a USB/Windows/Linux installed binary.
- Report fields must make this explicit with `executionMode: "service-read-model"`, `binaryExecuted: false`, `launcherChecked: false`, and `packageInstallChecked: false`.
- Future installed-CLI smoke belongs after package artifacts, install apply/launcher wiring, and explicit subprocess policy exist.
- T-0131 is the Core Feature Smoke Runner; Installed CLI Smoke and Package Smoke Execution are future package/install smoke scopes.

Recommended `core` profile command set:

- `hadara doctor --json`
- `hadara status --json`
- `hadara task list --json`
- `hadara tools list --json`
- `hadara tui --snapshot --json`
- `hadara release gate --mode advisory --json`

Profile boundaries:

- The `core` profile must avoid package-smoke execution and strict release-gate evidence requirements.
- `hadara smoke run --profile core --json` emits a reduced `hadara.featureSmoke.v1` report over service/read-model surfaces.
- The `release-readiness` profile is reserved but currently returns `FEATURE_SMOKE_PROFILE_DEFERRED`.
- A later `release-readiness` profile may include strict release gate checks, package smoke evidence, install matrix evidence, and release artifact evidence after those surfaces exist.
- Smoke runner output must stay reduced and redacted, with raw logs temporary or private/local only.

## Release Gate Evidence Freeze

T-0138 keeps `hadara release gate --mode advisory|strict --json` read-only while allowing it to read existing Task Capsule evidence records.

Evidence-backed checks:

- `PACKAGE_SMOKE_EVIDENCE` reads passed public package-smoke execution evidence.
- `CLEAN_CHECKOUT_SMOKE_EVIDENCE` reads passed public clean-checkout smoke evidence.
- `RELEASE_ARTIFACT_EVIDENCE` reads passed public release artifact build evidence.
- `REMOTE_CI_OBSERVATION` remains a documented remote-CI observation check.
- `INSTALL_MATRIX_SMOKE_EVIDENCE` is reserved but non-blocking until an executable install-matrix smoke surface exists.

The release gate must not execute package smoke, clean-checkout smoke, install matrix smoke, `npm pack`, installer scripts, package installs, publish/deploy, GitHub Releases, Docker builds, provider calls, or MCP release/package/install tools.

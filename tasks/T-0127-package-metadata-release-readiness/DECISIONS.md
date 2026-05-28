# Decisions

- Primary package name remains `hadara`.
- `npm view hadara name version --registry=https://registry.npmjs.org` returned 404 on 2026-05-28, so `hadara` appeared unregistered at the time of this capsule; recheck immediately before publish.
- If the npm name is unavailable, do not silently switch names; choose and document an explicit scoped fallback in a later release-target capsule.
- Current bootstrap version remains `0.0.0-bootstrap`.
- Release metadata is mode-aware: bootstrap mode requires `0.0.0-bootstrap` plus `private: true`; release-candidate mode should require `0.1.0-rc.N`, `private: false`, a package `files` whitelist, `LICENSE`, and package-smoke evidence.
- First release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0` after package smoke, install matrix, release-gate evidence freeze, public docs alignment, and license finalization.
- `private: true` remains in place until files whitelist, README, license, and package-smoke dry-run evidence are ready.
- Final `files` whitelist target includes `dist/`, `README.md`, `LICENSE`, and `package.json`; installer and portable paths are added only after those files exist.
- MIT is the intended license. Keep the package private until owner-approved MIT `LICENSE` text is added.
- Installed CLI verification must use `hadara doctor --json`, not the source-checkout `node dist/cli/main.js` form.
- Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving release readiness from fragile `TEST_STRATEGY.md` string markers to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`.
- T-0127 performs no publish, package, install, release artifact, GitHub Release, Docker image, or registry mutation.

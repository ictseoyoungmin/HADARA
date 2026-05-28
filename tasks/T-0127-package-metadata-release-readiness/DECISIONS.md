# Decisions

- Primary package name remains `hadara`.
- If the npm name is unavailable, do not silently switch names; choose and document an explicit scoped fallback in a later release-target capsule.
- Current bootstrap version remains `0.0.0-bootstrap`.
- First release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0` after package smoke, install matrix, release-gate evidence freeze, public docs alignment, and license finalization.
- `private: true` remains in place until files whitelist, README, license, and package-smoke dry-run evidence are ready.
- Final `files` whitelist target includes `dist/`, `README.md`, `LICENSE`, and `package.json`; installer and portable paths are added only after those files exist.
- Installed CLI verification must use `hadara doctor --json`, not the source-checkout `node dist/cli/main.js` form.
- T-0127 performs no publish, package, install, release artifact, GitHub Release, Docker image, or registry mutation.

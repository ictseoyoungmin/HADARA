# Decisions

- Use `0.1.0-rc.0` as the first release-candidate metadata version.
- Set `private: false` only after the whitelist, license, package-smoke, clean-checkout, and release-artifact evidence gates are in place.
- Keep the package whitelist narrow: generated runtime files in `dist/`, root `README.md`, root `LICENSE`, and `package.json`.
- Treat release publish dry-run success as readiness evidence only; actual `npm publish`, GitHub Release creation, Docker publishing, and artifact upload remain future explicit work.
- Continue recording token presence by token name only. Detailed approval actor identity can be decided before a future mutation-capable runner exists.

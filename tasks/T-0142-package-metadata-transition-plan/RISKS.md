# Risks

| Risk | Mitigation |
|---|---|
| `private: false` could be mistaken for an actual release/publish event. | Docs and publish dry-run output state that no publish, GitHub Release, Docker build, registry mutation, artifact upload, or GitHub API call occurs. |
| Package whitelist could omit required runtime files. | Whitelist includes `dist/`, `README.md`, `LICENSE`, and `package.json`; package-smoke and release-artifact evidence were regenerated after the change. |
| Release dry-run could rely on old bootstrap evidence. | Fresh T-0142 package-smoke, clean-checkout, and release-artifact evidence was attached and cross-checked. |
| Token or approval details could leak in public evidence. | Release publish dry-run records token presence by token name only and no token values; detailed actor recording remains deferred. |
| Actual mutation-capable runner could be assumed to exist. | T-0142 explicitly keeps mutation execution out of scope and preserves blocked/deferred release targets. |

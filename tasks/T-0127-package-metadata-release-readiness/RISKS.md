# Risks

| Risk | Mitigation |
|---|---|
| Metadata readiness accidentally makes the package publishable before package smoke and install matrix evidence exist. | Keep `private: true`, avoid publish commands, and document transition criteria only. |
| `files` whitelist references missing installer or portable paths and breaks future package contents. | Record the final target but defer actual `package.json` `files` mutation until referenced paths exist. |
| License is chosen without owner approval. | Record `LICENSE` as the path and keep the package private until the owner chooses the license text. |
| Release gate starts executing package checks. | Keep the new check read-only over package metadata and tracked docs only. |
| Installed CLI and source-checkout command forms are confused. | Document `hadara doctor --json` for installed CLI verification and keep `node dist/cli/main.js` as source-checkout fallback only. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation and record exact results in task evidence. |

# Risks

| Risk | Mitigation |
|---|---|
| Private raw evidence leaks into committed Task Capsule files. | Store raw private bytes only in `.hadara/local/portable/data/private-evidence`, keep committed records sanitized, and test for absence. |
| Private source paths leak through manifests or context export. | Do not persist original source paths; test JSON/string output for path absence. |
| Hashing changes existing private evidence collection for placeholder paths. | Create manifests for readable source paths and preserve existing private evidence behavior when the source path is unavailable. |
| Encryption is expected immediately. | Record encryption as explicitly deferred in manifest metadata for this bootstrap slice. |

# Risks

| Risk | Mitigation |
|---|---|
| Token leakage through command history or committed files. | The helper accepts a token environment variable name, not a token value, and release notes contain no secrets. |
| GitHub Release could be published accidentally. | The helper creates only a draft and requires `--execute --github-draft` plus typing `github-draft`. |
| npm tarball path could be interpreted as a package/git spec. | The helper normalizes relative tarball paths to `./...` before calling `npm publish`. |
| Release notes could drift from evidence. | The note file references T-0143 evidence artifacts and is task-local. |
| Install script or README work could get mixed into the publish capsule. | Linux/WSL, Windows, USB install scripts and README cleanup are explicitly deferred to the next capsule. |

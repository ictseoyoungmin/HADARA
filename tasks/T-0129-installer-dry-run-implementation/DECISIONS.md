# Decisions

- The public command is `hadara install plan`; it emits `hadara.install.plan.v1`.
- `linux` is the user-facing Linux platform. `posix` remains accepted as a compatibility alias for Linux-style install planning.
- Linux, WSL, and Windows install paths are default suggestions, not silent mutation decisions.
- `--platform wsl` uses Linux-style default suggestions; mounted removable drive installs are USB plans, not WSL defaults.
- USB install planning has no default drive letter or mount path. It requires `--usb-root` or `--target`; otherwise the plan returns `USB_ROOT_REQUIRED`.
- `--prefix` remains a non-USB install-root override but does not satisfy the USB root requirement.
- `wouldWrite: true` means the action would write in a future confirmed execute/apply mode; dry-run does not write.
- Dry-run planning is read-only: actions describe `wouldWrite: true` future steps but perform no filesystem, PATH, shell profile, package, registry, or release mutation.
- `--mode dry-run` is the only successful mode in T-0129.
- `--mode execute` is accepted only to return a schema-valid disabled report with `INSTALL_EXECUTION_DISABLED`; it does not execute or partially execute installer behavior.
- Future install execution must require either interactive confirmation or an explicit `--yes`; dry-run JSON must never prompt.
- User-supplied absolute source, prefix, and launcher paths are not echoed in public output. Source and target fields use `pathRedacted: true` plus safe display/relative values.
- Node 22 and WSL Windows-shim checks are reported in the plan; WSL Windows `node.exe` shims are treated as errors.
- The command is registered as a low-risk read-only CLI capability and has no MCP surface in this capsule.
- `package.json` and `package-lock.json` record `"license": "MIT"` for metadata/readiness alignment; this does not imply publishability while `private: true` remains.

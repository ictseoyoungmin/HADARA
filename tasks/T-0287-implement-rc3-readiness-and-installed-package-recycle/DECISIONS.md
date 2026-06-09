# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep rc2 install examples as the current published npm RC until rc3 is actually published. | Accepted | Avoid claiming an unpublished package can be installed from npm. | README |
| D-2 | Add rc3 as the current source publish candidate in package metadata and release docs. | Accepted | The source checkout should build/package as `hadara@0.2.0-rc.3`. | package metadata, release docs |
| D-3 | Use `/tmp` npm cache for package and clean-checkout smoke in this environment. | Accepted | The default npm cache path is read-only and caused `EROFS`. | package smoke evidence |
| D-4 | Use a checkpoint commit before release artifact refresh. | Accepted | `release artifact` requires a clean git worktree so artifact commit metadata matches artifact contents. | failed release-artifact evidence |

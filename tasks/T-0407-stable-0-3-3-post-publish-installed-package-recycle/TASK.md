# T-0407 Stable 0.3.3 post-publish installed-package recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0407 |
| Title | Stable 0.3.3 post-publish installed-package recycle |
| Status | Done |
| Created | 2026-06-22 |
| Updated | 2026-06-22 |

## Goal

| Goal | Notes |
|---|---|
| Verify stable `hadara@0.3.3` from the published npm package in disposable consumer paths. | This proves the package users install from npm works beyond source-repo release gates. |

## Scope

| In Scope | Reason |
|---|---|
| npm registry and dist-tag verification | Confirm stable package visibility and tag state after T-0406. |
| Temporary-prefix install from npm | Install `hadara@latest` into an isolated consumer prefix. |
| Installed-bin runtime smokes | Run `version`, `help lifecycle`, `init`, task lifecycle/finalize, context graph/pack/slice/cache/session-start from the installed package. |
| Disposable project cleanup | Remove temporary consumer paths after smoke completion. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New product features or source implementation changes | This is a post-publish recycle capsule. |
| GitHub Release draft | Secondary approval-gated target; not required for npm consumer recycle. |
| Docker/PyPI publish, installer execution, MCP release/package execution | Separate explicit mutation surfaces. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-22 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-22 | In Progress | Reframed as stable `0.3.3` installed-package recycle from npm consumer paths. | T-0407 task docs |
| 2026-06-22 | Done | Verified published `hadara@0.3.3` from npm registry and disposable consumer install paths. | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
<!-- hadara:managed:end task-status-history -->

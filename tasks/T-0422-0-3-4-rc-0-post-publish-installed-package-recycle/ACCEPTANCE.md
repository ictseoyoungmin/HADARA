# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `npm view hadara@0.3.4-rc.0 version` resolves to `0.3.4-rc.0`. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-2 | npm dist-tags show `next=0.3.4-rc.0` and `latest=0.3.3` or the current stable package. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-3 | Temporary-prefix install of `hadara@next` succeeds. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-4 | Installed `hadara version --json` reports `packageVersion:"0.3.4-rc.0"`. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-5 | Installed `hadara help lifecycle` works. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-6 | Installed `hadara session start --json` works in a fresh initialized repo. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-7 | Installed `hadara task lifecycle` and `hadara task finalize --json` dry-run flow works. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-8 | Installed `hadara context pack` and `hadara context slice` smokes work. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-9 | Disposable temporary folders are cleaned up or retained only by explicit diagnostic choice. | Done | `ev:T-0422:f32c692a502c49d494970f4d` |
| AC-10 | Shared handoff/state docs clearly show T-0418 completed, T-0422 active/current, recycle result, and no stable `0.3.4` decision yet. | Done | Shared docs updated before finalize. |

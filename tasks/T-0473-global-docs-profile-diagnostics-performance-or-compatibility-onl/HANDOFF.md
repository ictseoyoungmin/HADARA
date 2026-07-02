# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Default selected-task workbench projections now use fast detail unless full detail is explicitly requested. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| Dashboard selected-task workbench, bootstrap, and timeline call sites avoid accidental full docs/profile diagnostics on hot paths. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| Docker build refreshed workspace `dist`; built CLI smoke confirmed fast status at 73ms and explicit full diagnostics at 9119ms. | ev:T-0473:4fdec13ad3af42928d1d71d8; ev:T-0473:2dd3fa4b13d04089bf651e34 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Profile dashboard/API aggregate route latency if more performance work is needed. | `tests/unit/dashboard-static.test.ts` still spends several seconds in the multi-route API test, so a separate capsule can profile non-workbench dashboard read models without reopening this closed scope. | docs/TASK_BOARD.md; src/cli/dashboard.ts; tests/unit/dashboard-static.test.ts |
| Compatibility-only sidecar cleanup decision. | T-0471/T-0472 removed user-facing legacy assumptions, but historical/compatibility-only references remain by design unless a stricter cleanup policy is chosen. | tasks/T-0472-legacy-sidecar-reference-audit/TASK.md; docs/TASK_BOARD.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full diagnostics remain intentionally heavier. | `task status --task T-0473 --detail full --json` took 9119ms in this mounted workspace because it runs close-grade/docs/profile checks. | Keep default loop and dashboard paths fast; use full detail only before close or for explicit diagnostics. |

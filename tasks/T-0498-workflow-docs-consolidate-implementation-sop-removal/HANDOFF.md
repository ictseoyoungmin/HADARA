# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Consolidated current workflow guidance on `docs/HADARA_WORKFLOW.md`, removed root `docs/IMPLEMENTATION_SOP.md`, and updated current docs/source read-map surfaces away from SOP. Expanded regression validation and final done-level harness passed after SOP fixture corrections. | ev:T-0498:b6158a034c4e45e1b0abaa01, ev:T-0498:6a1ea7301202461e81728a49, ev:T-0498:6dd2380374504875a6dc5cf1 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue with remaining 0.4.1-rc.0 capsule work: package smoke drift gate plus finalize `--auto`. | T-0498 only handled workflow-doc authority drift; the agreed rc0 functional work remains. | `docs/specs/0.4.1/rc0-scope.md`, `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `npm run dev:docker-sync-build` and tar-copy Docker validation can be silent for long periods on the mounted workspace. | Operators may not know whether validation is hung or making progress. | Prefer direct focused `docker exec hadara-dev ...` checks when debugging, and address progress output in a later UX task. |
| Host and mounted workspace `node_modules` missed rolldown optional native bindings before `npm install`. | Host Vitest startup failed before tests ran. | Use Docker dependency repair or fresh install before relying on mounted Vitest; local feedback recorded under `.hadara/local/feedback/`. |

# Risks

| Risk | Mitigation |
|---|---|
| Remote CI state changes after observation. | Record exact timestamp, run URL, branch, and commit SHA; keep local Docker checks as primary reproducible evidence. |
| Release gate could accidentally become a remote execution surface. | The implementation reads only local docs and does not call GitHub, trigger workflows, publish, deploy, or execute release actions. |
| Missing remote observation could block strict mode unexpectedly. | Advisory mode remains warning-only; strict mode treats missing release-readiness documentation consistently with other readiness checks. |

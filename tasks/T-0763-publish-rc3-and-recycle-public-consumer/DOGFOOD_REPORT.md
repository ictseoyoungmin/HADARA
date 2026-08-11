# RC3 Installed-Package Dogfooding Report

## Run identity

| Field | Value |
|---|---|
| Date | 2026-08-11 |
| Package | hadara@next |
| Resolved version | 0.5.0-rc.3 |
| Registry tags | next=0.5.0-rc.3, latest=0.4.6 |
| Installation boundary | Isolated temporary npm prefix and disposable consumer; no global install |

## Result

The published RC3 package installed successfully and supported a complete consumer task loop. The recycle runner passed registry metadata, isolated install, installed version, command surface (57 command ids), lifecycle help, reviewed init-plan application, task creation, task/status read models, context slice, and cleanup.

The deeper consumer loop created T-0001, ran installed version and context validation, appended operation evidence, passed evidence lint, reached closed-valid, repeated close with zero writes, and confirmed fresh task status returned terminal idle with no recommendation.

Parent evidence:

- ev:T-0763:14975c72acda4514a8497233 — package recycle pass.
- ev:T-0763:04c70bb575b640cdb621f7c7 — complete consumer lifecycle summary.

## Findings

| Finding | Disposition |
|---|---|
| Registry-backed recycle failed in the restricted sandbox before install. | Re-ran with approved network access; the failed record ev:T-0763:6247d461e5b94d5bbb6acf01 is retained and the subsequent pass is recorded. |
| Fresh standard init emits warnings for scaffold workflow sections and required-reading profile drift. | Non-blocking for close; carry as a follow-up candidate rather than changing the published RC3 artifact during recycle. |
| Close guards correctly rejected invalid source-role/risk tokens and an actionable HANDOFF row with task creation disabled. | Fixed in the disposable consumer capsule using the installed CLI diagnostics, then close passed. |

## Safety boundary

No npm publish, GitHub release mutation, source-tree mutation, or persistent consumer state was performed by this run. The existing GitHub RC3 metadata/assets failure remains open for the operator and is not silently treated as resolved.

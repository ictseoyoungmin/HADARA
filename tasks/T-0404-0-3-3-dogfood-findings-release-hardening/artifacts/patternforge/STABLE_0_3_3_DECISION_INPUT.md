# Stable 0.3.3 Decision Input

## Summary

PatternForge completed the planned 22-capsule dogfood line through local product MVP work, installed-package recycle, context-routing audit, lifecycle audit, evidence/handoff audit, production-readiness review, and consolidated HADARA findings.

The dogfood result supports a stable 0.3.3 release path, but not an unconditional immediate publish. Two HADARA framework findings should be handled before the stable publish decision is finalized:

| Finding | Decision Input | Reason |
|---|---|---|
| PF-F-012 `context pack` state projection | Fix before stable if feasible. | Context pack reported Task Board rows missing even though lifecycle commands resolved those rows. This can undermine context-routing trust. |
| PF-F-010 `task status` after finalize | Fix or explicitly accept as a known issue. | A closed-valid task can still receive a required handoff-update next action, which may encourage close-source edits after close. |

## Recommended Release Posture

| Option | Recommendation | Notes |
|---|---|---|
| Publish `0.3.3` stable now without further action | Not recommended. | Dogfood found no catastrophic blocker, but PF-F-012 is directly related to a marquee 0.3.3 context-routing surface. |
| Publish `0.3.3` stable after fixing PF-F-012 and resolving or accepting PF-F-010 | Recommended. | This keeps the release aligned with the dogfood evidence while avoiding known context trust drift. |
| Publish `0.3.3-rc.1` instead | Reasonable fallback. | Use this if PF-F-012 or PF-F-010 fixes require validation churn or if the operator wants another recycle before stable. |
| Defer 0.3.3 entirely | Not required by dogfood evidence. | Product-level PatternForge gaps do not block HADARA release because they are outside the framework package. |

## Dogfood Evidence

| Area | Result | Evidence |
|---|---|---|
| Installed package init/recycle | Passed | `ev:T-0016:5a68e6ffba14466a841d848e` |
| Context routing | Passed with release-consider findings | `ev:T-0017:fb99ca25e94c4ea89a49cc07` |
| Lifecycle | Passed with UX follow-up findings | `ev:T-0018:ce0d1d6fc18d49978bcc4b9b` |
| Evidence and handoff | Passed with automation follow-up findings | `ev:T-0019:c4edfab1cc6f4de9b74fc546` |
| Production readiness | PatternForge is local dogfood MVP, not public SaaS ready | `ev:T-0020:bce1f74924d5489f944f310c` |
| HADARA improvement synthesis | Stable considerations identified | `ev:T-0021:e1e3e2f1878a4a9b8bc780f7` |

## Non-Blocking Follow-Ups

The following findings should be scheduled after stable or folded into a later release line, but they do not need to stop 0.3.3 once PF-F-012 and PF-F-010 are handled:

| Class | Findings |
|---|---|
| Read-only help mutation class | PF-F-001, PF-F-007 |
| Docs registry ergonomics | PF-F-004, PF-F-006 |
| Installed-project context guidance | PF-F-002, PF-F-003, PF-F-005, PF-F-009, PF-F-013 |
| Lifecycle/evidence ergonomics | PF-F-011, PF-F-014, PF-F-015 |
| Dev-loop performance guidance | PF-F-008 |

## PatternForge Product Boundary

PatternForge proved enough of the target SaaS workflow to evaluate HADARA:

| Capability | Dogfood State |
|---|---|
| Docker Compose runnable stack | Implemented. |
| Upload, region, analysis, preset, render, export, jobs, and library flow | Implemented and smoke-tested. |
| Editable `grass-field-v1` procedural asset flow | Implemented. |
| Public multi-user SaaS controls | Not implemented; outside HADARA stable release gate. |

PatternForge should remain a local dogfood MVP unless auth, authorization, secret handling, rate limits, retention, observability, and real queue semantics are added.

## Next HADARA-dev Action

Return to the HADARA-dev repository and open focused release-hardening capsules for:

| Priority | Action |
|---|---|
| P0 | Investigate and fix PF-F-012, or prove it is dogfood-project-specific and record the accepted risk. |
| P1 | Fix PF-F-010 or explicitly document the post-close `task status` next-action wording as accepted rc0 behavior. |
| P2 | Refresh release readiness for `0.3.3` or prepare `0.3.3-rc.1` if fixes are material. |


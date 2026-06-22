# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Scope T-0403 as docs/spec planning only, not product implementation. | Accepted | The user asked to write the spec first; implementation belongs in the later dogfood project capsules. | TASK.md, dogfood spec |
| D-2 | Allocate 22 dogfood capsules instead of forcing the work into 15. | Accepted | Fifteen capsules can cover a demo MVP, but production-oriented SaaS hardening and HADARA lifecycle/context audits need separate capsules. | PF-001 through PF-022 budget |
| D-3 | Make the first product line user-assisted and deterministic by default. | Accepted | Fully automatic universal image decomposition would be research scope; a no-GPU CPU path is more reliable for Docker Compose dogfooding. | Product feasibility and boundaries in spec |
| D-4 | Treat raw uploaded images as private/local dogfood data, not public evidence. | Accepted | HADARA evidence should remain reduced and safe; raw images may contain private content. | Security and HADARA dogfood requirements |
| D-5 | Run the future dogfood project in a separate initialized repo using installed `hadara@0.3.3-rc.0`. | Accepted | This proves generated docs and installed-package behavior rather than source-checkout behavior. | HADARA dogfood requirements |

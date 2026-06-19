# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Large source files can make first raw reads slow or produce oversized payloads. | C4 would be less useful for worker startup if it reads too much text. | Medium | Enforced a 2 MiB source file budget, 300-line explicit range budget, 500-line tail budget, 3 keyword windows, and 512 KiB payload warning. | Mitigated |
| Unsafe paths or binary files could leak non-project/private content or unreadable data. | Violates HADARA read boundary and produces unusable context. | Low | Reject absolute/parent-relative paths, `.git`, `node_modules`, private local store paths, missing files, and NUL-byte binary-looking files. | Mitigated |
| Keyword windows can duplicate content when matches overlap. | Wastes tokens and slows downstream workers. | Medium | Merge overlapping keyword ranges before slicing. | Mitigated |
| Managed-section marker interpretation can drift from docs patch/list behavior. | C4 could return different boundaries than managed-section tooling. | Low | Reused `parseManagedSections` from `src/services/managed-sections.ts`. | Mitigated |
| Symbol and context-pack candidate slicing remain unavailable in this core capsule. | Full C4 spec is not complete yet. | High | Kept explicit out-of-scope rows and command registry notes; follow-up C4 capsules should add C2 symbol range lookup and C3 candidate lookup. | Open |
| Host focused vitest evidence `ev:T-0369:804344ee78404022a3f3c050` is blocked because host dependencies are unavailable. | Done-level evidence semantics require blocked evidence to be explained. | Low | Next step was Docker validation; `ev:T-0369:905e29de909447c792f65df0`, `ev:T-0369:0d173cea1f054b8680afe2b5`, and `ev:T-0369:6a145235ce7948b3b3d3178a` show the Docker validation/sync-build path passed and superseded the host-local blocker. | Mitigated |

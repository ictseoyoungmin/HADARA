# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json`, `package-lock.json`, README, release notes, and release readiness docs identify source target `hadara@0.3.4-rc.0` while preserving published stable `hadara@0.3.3` as the install target. | Met | `ev:T-0417:ecda3bba2ad74bbb8e236f3d` |
| AC-2 | Validation proves the built CLI reports `packageVersion=0.3.4-rc.0` and relevant README/init/release docs tests pass. | Met | `ev:T-0417:ecda3bba2ad74bbb8e236f3d`, `ev:T-0417:85ad10f4377f4bbd970e5756` |
| AC-3 | Release-readiness checks run without npm publish, GitHub Release creation, Docker/PyPI publish, installer execution, MCP release/package execution, or token loading. | Met | `ev:T-0417:08b2899cd422471ab020fab8`, `ev:T-0417:12f0252b75924831872e82b0`, `ev:T-0417:8dac1b2a716949d29310c171` |
| AC-4 | Evidence is attached and task/shared handoff state is updated before finalize. | Met | `ev:T-0417:8aa3da465aea45688f1d43cd`, `ev:T-0417:7759e003e45f47fa87c689e8` |

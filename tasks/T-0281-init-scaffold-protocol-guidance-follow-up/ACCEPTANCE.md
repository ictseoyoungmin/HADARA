# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Generated `.gitignore` ignores common Python, pytest, venv, and SQLite artifacts while preserving existing HADARA ignore boundaries. | Done | Focused init tests passed; generated scaffold smoke confirmed `__pycache__/`, `.venv/`, `venv/`, `*.db`, `*.sqlite`, and `*.sqlite3`. |
| AC-2 | Generated SOP/AGENTS explicitly state evidence integrity rules, including no hand-editing `evidence.jsonl` and honest failed/blocked evidence. | Done | Focused init tests passed; generated scaffold smoke confirmed Evidence Records and AGENTS evidence integrity wording. |
| AC-3 | Generated workflow/validation docs explain that `harness validate` remains a direct diagnostic while `task ready`/`task close` are the standard lifecycle gates. | Done | Focused init and workflow docs tests passed; direct `harness validate --level done` smoke returned `ok:true`. |
| AC-4 | Generated SOP explains how people or agents register new project-specific docs through Required Reading. | Done | Focused init tests passed; generated scaffold smoke confirmed Project-Specific Documents and `init register-doc` guidance. |
| AC-5 | Evidence is attached and handoff/state docs are updated. | Done | Evidence `ev:T-0281:c309e56cec2f4b1fb9de506c` attached; Project State, Agent Handoff, and Development Slices updated. |
| AC-6 | Generated and root workflow docs tell operators to finalize close-source docs before close and avoid volatile close evidence ids in close-source docs. | Done | Focused init/workflow docs tests passed; Docker and workspace init smokes confirmed close-source guidance. |

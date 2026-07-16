# Delegated Codex Prompt

You are working in `/mnt/f/NowWorking/dev/hadara-046-current-dogfood-rerun`.

HADARA is already installed for this project, but this environment cannot rely on executable bin links. Use this exact command prefix whenever the generated docs say `hadara`:

```bash
node /mnt/f/NowWorking/dev/hadara-046-current-dogfood-rerun/.hadara-install/node_modules/hadara/dist/cli/main.js
```

Act like a normal project user. Follow the generated `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, and `docs/HADARA_WORKFLOW.md`. Do not use HADARA-dev internal knowledge.

Build a small but usable MVP called "Quant Battle Arena" in this repository using HADARA task capsules:

1. Use HADARA to inspect and complete the recommended adoption-baseline task if the project asks for it. Close it correctly with `task finalize --execute --auto --json`.
2. Use one or two additional task capsules to implement a minimal quant battle project:
   - Python stdlib backend or CLI that can ingest sample price data from local CSV.
   - A simple strategy template in `.py` and matching `.md` docs for agents.
   - A lightweight HTML/JS visualization page for backtest results.
   - Project docs under `docs/` updated as needed; use `hadara docs add` when it is the right tool, or write/register markdown directly when appropriate.
3. Follow the HADARA lifecycle:
   - `task status`
   - `task create` when needed
   - update `TASK.md` and relevant generated docs
   - run real validation
   - record evidence
   - close with `task finalize --execute --auto --json`

Constraints:

- Avoid installing third-party packages. If yfinance is mentioned, design the adapter/template so a user can add it later, but keep the MVP runnable with local CSV data and standard library only.
- Do not hand-edit `TASK.md` Identity Status or `docs/TASK_BOARD.md` Status to force closure.
- Stop after the baseline and at least one MVP feature task are closed, or if a HADARA UX bug blocks you. Write a short `DOGFOOD_NOTES.md` in the project root summarizing what worked, what was confusing, and any blocker.

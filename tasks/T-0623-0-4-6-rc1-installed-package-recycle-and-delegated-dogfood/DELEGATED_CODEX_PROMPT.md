You are working in a freshly initialized project.

The project already has HADARA installed and initialized. Follow the project-local `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, and `docs/HADARA_WORKFLOW.md`.

Use this HADARA CLI command because the package was installed into a Windows-mounted npm prefix without bin links:

```sh
node /mnt/f/NowWorking/dev/hadara-0.4.6-rc1-recycle/prefix/node_modules/hadara/dist/cli/main.js
```

Do not assume a global `hadara` binary exists.

Build a small but real MVP for this project:

Project: Quant Battle Arena

Goal:
- A toy quant strategy battle arena for local experimentation.
- It should support local market data ingestion with a deterministic fallback dataset, SQLite storage or a simple file-backed fallback if dependencies are unavailable, a backend API surface, visualization-ready outputs, and strategy authoring templates for agents.

Constraints:
- Use at most 3 HADARA Task Capsules.
- Keep the generated `docs/` files current as you work.
- If you add optional docs such as decisions or roadmap, register them with HADARA docs commands when possible.
- If network or package installation is unavailable, implement deterministic local fallbacks instead of blocking.
- Do not publish anything.
- Do not edit files outside this project.

Expected deliverables:
- A runnable or inspectable MVP implementation.
- Strategy templates in `.py` and `.md`.
- Updated HADARA docs and task capsules.
- A `DOGFOOD_REPORT.md` describing:
  - commands used,
  - confusing HADARA output,
  - stale or missing instructions,
  - what worked well,
  - what should be improved before a stable release.

Start by reading the generated HADARA docs, then create/select the first task capsule and proceed.

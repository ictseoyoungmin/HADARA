# Context

Relevant documents:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/RELEASE_READINESS.md`
- `docs/TEST_STRATEGY.md`
- `tasks/T-0143-manual-rc-publish-dry-run/HANDOFF.md`

Current release facts:

- `hadara@0.1.0-rc.0` is published to npm.
- `package.json` is release-candidate metadata: `private: false`, MIT license, `bin.hadara` at `./dist/cli/main.js`, and files whitelist of `dist/`, `README.md`, `LICENSE`, and `package.json`.
- GitHub Release, tag push, installer scripts, and USB launchers remain deferred.

Assumptions and constraints:

- README should not claim installer or portable launcher behavior that does not exist yet.
- User-facing installed CLI verification should use `hadara doctor --json`.
- Source-checkout development can continue to use `npm install`, `npm run dev -- ...`, and `npm run check`.

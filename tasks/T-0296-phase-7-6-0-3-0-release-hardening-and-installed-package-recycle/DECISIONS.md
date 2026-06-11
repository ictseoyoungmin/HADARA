# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Set source candidate to `0.3.0-rc.0` while keeping README npm install examples on `0.2.0-rc.3`. | Accepted | 0.3.0 is not published by this task; users should install the latest published npm RC unless validating the source artifact. | `package.json`, `README.md`, `docs/RELEASE_READINESS.md` |
| D-2 | Keep docs cleanup archive behavior dry-run only in release docs. | Accepted | Phase 7.5 implemented metadata marking and archive planning, not file move/delete automation. | `README.md`, `docs/RELEASE_NOTES.md`, installed recycle docs archive smoke |
| D-3 | Use Docker clean-checkout smoke for release evidence after host DNS failures. | Accepted | Host `npm ci` hit registry `EAI_AGAIN` and npm exit-handler failure; Docker clean-checkout passed in the validated HADARA-dev environment. | clean-checkout evidence, installed recycle evidence |

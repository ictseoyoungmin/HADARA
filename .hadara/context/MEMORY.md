# MEMORY

## 2026-06-30 Docker Rebuild

- When the `hadara-dev` container is missing, recreate it with the SOP `docker run -dit --name hadara-dev ... node:22-bookworm bash`.
- On mounted `/mnt/f` workspaces, `docker exec ... tar -C /workspace .` can stall while walking the mount. A faster no-`docker cp` pattern is: create a `/tmp` workdir in the container from `git -c safe.directory=/workspace archive HEAD`, then overlay only changed source/test files with a small `tar -cf - <paths> | tar -xf - -C "$workdir"` before `npm ci`, build, and focused tests.
- Before creating a diff-based validation copy for an uncommitted capsule, ensure new source/test files are included in the overlay path list; task capsule docs usually are not needed for focused code validation.

## 2026-06-30 Legacy Boundary Dogfood

- If 0.4 mutation guards block HADARA-dev itself with `HADARA_PROTOCOL_MISSING`, check whether `.hadara/scaffold.json` exists before weakening product logic. The repository should dogfood the same generic 0.4 scaffold metadata as other supported projects.

# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Filename-match edges are noisy. | Agents may inspect unrelated files. | Medium | Filename matches are marked `derived`, not explicit. | Mitigated |
| Command mention edges are noisy. | Tests may mention command ids without testing them directly. | Medium | Command-id mentions are marked `heuristic`. | Mitigated |
| Evidence references may include stale historical test names. | Evidence-backed edges may point to old validation scope. | Low | Evidence edges are emitted only for currently indexed test paths. | Mitigated |

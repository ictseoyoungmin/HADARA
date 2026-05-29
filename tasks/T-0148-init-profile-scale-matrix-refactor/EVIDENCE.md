# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-29T06:10:00.915Z | command-log | Init profile scale refactor validation passed: focused init tests reported 1 file and 8 tests passed; Docker npm run check passed with 57 files and 410 tests; built CLI smoke confirmed basic, default standard, and governed generated the expected profile-specific docs without Hermes files. | passed |
| 2026-05-29T06:12:25.597Z | command-log | Done-level harness validation passed for T-0148 with ok true and no issues after evidence table cleanup. | passed |
| 2026-05-29T06:30:49.360Z | command-log | Old init profile-name removal validation passed: focused init tests reported 1 file and 8 tests passed; Docker npm run check passed with 57 files and 410 tests; built CLI smoke confirmed basic/default-standard/governed profiles and unsupported profile rejection; grep found no old init profile-name references outside excluded backlog files. | passed |
| 2026-05-29T06:34:59.586Z | command-log | Final clean-copy validation passed after removing compatibility aliases: Docker npm run check passed with 57 files and 410 tests; built CLI init smoke confirmed basic/default-standard/governed behavior and unsupported profile rejection; grep found no old init profile-name references outside excluded backlog files; done-level harness returned ok true with no issues. | passed |

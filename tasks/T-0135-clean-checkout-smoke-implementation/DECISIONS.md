# Decisions

Record task-local design decisions here.

## Separate Source-Checkout Surface

T-0135 uses `hadara smoke clean-checkout --execute --json` instead of extending package-smoke. This keeps source-checkout validation separate from installed package validation.

## Built CLI Internal Fallback

Clean-checkout source smoke uses `node dist/cli/main.js ...` inside the disposable copy. Installed user-facing `hadara ...` command-form validation remains package/install smoke scope after installer/package artifacts exist.

## Raw Log Retention Deferred

Raw command logs remain out of public reports. `--private-logs` retention policy belongs to T-0136 Smoke Evidence Integration, alongside reduced public evidence attachment.

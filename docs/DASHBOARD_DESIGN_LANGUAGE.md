# HADARA Dashboard Design Language (Phase 5.6)

> Status: Working artifact for the Phase 5.6 Operator Console UI/UX reset.
> Scope: Visual + interaction layer only. Consumes existing read models
> (`hadara.dashboard.bootstrap.v1`, `hadara.dashboard.task_detail.v1`,
> `hadara.dashboard.timeline.v1`). Adds no backend authority and no mutation.
> Governance carried forward: read-only, evidence-first, policy-aware, no hidden
> mutation, no browser-persisted project state, no private raw path exposure,
> no SSE/WebSocket by default.

This document is the contract the rebuilt dashboard is built from. The previous
surface was shaped like the data model (a property inspector). This one is shaped
like the operator's job.

---

## 1. Five principles

```text
P1  One verdict, loud.        Project/task health is a single legible state, not a chip strip.
P2  Narrative over inspector. The operator reads a story (what changed, what's next), not a property tree.
P3  Numbers carry meaning.    Every metric has context: good/bad tone, or a comparison.
P4  Provenance is ambient.    Live/cache/stale/degraded is a quiet, consistent corner signal — not the headline.
P5  Designed states.          Loading / empty / degraded are designed screens, not exposed phase flags.
```

---

## 2. Color roles (tokens)

The teal/gold identity is kept, but applied with discipline: the accent appears at
most once per region, and status colors are reserved for status only. Contrast for
body text targets WCAG AA (≥ 4.5:1) on its surface.

```text
--bg            #0c1418   app background (deepest)
--surface       #121d22   card / panel surface
--surface-2     #18262c   raised surface (inputs, hovered rows)
--surface-3     #20323a   highest raised (menus, active)
--border        rgba(120,210,222,0.14)   hairline
--border-strong rgba(201,166,107,0.34)   emphasis hairline

--text          #eef1ea   primary text (AA on --surface)
--muted         #aeb9b3   secondary text (AA on --surface)
--faint         #939d96   tertiary / captions only (never body) — AA ≥ 4.5:1 on surfaces

--accent        #79d2de   teal — interactive / focal accent (ONCE per region)
--accent-2      #c9a66b   gold — brand mark, dividers (not for status)

--ok            #6fd99a   success / sufficient / healthy
--warn          #efc169   warning / weak / private-only / degraded
--danger        #f08a86   error / failed / blocked
--info          #8fb7e8   neutral informational
```

Status color mapping (single source of truth for tone):

```text
health  ok        -> --ok       degraded -> --warn      error -> --danger
proof   sufficient-> --ok       weak/private-only/blocked-pending -> --warn
        failed/blocked          -> --danger             unknown -> --muted
source  live      -> --ok       cache/stale -> --info    degraded/fallback -> --warn
```

---

## 3. Type scale

```text
display  28 / 34   page title (one per view)
title    20 / 28   section headers
body     14 / 21   default text
label    13 / 18   field labels, nav
meta     12 / 16   provenance, timestamps, captions
mono     13        ids / commands / paths ONLY
```

Font roles:

```text
sans   Inter, system-ui, -apple-system, "Segoe UI", sans-serif   — all prose, labels, numbers
mono   ui-monospace, SFMono-Regular, Menlo, Consolas, monospace   — ids, commands, file paths ONLY
```

Rule that fixes ~70% of the "debug window" feel: **monospace is for `T-0206`,
`hadara task next`, and `docs/…` paths. Never for labels, prose, or counts.**

---

## 4. Spacing & radius

```text
space   4 / 8 / 12 / 16 / 24 / 32 / 48
radius  6 (controls) / 10 (cards) / 14 (page regions)
shadow  0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px rgba(0,0,0,0.30)
```

Cards breathe at 20–24px padding. Regions separated by 24px. No uniform 8px density.

---

## 5. Component inventory

Built from tokens above. Replaces the old inspector widgets.

| Component | Replaces | Job |
|---|---|---|
| `HealthVerdict` | `top-badges` health chip | One dot + word: Healthy / Degraded / Error. |
| `ProvenanceBadge` | two source-chip strips | One ambient pill: `live · 2s ago` / `cache hit` / `stale` / `degraded`. |
| `ActiveNext` | "next action" gate-card | The focal block: current/next task + copy-only command. |
| `MetricStat` | bare-number `gate-card` tiles | value + label + tone/context. |
| `ActivityFeed` | `timeline` rows | Scannable narrative: icon + title + relative time + severity. |
| `ProofVerdict` | `parser-row` Evidence Lens stack | Verdict word + tone + supporting counts + drill link. |
| `EvidenceList` | raw record dump | Compact records with strength/visibility, no raw paths. |
| `DeveloperJSON` | "Bottom Inspector" / "Inspect JSON" | Collapsed, read-only raw view behind a disclosure. |
| `Skeleton` | "phase: shell" text | Layout-shaped loading placeholders. |
| `DegradedBanner` | red `DEGRADED` chip | Quiet amber "showing last good read · retry". |

Removed from the primary surface: the words/classes `parser-row`, `Bottom Inspector`,
`Inspect JSON`, `raw-counts`, and the stacked diagnostic chip strips.

---

## 6. Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  HADARA · workspace        ● Healthy           live · 2s ago     ⟳ Refresh │
├────────────┬─────────────────────────────────────────────────────────────┤
│  sidebar   │  Active / Next   ← focal block, copy-only command            │
│  (views)   │  Activity feed            │  Proof verdict + evidence         │
│            │  Metrics (with context)   │  MCP guard / validation           │
│            │  Developer JSON (collapsed disclosure)                        │
└────────────┴─────────────────────────────────────────────────────────────┘
```

Responsive:

```text
≥ 1180px   sidebar + two-column main
768–1180   sidebar + single-column main (feed over proof)
< 768      collapsible sidebar, single column, stacked
```

---

## 7. Interaction model

```text
- Shell paints instantly with skeletons (bootstrap-first, preserved from Phase 5.5).
- Slow first load: if the live read has not returned in ~350 ms, paint the inline
  fallback as an offline preview, then upgrade to live when it arrives (no flash on
  fast loads). Per-source fetch timeout is short (~2.5 s) so a stall degrades quickly.
- A 'syncing…' indicator shows while a read is in flight; Refresh is disabled while busy.
- Sidebar switches distinct in-page views (Home / Task Board / Capsule / Evidence /
  Handoff / Harness / MCP / Release); no navigation, no reload, no browser persistence.
- Selecting a task lazy-loads /api/dashboard/task-detail only (no fan-out).
- Reads are split into LIVE (bootstrap→status) and NON-LIVE fallback (fixture→inline).
  Refresh = re-read; never runs checks. If a refresh loses live, retain the last good
  LIVE view and raise the degraded banner — never silently swap in stale sample data.
- Commands are copy-only. The dashboard never executes anything.
- Mobile (<768 px): sidebar becomes a compact horizontal scrolling nav strip.
- Optional polling stays memory-only and off by default (no SSE/WebSocket).
```

---

## 8. Designed states

```text
loading   skeleton of the real layout (cards/feed/proof), not text flags; inline
          offline preview if live is slow (>350 ms)
empty     "No task selected" → calm centered prompt; live-only regions that are
          absent in the offline fallback read "Unavailable offline" (not "empty")
degraded  amber banner. Two honest variants:
            refresh-failed → "Refresh failed — showing the last good live read · Retry"
            offline        → "Live read unavailable — showing offline sample data · Retry"
error     inline, scoped to the affected region; never blanks the screen
```

---

## 9. Accessibility & quality gates

```text
- Body text contrast ≥ 4.5:1; large text ≥ 3:1.
- Every interactive element keyboard-reachable; visible focus ring (--accent).
- Landmarks: header / nav / main; aria-live="polite" on the content region.
- Status conveyed by text + color, never color alone (dot + word).
- Validated with axe-core (no critical violations) + Playwright visual baselines,
  run in node:22-bookworm / Playwright Docker.
```

---

## 10. Boundaries restated (must not regress)

```text
No localStorage / sessionStorage / indexedDB / document.cookie for project state.
No WebSocket / EventSource / setInterval-driven streaming.
No shell / provider / MCP / task / evidence / handoff / release mutation.
No command execution from the UI (copy-only).
No private raw filesystem path exposure (project root stays redacted/fingerprinted).
The page loads no external/CDN resources (CSP self-only): all JS/CSS inline, single asset.
```

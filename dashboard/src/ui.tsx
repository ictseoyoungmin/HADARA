/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { RuntimeState, TaskDetail, TimelineEvent } from './model';
import {
  cleanRecommendation,
  healthLabel,
  healthTone,
  proofLabel,
  proofTone,
  relativeTime,
  severityTone,
  sourceLabel,
  sourceTone,
  type Tone
} from './util';

// --- atoms ------------------------------------------------------------------

export function Dot({ tone }: { tone: Tone }) {
  return <span class={`dot dot-${tone}`} aria-hidden="true" />;
}

export function VerdictPill({ tone, children }: { tone: Tone; children: ComponentChildren }) {
  return (
    <span class={`pill pill-${tone}`}>
      <Dot tone={tone} />
      {children}
    </span>
  );
}

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    // copy-only: the dashboard never executes commands.
    try {
      void navigator.clipboard?.writeText(value).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      });
    } catch {
      /* clipboard unavailable; no-op */
    }
  }
  return (
    <button type="button" class="copy-btn" onClick={copy} title="Copy command (read-only — dashboard does not execute it)">
      {copied ? 'Copied' : (label ?? 'Copy')}
    </button>
  );
}

// --- header -----------------------------------------------------------------

export function HealthVerdict({ health }: { health: string }) {
  const tone = healthTone(health);
  return (
    <div class="verdict" role="status" aria-label={`Project health: ${healthLabel(health)}`}>
      <Dot tone={tone} />
      <strong>{healthLabel(health)}</strong>
    </div>
  );
}

export function ProvenanceBadge({ runtime }: { runtime: RuntimeState }) {
  const tone = sourceTone(runtime.source.kind);
  const gen = runtime.source.generatedAt;
  const cache = runtime.cache;
  const cacheNote = cache && cache.status !== 'disabled' ? ` · cache ${cache.status}` : '';
  return (
    <span class={`provenance provenance-${tone}`} title={runtime.source.label}>
      {sourceLabel(runtime.source.kind)}
      {gen ? ` · ${relativeTime(gen)}` : ''}
      {cacheNote}
    </span>
  );
}

// --- skeleton / states ------------------------------------------------------

export function SkeletonBlock({ lines = 3, title }: { lines?: number; title?: boolean }) {
  return (
    <div class="skeleton" aria-hidden="true">
      {title ? <div class="sk-bar sk-title" /> : null}
      {Array.from({ length: lines }).map((_, i) => (
        <div class="sk-bar" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function DegradedBanner({ kind, when, onRetry }: { kind: 'refresh-failed' | 'offline'; when: string | null; onRetry: () => void }) {
  const message =
    kind === 'offline'
      ? 'Live read unavailable — showing offline sample data (not live).'
      : `Refresh failed — showing the last good live read${when ? ` · ${relativeTime(when)}` : ''}.`;
  return (
    <div class="degraded-banner" role="alert">
      <Dot tone="warn" />
      <span>{message}</span>
      <button type="button" class="link-btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div class="empty-state">
      <div class="empty-mark" aria-hidden="true">
        ◆
      </div>
      <strong>{title}</strong>
      <span>{hint}</span>
    </div>
  );
}

// --- cards ------------------------------------------------------------------

export function Card({ title, accessory, children, className }: { title?: string; accessory?: ComponentChildren; children: ComponentChildren; className?: string }) {
  return (
    <section class={`card ${className ?? ''}`}>
      {title ? (
        <header class="card-head">
          <h2 class="card-title">{title}</h2>
          {accessory ? <div class="card-accessory">{accessory}</div> : null}
        </header>
      ) : null}
      <div class="card-body">{children}</div>
    </section>
  );
}

export function ActiveNext({ runtime }: { runtime: RuntimeState }) {
  const active = runtime.activeRun.present ? runtime.activeRun : null;
  const nextRec = cleanRecommendation(runtime.tasks.nextRecommended);
  const recentTop = runtime.tasks.recent[runtime.tasks.recent.length - 1];
  const focusId = active?.taskId ?? recentTop?.id ?? null;
  const focusTitle = active ? active.status ?? '' : recentTop?.title ?? '';
  const command = nextRec ? 'hadara task next' : 'hadara task status';

  return (
    <section class="card focal-card">
      <header class="card-head">
        <h2 class="card-title">{active ? 'Active run' : 'Latest work'}</h2>
        <VerdictPill tone={active ? 'info' : 'ok'}>{active ? 'in progress' : 'idle'}</VerdictPill>
      </header>
      <div class="card-body">
        <div class="focal-row">
          <div class="focal-id mono">{focusId ?? '—'}</div>
          <div class="focal-title">{focusTitle || 'No active run. The workspace is idle.'}</div>
        </div>
        <div class="focal-next">
          <div class="focal-next-label">Next recommended</div>
          <div class="focal-next-cmd">
            <code class="mono">{command}</code>
            <CopyButton value={command} />
          </div>
          <p class="focal-note">Copy and run in your terminal — the dashboard does not execute it.</p>
        </div>
      </div>
    </section>
  );
}

// --- metrics ----------------------------------------------------------------

export function MetricStat({ value, label, tone = 'muted', context }: { value: string | number; label: string; tone?: Tone; context?: string }) {
  return (
    <div class="metric">
      <div class={`metric-value metric-${tone}`}>{value}</div>
      <div class="metric-label">{label}</div>
      {context ? <div class="metric-context">{context}</div> : null}
    </div>
  );
}

export function MetricsRow({ runtime }: { runtime: RuntimeState }) {
  const c = runtime.tasks.counts ?? {};
  const done = c.done ?? 0;
  const active = (c.inProgress ?? 0) + (c.partial ?? 0);
  const blocked = c.blocked ?? 0;
  const debtHigh = runtime.debt.highOpen;
  const debtPending = runtime.debt.pending === true;
  return (
    <div class="metrics-row">
      <MetricStat value={done} label="Tasks done" tone="ok" context="completed capsules" />
      <MetricStat value={active} label="Active / partial" tone={active > 0 ? 'info' : 'muted'} context={active > 0 ? 'work in flight' : 'none in flight'} />
      <MetricStat value={blocked} label="Blocked" tone={blocked > 0 ? 'danger' : 'muted'} context={blocked > 0 ? 'needs attention' : 'clear'} />
      <MetricStat
        value={debtPending ? '…' : runtime.debt.open}
        label="Open debt"
        tone={debtPending ? 'muted' : debtHigh > 0 ? 'warn' : runtime.debt.open > 0 ? 'info' : 'muted'}
        context={debtPending ? 'loading…' : debtHigh > 0 ? `${debtHigh} high` : 'no high-severity'}
      />
    </div>
  );
}

// --- activity feed ----------------------------------------------------------

function eventGlyph(kind: string): string {
  switch (kind) {
    case 'system':
      return '◆';
    case 'harness':
      return '✓';
    case 'evidence':
      return '▣';
    case 'task':
      return '●';
    default:
      return '·';
  }
}

export function ActivityFeed({ events, offline }: { events: TimelineEvent[]; offline?: boolean }) {
  if (!events.length) {
    return offline ? (
      <EmptyState title="Unavailable offline" hint="The activity timeline is a live read and is not included in the offline fallback." />
    ) : (
      <EmptyState title="No activity yet" hint="The deterministic read-only timeline has no events for this view." />
    );
  }
  return (
    <ol class="feed">
      {events
        .slice()
        .sort((a, b) => b.order - a.order)
        .map((e) => {
          const tone = severityTone(e.severity);
          return (
            <li class="feed-item" key={e.id}>
              <span class={`feed-glyph feed-${tone}`} aria-hidden="true">
                {eventGlyph(e.kind)}
              </span>
              <div class="feed-main">
                <div class="feed-top">
                  <span class="feed-title">{e.title}</span>
                  {e.time ? <span class="feed-time">{relativeTime(e.time)}</span> : <span class="feed-kind">{e.kind}</span>}
                </div>
                <div class="feed-summary">{e.summary}</div>
                {e.taskId || e.evidenceId ? (
                  <div class="feed-meta mono">
                    {e.taskId ? <span>{e.taskId}</span> : null}
                    {e.evidenceId ? <span>{e.evidenceId}</span> : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
    </ol>
  );
}

// --- proof verdict ----------------------------------------------------------

export function ProofVerdict({ detail }: { detail: TaskDetail }) {
  const tone = proofTone(detail.proof.status);
  const warn = detail.proof.auditabilityWarning;
  return (
    <div class="proof">
      <div class={`proof-verdict proof-${tone}`}>
        <Dot tone={tone} />
        <strong>{proofLabel(detail.proof.status)}</strong>
      </div>
      <p class="proof-note">{detail.proof.note || 'No proof note available.'}</p>
      <div class="proof-stats">
        <span>
          <strong>{detail.proof.substantivePositive}</strong> substantive
        </span>
        <span>
          <strong>{detail.evidenceCount}</strong> records
        </span>
        {detail.state ? (
          <span>
            blockers <strong>{detail.state.blockers}</strong>
          </span>
        ) : null}
        {detail.evidenceCount > 0 ? (
          <button
            type="button"
            class="link-btn proof-drill"
            onClick={() => document.getElementById('capsule-evidence')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            View evidence ↓
          </button>
        ) : null}
      </div>
      {warn ? <div class="proof-audit">Private-only evidence — auditability warning, not a Done blocker.</div> : null}
      {detail.proof.semanticIssueCodes.length ? (
        <ul class="issue-codes">
          {detail.proof.semanticIssueCodes.map((code) => (
            <li class="mono" key={code}>
              {code}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function EvidenceList({ detail }: { detail: TaskDetail }) {
  if (!detail.evidence.length) {
    return <EmptyState title="No evidence records" hint="This capsule has no sanitized evidence records to display." />;
  }
  return (
    <ul class="evidence-list">
      {detail.evidence.map((r) => (
        <li class="evidence-item" key={r.id}>
          <div class="evidence-top">
            <span class="evidence-id mono">{r.id}</span>
            <span class="tag tag-muted">{r.kind}</span>
            <span class={`tag tag-${r.result === 'passed' ? 'ok' : r.result === 'failed' ? 'danger' : r.result === 'blocked' ? 'warn' : 'muted'}`}>{r.result}</span>
            {r.strength ? <span class={`tag tag-${r.strength === 'substantive-positive' ? 'ok' : 'muted'}`}>{r.strength}</span> : null}
            <span class="tag tag-muted">{r.visibility}</span>
          </div>
          {r.summary ? <div class="evidence-summary">{r.summary}</div> : null}
        </li>
      ))}
    </ul>
  );
}

// --- developer json disclosure ---------------------------------------------

export function DeveloperJSON({ data }: { data: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <section class="card dev-json">
      <header class="card-head">
        <h2 class="card-title">Developer</h2>
        <button type="button" class="link-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide raw JSON' : 'Show raw JSON'}
        </button>
      </header>
      {open ? (
        <div class="card-body">
          <p class="dev-note">Read-only snapshot of the current in-memory view. The dashboard performs no mutation.</p>
          <pre class="json-view">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  );
}

/** @jsxImportSource preact */
import { render } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { isLiveSource, loadDebt, loadFallbackRuntime, loadLiveRuntime, loadTaskDetail, readInlineRuntime, type RuntimeState, type TaskDetail } from './model';
import {
  ActiveNext,
  ActivityFeed,
  Card,
  DegradedBanner,
  DeveloperJSON,
  EmptyState,
  EvidenceList,
  HealthVerdict,
  MetricsRow,
  ProofVerdict,
  ProvenanceBadge,
  SkeletonBlock
} from './ui';

type ViewId = 'home' | 'board' | 'capsule' | 'evidence' | 'handoff' | 'harness' | 'mcp' | 'release';

const VIEWS: { id: ViewId; label: string; group: string }[] = [
  { id: 'home', label: 'Home', group: 'Workspace' },
  { id: 'board', label: 'Task Board', group: 'Workspace' },
  { id: 'capsule', label: 'Task Capsule', group: 'Capsule detail' },
  { id: 'evidence', label: 'Evidence', group: 'Capsule detail' },
  { id: 'handoff', label: 'Handoff', group: 'Capsule detail' },
  { id: 'harness', label: 'Harness Lab', group: 'Operations' },
  { id: 'mcp', label: 'MCP Guard', group: 'Operations' },
  { id: 'release', label: 'Release Gate', group: 'Operations' }
];

const VIEW_META: Record<ViewId, { title: string; subtitle: string }> = {
  home: { title: 'Operator Console', subtitle: 'Current state, what to do next, and recent activity.' },
  board: { title: 'Task Board', subtitle: 'Task counts, recent capsules, and the next recommended step.' },
  capsule: { title: 'Task Capsule', subtitle: 'Proof status and evidence for the selected capsule.' },
  evidence: { title: 'Evidence', subtitle: 'Sanitized evidence records for the selected capsule (read-only).' },
  handoff: { title: 'Handoff', subtitle: 'Current-state handoff and the next recommended step.' },
  harness: { title: 'Harness Lab', subtitle: 'Latest validation results (read-only).' },
  mcp: { title: 'MCP Guard', subtitle: 'MCP mode and evidence-attach gates.' },
  release: { title: 'Release Gate', subtitle: 'Operational debt and release posture (read-only).' }
};

const POLL_INTERVAL_MS = 30000;
const PREVIEW_DELAY_MS = 350;

// --- small view helpers -----------------------------------------------------

function ViewHeader({ view }: { view: ViewId }) {
  const m = VIEW_META[view];
  return (
    <div class="page-head">
      <h1 class="page-title">{m.title}</h1>
      <p class="page-subtitle">{m.subtitle}</p>
    </div>
  );
}

function RowList({ rows, emptyOffline }: { rows: string[]; emptyOffline?: boolean }) {
  const parsed = rows
    .map((r) => r.split('|').map((c) => c.trim()).filter((c) => c.length))
    .filter((cells) => cells.length && !cells.every((c) => /^-+$/.test(c)));
  if (!parsed.length) {
    return <EmptyState title={emptyOffline ? 'Unavailable offline' : 'Nothing recorded'} hint={emptyOffline ? 'This is a live read and is not in the offline fallback.' : 'No rows were reported for this section.'} />;
  }
  return (
    <ul class="row-list">
      {parsed.map((cells, i) => (
        <li key={i}>
          <span class="row-key">{cells[0]}</span>
          <span class="row-val">{cells.slice(1).join(' · ') || '—'}</span>
        </li>
      ))}
    </ul>
  );
}

function GovernanceCard({ runtime }: { runtime: RuntimeState }) {
  return (
    <Card title="Governance">
      <dl class="kv">
        <div>
          <dt>MCP mode</dt>
          <dd>{runtime.mcp.defaultMode}</dd>
        </div>
        <div>
          <dt>Evidence attach</dt>
          <dd>{runtime.mcp.evidenceAttachRequiresApproval ? 'requires approval' : 'enabled'}</dd>
        </div>
        <div>
          <dt>Latest full check</dt>
          <dd class="kv-wrap">{runtime.validation.latestFullCheck ?? 'none recorded'}</dd>
        </div>
      </dl>
    </Card>
  );
}

function CountsCard({ runtime }: { runtime: RuntimeState }) {
  const counts = runtime.tasks.counts ?? {};
  const order = ['done', 'inProgress', 'partial', 'draft', 'superseded', 'unknown'];
  const entries = order.filter((k) => k in counts).map((k) => [k, counts[k]] as const);
  return (
    <Card title="Task counts">
      <div class="counts-grid">
        {entries.map(([k, v]) => (
          <div class="count-cell" key={k}>
            <div class="count-value">{v}</div>
            <div class="count-key">{k}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Sidebar({ runtime, active, onSelect }: { runtime: RuntimeState | null; active: ViewId; onSelect: (v: ViewId) => void }) {
  const groups = [...new Set(VIEWS.map((v) => v.group))];
  return (
    <nav class="sidebar" aria-label="Dashboard views">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">
          ◆
        </span>
        <span class="brand-name">HADARA</span>
      </div>
      <div class="brand-sub">Operator Console</div>
      {groups.map((group) => (
        <div class="nav-group" key={group}>
          <div class="nav-label">{group}</div>
          {VIEWS.filter((v) => v.group === group).map((v) => (
            <button
              type="button"
              key={v.id}
              class={`nav-item ${active === v.id ? 'is-active' : ''}`}
              aria-current={active === v.id ? 'page' : undefined}
              onClick={() => onSelect(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      ))}
      <div class="nav-foot">
        <div class="nav-foot-row">
          <span>workspace</span>
          <strong>HADARA-dev</strong>
        </div>
        <div class="nav-foot-row">
          <span>mode</span>
          <strong>{runtime?.mcp.defaultMode ?? 'read-only'}</strong>
        </div>
      </div>
    </nav>
  );
}

function CapsulePanel({ selectedTaskId, detail, loading }: { selectedTaskId: string | null; detail: TaskDetail | null; loading: boolean }) {
  if (!selectedTaskId) {
    return <EmptyState title="No task selected" hint="Pick a recent capsule to load its proof, evidence, and timeline." />;
  }
  if (loading && !detail) {
    return <SkeletonBlock lines={4} title />;
  }
  if (!detail) {
    return <EmptyState title="Detail unavailable" hint={`Could not load aggregate detail for ${selectedTaskId}.`} />;
  }
  return (
    <div class="capsule-detail">
      <div class="capsule-head">
        <span class="mono capsule-id">{detail.taskId}</span>
        <span class="capsule-title">{detail.title || 'Untitled capsule'}</span>
      </div>
      <ProofVerdict detail={detail} />
      <div class="capsule-evidence" id="capsule-evidence">
        <h3 class="sub-title">Evidence</h3>
        <EvidenceList detail={detail} />
      </div>
    </div>
  );
}

function RecentTasks({ runtime, selectedTaskId, onSelect, offline }: { runtime: RuntimeState; selectedTaskId: string | null; onSelect: (id: string) => void; offline?: boolean }) {
  const recent = runtime.tasks.recent.slice().reverse();
  if (!recent.length) {
    return offline ? (
      <EmptyState title="Unavailable offline" hint="The recent-capsule list is a live read and is not included in the offline fallback." />
    ) : (
      <EmptyState title="No recent tasks" hint="No recently completed capsules were reported." />
    );
  }
  return (
    <ul class="recent-list">
      {recent.map((t) => (
        <li key={t.id}>
          <button type="button" class={`recent-item ${selectedTaskId === t.id ? 'is-active' : ''}`} onClick={() => onSelect(t.id)}>
            <span class="mono recent-id">{t.id}</span>
            <span class="recent-title">{t.title}</span>
            <span class={`tag tag-${t.status === 'Done' ? 'ok' : 'muted'}`}>{t.status}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Grid({ main, side }: { main: ComponentChildren; side?: ComponentChildren }) {
  if (!side) return <div class="grid grid-single">{main}</div>;
  return (
    <div class="grid">
      <div class="grid-main">{main}</div>
      <div class="grid-side">{side}</div>
    </div>
  );
}

function App() {
  const [runtime, setRuntime] = useState<RuntimeState | null>(null);
  const [busy, setBusy] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const [degradedKind, setDegradedKind] = useState<'refresh-failed' | 'offline'>('offline');
  const [view, setView] = useState<ViewId>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const lastGoodRuntime = useRef<RuntimeState | null>(null);
  const pollTimer = useRef<number | null>(null);
  const failures = useRef(0);

  // Background backfill for the debt metric deferred by the core bootstrap tier.
  const backfillDebt = useCallback(async () => {
    const debt = await loadDebt();
    if (!debt) return;
    setRuntime((cur) => (cur && cur.debt.pending ? { ...cur, debt: { ...debt, pending: false } } : cur));
    const lg = lastGoodRuntime.current;
    if (lg && lg.debt.pending) lastGoodRuntime.current = { ...lg, debt: { ...debt, pending: false } };
  }, []);

  const load = useCallback(async (opts: { bypass?: boolean; viaPoll?: boolean } = {}) => {
    setBusy(true);
    // Perceived-speed: on the first load only, if the live read is slow, paint
    // the synchronous inline fallback as an offline preview so the operator
    // sees structure immediately. Skipped on fast loads (live wins the race).
    let previewTimer: number | null = null;
    if (!lastGoodRuntime.current) {
      previewTimer = window.setTimeout(() => {
        if (!lastGoodRuntime.current) {
          const inline = readInlineRuntime();
          if (inline) setRuntime((cur) => cur ?? inline);
        }
      }, PREVIEW_DELAY_MS);
    }

    let live: RuntimeState | null = null;
    try {
      live = await loadLiveRuntime({ bypass: opts.bypass });
    } catch (err) {
      console.error('[dashboard] live read failed', err);
    }
    if (previewTimer !== null) window.clearTimeout(previewTimer);

    if (live && isLiveSource(live.source.kind)) {
      lastGoodRuntime.current = live;
      failures.current = 0;
      setRuntime(live);
      setDegraded(false);
      setBusy(false);
      if (live.debt.pending) void backfillDebt();
      return true;
    }

    // Live read failed: degrade honestly rather than silently swapping in stale data.
    failures.current += 1;
    let fallback: RuntimeState | null = null;
    try {
      fallback = await loadFallbackRuntime();
    } catch {
      /* ignore */
    }
    if (lastGoodRuntime.current) {
      // We had live data before; keep the last good live view and flag the failure.
      setRuntime(lastGoodRuntime.current);
      setDegradedKind('refresh-failed');
    } else if (fallback) {
      // Never had live: show offline data, clearly flagged as not live.
      setRuntime(fallback);
      setDegradedKind('offline');
    } else {
      setDegradedKind('offline');
    }
    setDegraded(true);
    setBusy(false);
    return false;
  }, [backfillDebt]);

  useEffect(() => {
    void load();
  }, [load]);

  // lazy task detail
  useEffect(() => {
    if (!selectedTaskId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void loadTaskDetail(selectedTaskId).then((d) => {
      if (cancelled) return;
      setDetail(d);
      setDetailLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedTaskId]);

  // optional, memory-only polling via self-rescheduling timeout (no interval timers, no streaming)
  useEffect(() => {
    function clear() {
      if (pollTimer.current !== null) {
        window.clearTimeout(pollTimer.current);
        pollTimer.current = null;
      }
    }
    function schedule() {
      clear();
      const backoff = Math.min(failures.current, 4);
      const delay = POLL_INTERVAL_MS * (1 + backoff);
      pollTimer.current = window.setTimeout(async () => {
        if (!document.hidden) await load({ viaPoll: true });
        if (polling) schedule();
      }, delay);
    }
    if (polling) schedule();
    return clear;
  }, [polling, load]);

  const onSelectTask = useCallback((id: string) => {
    setSelectedTaskId(id);
    setView('capsule');
  }, []);

  const offline = !!runtime && !isLiveSource(runtime.source.kind);
  const showShell = !runtime && busy;

  function renderView(rt: RuntimeState) {
    switch (view) {
      case 'board':
        return (
          <Grid
            main={
              <>
                <MetricsRow runtime={rt} />
                <CountsCard runtime={rt} />
                <ActiveNext runtime={rt} />
              </>
            }
            side={
              <Card title="Recent capsules">
                <RecentTasks runtime={rt} selectedTaskId={selectedTaskId} onSelect={onSelectTask} offline={offline} />
              </Card>
            }
          />
        );
      case 'capsule':
        return (
          <Grid
            main={
              <Card title="Capsule detail">
                <CapsulePanel selectedTaskId={selectedTaskId} detail={detail} loading={detailLoading} />
              </Card>
            }
            side={
              <Card title="Recent capsules">
                <RecentTasks runtime={rt} selectedTaskId={selectedTaskId} onSelect={onSelectTask} offline={offline} />
              </Card>
            }
          />
        );
      case 'evidence':
        return (
          <Grid
            main={
              <Card title="Evidence">
                {detail ? (
                  <>
                    <div class="capsule-head">
                      <span class="mono capsule-id">{detail.taskId}</span>
                      <span class="capsule-title">{detail.title || 'Untitled capsule'}</span>
                    </div>
                    <div id="capsule-evidence">
                      <EvidenceList detail={detail} />
                    </div>
                  </>
                ) : (
                  <EmptyState title="No task selected" hint="Pick a recent capsule to read its sanitized evidence records." />
                )}
              </Card>
            }
            side={
              <Card title="Recent capsules">
                <RecentTasks runtime={rt} selectedTaskId={selectedTaskId} onSelect={onSelectTask} offline={offline} />
              </Card>
            }
          />
        );
      case 'handoff':
        return (
          <Grid
            main={
              <Card title="Current state">
                <RowList rows={rt.handoff.currentState} emptyOffline={offline} />
              </Card>
            }
            side={
              <Card title="Next recommended step">
                <RowList rows={rt.handoff.nextStep} emptyOffline={offline} />
              </Card>
            }
          />
        );
      case 'harness':
        return (
          <Grid
            main={
              <Card title="Latest validation">
                <dl class="kv">
                  <div>
                    <dt>Latest full check</dt>
                    <dd class="kv-wrap">{rt.validation.latestFullCheck ?? 'none recorded'}</dd>
                  </div>
                  <div>
                    <dt>Latest done-level validation</dt>
                    <dd class="kv-wrap">{rt.validation.latestDoneLevelValidation ?? 'none recorded'}</dd>
                  </div>
                </dl>
                <p class="view-note">Read-only. The dashboard does not run checks; refresh only re-reads recorded results.</p>
              </Card>
            }
          />
        );
      case 'mcp':
        return (
          <Grid
            main={
              <Card title="MCP guard">
                <dl class="kv">
                  <div>
                    <dt>Default mode</dt>
                    <dd>{rt.mcp.defaultMode}</dd>
                  </div>
                  <div>
                    <dt>Evidence attach</dt>
                    <dd>{rt.mcp.evidenceAttachRequiresApproval ? 'requires approval' : 'enabled'}</dd>
                  </div>
                </dl>
                <p class="view-note">Read-only guard surface. Evidence attach, shell execution, and provider calls remain gated.</p>
              </Card>
            }
          />
        );
      case 'release':
        return (
          <Grid
            main={
              <Card title="Operational debt">
                <div class="counts-grid">
                  <div class="count-cell">
                    <div class="count-value">{rt.debt.open}</div>
                    <div class="count-key">open</div>
                  </div>
                  <div class="count-cell">
                    <div class={`count-value ${rt.debt.highOpen > 0 ? 'metric-warn' : ''}`}>{rt.debt.highOpen}</div>
                    <div class="count-key">high open</div>
                  </div>
                  <div class="count-cell">
                    <div class="count-value">{rt.debt.total}</div>
                    <div class="count-key">total</div>
                  </div>
                </div>
                <p class="view-note">Release execution is deferred and never runs from the dashboard. This is a read-only posture view.</p>
              </Card>
            }
            side={<GovernanceCard runtime={rt} />}
          />
        );
      case 'home':
      default:
        return (
          <Grid
            main={
              <>
                <ActiveNext runtime={rt} />
                <MetricsRow runtime={rt} />
                <Card title="Activity">
                  <ActivityFeed events={rt.timeline} offline={offline} />
                </Card>
                <DeveloperJSON data={detail ?? rt} />
              </>
            }
            side={
              <>
                <Card title="Capsule detail">
                  <CapsulePanel selectedTaskId={selectedTaskId} detail={detail} loading={detailLoading} />
                </Card>
                <Card title="Recent capsules">
                  <RecentTasks runtime={rt} selectedTaskId={selectedTaskId} onSelect={onSelectTask} offline={offline} />
                </Card>
                <GovernanceCard runtime={rt} />
              </>
            }
          />
        );
    }
  }

  return (
    <div class="root">
      <Sidebar runtime={runtime} active={view} onSelect={setView} />
      <div class="frame">
        <header class="topbar">
          <div class="topbar-left">
            <span class="workspace-name">HADARA-dev</span>
            {runtime ? <HealthVerdict health={runtime.health} /> : <span class="verdict muted">Loading…</span>}
          </div>
          <div class="topbar-right">
            {busy ? <span class="syncing" aria-live="polite">syncing…</span> : null}
            {runtime ? <ProvenanceBadge runtime={runtime} /> : null}
            <button type="button" class={`toggle ${polling ? 'is-on' : ''}`} aria-pressed={polling} onClick={() => setPolling((v) => !v)}>
              {polling ? 'Auto-refresh on' : 'Auto-refresh off'}
            </button>
            <button type="button" class="primary-btn" onClick={() => void load({ bypass: true })} disabled={busy}>
              Refresh
            </button>
          </div>
        </header>

        <main class="main" aria-live="polite">
          {degraded ? <DegradedBanner kind={degradedKind} when={lastGoodRuntime.current?.source.generatedAt ?? null} onRetry={() => void load({ bypass: true })} /> : null}

          {showShell ? (
            <>
              <ViewHeader view={view} />
              <div class="grid">
                <div class="grid-main">
                  <SkeletonBlock lines={3} title />
                  <SkeletonBlock lines={5} title />
                </div>
                <div class="grid-side">
                  <SkeletonBlock lines={4} title />
                </div>
              </div>
            </>
          ) : runtime ? (
            <>
              <ViewHeader view={view} />
              {renderView(runtime)}
            </>
          ) : (
            <EmptyState title="No data available" hint="Could not read live status, fixture, or inline fallback. Use Refresh to retry." />
          )}
        </main>
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) render(<App />, mount);

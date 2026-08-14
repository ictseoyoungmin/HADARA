import {
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  CircleDot,
  Clipboard,
  ClipboardCheck,
  Code2,
  Compass,
  FileCheck2,
  FolderTree,
  Github,
  GitBranch,
  Menu,
  MoonStar,
  Orbit,
  PackageCheck,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Token, Tokens } from "marked";
import {
  pageContent,
  type DocContent,
  type DocBlock,
  type NativeDiagramKind,
  type PageId,
} from "./docs-content";
import { docsUpdatedAt, hadaraVersion } from "virtual:hadara-meta";

type Theme = "light" | "dark";
type IconType = typeof BookOpen;
type DocPage = Omit<DocContent, "icon"> & { icon: IconType };

const iconMap: Record<string, IconType> = {
  compass: Compass,
  rocket: Rocket,
  orbit: Orbit,
  workflow: Workflow,
  boxes: Boxes,
  "file-check": FileCheck2,
  "folder-tree": FolderTree,
  "git-branch": GitBranch,
  "clipboard-check": ClipboardCheck,
  "shield-check": ShieldCheck,
};

const fallbackIcons: Record<string, keyof typeof iconMap> = {
  home: "compass",
  "getting-started": "rocket",
  "what-is-hadara": "orbit",
  workflow: "workflow",
  "task-capsules": "boxes",
  evidence: "file-check",
  "cli-init": "folder-tree",
  "cli-task-lifecycle": "git-branch",
  "cli-evidence-validation": "clipboard-check",
  "project-protocol-files": "folder-tree",
};

const pages: DocPage[] = pageContent.map((page) => ({
  ...page,
  icon: iconMap[page.icon ?? fallbackIcons[page.id]] ?? BookOpen,
}));

const groups = ["Start here", "Core model", "Setup reference", "Agent protocol", "Reference"] as const;

function commandSectionCopy(page: DocPage) {
  switch (page.commandAudience) {
    case "human":
      return {
        eyebrow: "Human setup command",
        title: "Establish the project boundary",
        detail: "These are setup commands a human may intentionally run before handing normal development back to the agent.",
        nav: "Setup commands",
      };
    default:
      return {
        eyebrow: "Agent protocol trace",
        title: "How the agent carries the lifecycle",
        detail: "The coding agent runs this protocol on the human's behalf and reports the resulting state, evidence, or blocker for review.",
        nav: "Agent protocol",
      };
  }
}

/** #getting-started style hash <-> page id. Returns null for unknown hashes
 *  (e.g. in-page anchors like #commands), so they never hijack navigation. */
function pageIdFromHash(): PageId | null {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return pages.some((page) => page.id === raw) ? (raw as PageId) : null;
}

/** Theme was already applied pre-paint by the inline script in index.html; read it back. */
function initialTheme(): Theme {
  const applied = document.documentElement.dataset.theme;
  return applied === "light" ? "light" : "dark";
}

function CommandBlock({ command, variant = "shell" }: { command: string; variant?: "shell" | "plain" }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        // Non-secure contexts (e.g. opening the build from file://) have no
        // async clipboard; fall back to the legacy path instead of throwing.
        const scratch = document.createElement("textarea");
        scratch.value = command;
        scratch.setAttribute("readonly", "");
        scratch.style.position = "fixed";
        scratch.style.opacity = "0";
        document.body.appendChild(scratch);
        scratch.select();
        document.execCommand("copy");
        scratch.remove();
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
    <div className="command-block">
      <div className="command-head">
        <span>
          <CircleDot size={12} /> terminal
        </span>
        <button type="button" onClick={copy} aria-label="Copy command">
          {copyState === "copied" ? <Check size={14} /> : <Clipboard size={14} />}
          {copyState === "copied" ? "Copied" : copyState === "failed" ? "Press Ctrl+C" : "Copy"}
        </button>
      </div>
      <pre>
        {command.split("\n").map((line, index) => (
          // Index keys: command lines can legitimately repeat.
          <code key={index}>
            {variant === "shell" && <span>$</span>} {line}
          </code>
        ))}
      </pre>
    </div>
  );
}

/** Renders marked's inline token tree (bold/italic/code/link/plain text) as
 * JSX — never through dangerouslySetInnerHTML. */
function renderInline(tokens: Token[]): ReactNode[] {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "strong":
        return <strong key={index}>{renderInline((token as Tokens.Strong).tokens)}</strong>;
      case "em":
        return <em key={index}>{renderInline((token as Tokens.Em).tokens)}</em>;
      case "codespan":
        return <code key={index}>{(token as Tokens.Codespan).text}</code>;
      case "link": {
        const link = token as Tokens.Link;
        const external = /^(?:https?:)?\/\//.test(link.href);
        return (
          <a key={index} href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
            {renderInline(link.tokens)}
          </a>
        );
      }
      case "del":
        return <del key={index}>{renderInline((token as Tokens.Del).tokens)}</del>;
      case "br":
        return <br key={index} />;
      default:
        return <span key={index}>{"text" in token ? token.text : ""}</span>;
    }
  });
}

const lifecycleStages = [
  {
    number: "01",
    name: "Orient",
    summary: "Current state",
    title: "Read current state before choosing work.",
    detail: "The agent asks task status for the selected capsule, lifecycle phase, blockers, and next safe action instead of reconstructing state from chat history.",
    reads: "Task Board, selected capsule, registered current-state sources",
    produces: "A reasoned resume, create, wait, or stop decision",
    surface: "hadara task status --json",
    invariant: "Current project state is read before work is selected.",
  },
  {
    number: "02",
    name: "Contract",
    summary: "Bounded intent",
    title: "Keep one bounded Task Capsule current.",
    detail: "The active TASK.md records goal, scope, plan, acceptance, validation, constraints, risks, and meaningful changes while the work evolves.",
    reads: "Human intent, AGENTS.md, workflow rules, routed specifications",
    produces: "A reviewable work contract rather than an implicit chat plan",
    surface: "TASK.md + HANDOFF.md",
    invariant: "One bounded capsule owns the work contract.",
  },
  {
    number: "03",
    name: "Implement",
    summary: "Scoped change",
    title: "Change only what the bounded task authorizes.",
    detail: "The coding agent performs the actual engineering work. HADARA preserves boundaries and continuity without replacing model reasoning or implementation tools.",
    reads: "Current source, task constraints, exact referenced documents",
    produces: "Source and documentation changes within capsule scope",
    surface: "Project tools inside the capsule boundary",
    invariant: "Implementation authority never expands silently.",
  },
  {
    number: "04",
    name: "Validate",
    summary: "Disprovable checks",
    title: "Run checks that can actually disprove success.",
    detail: "Tests, builds, smoke checks, lint, and visual review are real observations. A command returning output is not by itself evidence that acceptance passed.",
    reads: "Acceptance criteria and validation plan",
    produces: "Passed, failed, blocked, or explicitly skipped observations",
    surface: "hadara validation run",
    invariant: "A check must be capable of disproving success.",
  },
  {
    number: "05",
    name: "Evidence",
    summary: "Durable proof",
    title: "Append proof without erasing failure history.",
    detail: "The agent records reduced durable evidence, binds artifacts when needed, and links follow-up evidence that resolves an earlier failure.",
    reads: "Validation outcome, artifact identity, prior unresolved evidence",
    produces: "Durable ev: identities and a human-readable projection",
    surface: "hadara evidence add-command",
    invariant: "New proof is appended; earlier failure is not erased.",
  },
  {
    number: "06",
    name: "Close",
    summary: "Proof-last",
    title: "Finish with a guarded proof-last transaction.",
    detail: "Close checks acceptance, current evidence, task and handoff state, applies bounded lifecycle writes, appends proof last, and succeeds only at closed-valid.",
    reads: "Current capsule, evidence, board projection, close plan",
    produces: "Closed-valid proof or a concrete recovery action",
    surface: "hadara task close --json",
    invariant: "Proof is appended last and closed-valid is terminal.",
  },
] as const;

function NativeDiagram({ kind }: { kind: NativeDiagramKind }) {
  const [selectedStage, setSelectedStage] = useState(0);

  if (kind === "operating-model") {
    return (
      <figure className="native-diagram operating-model" aria-labelledby="operating-model-title">
        <figcaption className="diagram-intro">
          <span>Responsibility and continuity</span>
          <strong id="operating-model-title">Intent enters once. Durable state carries the work forward.</strong>
          <p>Arrows show normal information flow. The lower return rail brings inspectable results back to the human.</p>
        </figcaption>
        <div className="operating-flow">
          <article className="flow-node human-node external-node">
            <span>Human</span>
            <strong>State intent and constraints</strong>
            <p>Initialize once, state intent, and review results.</p>
          </article>
          <div className="flow-connector" aria-hidden="true"><span>request</span><i /></div>
          <article className="flow-node agent-node">
            <span>Coding agent</span>
            <strong>Perform bounded engineering work</strong>
            <p>Read current state, implement, validate, and explain the outcome.</p>
          </article>
          <div className="flow-connector accent-connector" aria-hidden="true"><span>operate</span><i /></div>
          <article className="flow-node protocol-node focal-node">
            <span>HADARA protocol</span>
            <strong>Route and guard the lifecycle</strong>
            <p>Status, Task Capsules, validation, evidence, document routing, and close.</p>
          </article>
        </div>
        <div className="commit-drop" aria-hidden="true">
          <span>guarded write</span>
          <i />
        </div>
        <div className="authority-flow">
          <article className="authority-card projection-card external-node">
            <span>Human-readable projections</span>
            <strong>Inspect state without becoming the state machine</strong>
            <p>Status summaries, READ_MAP.md, EVIDENCE.md, and reports expose authority for review.</p>
          </article>
          <div className="authority-bridge" aria-hidden="true">
            <span>project</span><i />
          </div>
          <article className="authority-card canonical-card store-node">
            <span>Canonical project state</span>
            <strong>Durable authority by domain</strong>
            <p>Task contract, document registry, project capability, and append-only evidence remain with the repository.</p>
          </article>
        </div>
        <div className="review-rail">
          <span>Review</span>
          <i aria-hidden="true" />
          <p>Projections return results, evidence, blockers, and open questions to the human.</p>
        </div>
        <div className="diagram-legend" aria-label="Diagram role legend">
          <span><i className="legend-focal" />Protocol guard</span>
          <span><i className="legend-store" />Canonical store</span>
          <span><i className="legend-external" />Human or projection boundary</span>
        </div>
      </figure>
    );
  }

  const selected = lifecycleStages[selectedStage];
  return (
    <figure className="native-diagram lifecycle-diagram" aria-labelledby="lifecycle-diagram-title">
      <figcaption className="diagram-intro">
        <span>Agent-operated lifecycle</span>
        <strong id="lifecycle-diagram-title">Every stage leaves the next session a safer starting point.</strong>
        <p>Select a stage to inspect its responsibility. All stage names remain visible at once.</p>
      </figcaption>
      <div className="lifecycle-workbench">
        <div className="stage-rail" role="tablist" aria-orientation="horizontal" aria-label="HADARA lifecycle stages">
          {lifecycleStages.map((stage, index) => (
            <button
              type="button"
              role="tab"
              id={`lifecycle-tab-${stage.number}`}
              aria-controls="lifecycle-stage-detail"
              aria-selected={index === selectedStage}
              className={index === selectedStage ? "active" : undefined}
              onClick={() => setSelectedStage(index)}
              key={stage.name}
            >
              <span>{stage.number}</span>
              <span className="stage-label">
                <strong>{stage.name}</strong>
                <small>{stage.summary}</small>
              </span>
            </button>
          ))}
        </div>
        <article
          className="stage-detail"
          id="lifecycle-stage-detail"
          role="tabpanel"
          aria-labelledby={`lifecycle-tab-${selected.number}`}
        >
          <header className="stage-detail-copy">
            <span>Stage {selected.number} · {selected.name}</span>
            <h3>{selected.title}</h3>
            <p>{selected.detail}</p>
          </header>
          <div className="stage-contract">
            <div className="stage-io">
              <section>
                <strong>Reads</strong>
                <p>{selected.reads}</p>
              </section>
              <i aria-hidden="true" />
              <section>
                <strong>Produces</strong>
                <p>{selected.produces}</p>
              </section>
            </div>
            <section className="stage-surface">
              <strong>Agent protocol surface</strong>
              <code>{selected.surface}</code>
            </section>
          </div>
          <div className="stage-invariant">
            <span>Invariant</span>
            <strong>{selected.invariant}</strong>
          </div>
        </article>
      </div>
      <div className="persistence-band">
        <strong><span>Durable foundation</span>What survives between agent sessions</strong>
        <div className="persistence-path">
          <span>Task Board</span><i aria-hidden="true" />
          <span>TASK.md</span><i aria-hidden="true" />
          <span>Evidence</span><i aria-hidden="true" />
          <span>HANDOFF.md</span><i aria-hidden="true" />
          <span>Close proof</span>
        </div>
      </div>
      <div className="lifecycle-guarantee">
        <strong>Lifecycle guards</strong>
        <span><b>01</b>Failures stay visible</span>
        <span><b>02</b>Conflicts stop guarded writes</span>
        <span><b>03</b>Close succeeds only at closed-valid</span>
      </div>
    </figure>
  );
}

function DocBlockView({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="doc-prose">{renderInline(block.tokens)}</p>;
    case "code":
      return <CommandBlock command={block.code} variant="plain" />;
    case "image":
      return (
        <figure className="doc-figure">
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "table":
      return (
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                {block.header.map((cell, index) => (
                  <th key={index}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="doc-list" start={block.ordered ? block.start : undefined}>
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </Tag>
      );
    }
    case "subheading": {
      const Tag = block.level === 3 ? "h3" : "h4";
      return <Tag className={`doc-subheading doc-subheading-${block.level}`}>{renderInline(block.tokens)}</Tag>;
    }
    case "blockquote":
      return (
        <blockquote className="doc-quote">
          {block.blocks.map((child, index) => (
            <DocBlockView block={child} key={index} />
          ))}
        </blockquote>
      );
    case "divider":
      return <hr className="doc-divider" />;
    case "diagram":
      return <NativeDiagram kind={block.kind} />;
  }
}

export default function App() {
  const [activeId, setActiveId] = useState<PageId>(() => pageIdFromHash() ?? "home");
  const [theme, setTheme] = useState<Theme>(() => initialTheme());
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("principles");
  const readerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const active = pages.find((page) => page.id === activeId) ?? pages[0];
  const pageIndex = Math.max(0, pages.findIndex((page) => page.id === active.id));
  const nextPage = pages[(pageIndex + 1) % pages.length];
  const commandCopy = commandSectionCopy(active);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("hadara-docs-theme", theme);
    } catch {
      /* storage can be unavailable (private mode); the toggle still works for the session */
    }
  }, [theme]);

  // Hash is the single source of navigation truth: deep links, refresh, and
  // browser back/forward all resolve through it.
  useEffect(() => {
    const onHashChange = () => {
      const id = pageIdFromHash();
      if (!id) return; // in-page anchor (#commands, #principles): let the browser scroll
      setActiveId(id);
      readerRef.current?.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title =
      active.id === "home" ? "HADARA Documentation" : `${active.label} · HADARA Docs`;
  }, [active]);

  // "On this page" highlights whichever heading is the last one (in document
  // order) to have crossed a line a quarter of the way down the reader. This
  // is computed directly from element positions on every scroll tick rather
  // than through IntersectionObserver: two short, adjacent sections can both
  // sit inside an observer's trigger band at once, and which one "wins" then
  // depends on undefined entry-batch ordering instead of scroll position.
  useEffect(() => {
    setActiveAnchor("principles");
    const anchorIds = [
      "principles",
      ...(active.command ? ["commands"] : []),
      ...active.sections.map((section) => section.id),
    ];
    const reader = readerRef.current;
    if (!reader) return;

    const update = () => {
      if (reader.scrollTop + reader.clientHeight >= reader.scrollHeight - 4) {
        // A short final section can end well above the trigger line below —
        // scrolling to the bottom always means "reading the last section."
        setActiveAnchor(anchorIds[anchorIds.length - 1]);
        return;
      }
      const triggerY = reader.getBoundingClientRect().top + reader.clientHeight * 0.25;
      let current = anchorIds[0];
      for (const id of anchorIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= triggerY) current = id;
      }
      setActiveAnchor(current);
    };

    update();
    reader.addEventListener("scroll", update, { passive: true });
    return () => reader.removeEventListener("scroll", update);
  }, [active]);

  // Global shortcuts: "/" focuses search, Escape closes menu / clears search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "Escape") {
        if (menuOpen) setMenuOpen(false);
        else if (query) setQuery("");
        else searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, query]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return pages
      .filter((page) =>
        [
          page.label,
          page.short,
          page.title,
          page.lead,
          page.callout ?? "",
          page.searchText,
          ...page.cards.flatMap((card) => [card.title, card.body]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 5);
  }, [query]);

  const selectPage = (id: PageId) => {
    setActiveId(id);
    setMenuOpen(false);
    setQuery("");
    // Writing the hash records a history entry, so back/forward walk the docs.
    if (window.location.hash !== `#${id}`) {
      window.location.hash = id;
    }
    readerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site-stage">
      <a className="skip-link" href="#principles">
        Skip to content
      </a>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="site-shell">
        <aside id="docs-navigation" className={`sidebar ${menuOpen ? "is-open" : ""}`}>
          <div className="sidebar-top">
            <div className="brand-lockup">
              <div>
                <strong>HADARA</strong>
                <span>Documentation</span>
              </div>
            </div>
            <button
              type="button"
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={19} />
            </button>
          </div>

          <div className="search-wrap">
            <Search size={15} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchResults[0]) {
                  selectPage(searchResults[0].id);
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search docs..."
              aria-label="Search documentation"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} />
              </button>
            ) : (
              <kbd aria-hidden="true">/</kbd>
            )}
            {searchFocused && query && (
              <div className="search-popover">
                <span className="result-count">
                  {searchResults.length === 0
                    ? "No matching pages"
                    : searchResults.length === 1
                      ? "1 matching page"
                      : `${searchResults.length} matching pages`}
                </span>
                {searchResults.map((result) => {
                  const ResultIcon = result.icon;
                  return (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectPage(result.id)}
                    >
                      <ResultIcon size={15} />
                      <span>
                        <strong>{result.label}</strong>
                        <small>{result.short}</small>
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <nav className="docs-nav" aria-label="Documentation navigation">
            {groups.filter((group) => pages.some((page) => page.group === group)).map((group) => (
              <div className="nav-group" key={group}>
                <p>{group}</p>
                {pages
                  .filter((page) => page.group === group)
                  .map((page) => {
                    const Icon = page.icon;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        className={activeId === page.id ? "active" : ""}
                        onClick={() => selectPage(page.id)}
                        aria-current={activeId === page.id ? "page" : undefined}
                      >
                        <span className="nav-icon">
                          <Icon size={16} strokeWidth={1.7} />
                        </span>
                        <span>{page.label}</span>
                        <ChevronRight size={14} className="nav-chevron" />
                      </button>
                    );
                  })}
              </div>
            ))}
          </nav>

          <div className="source-card">
            <span className="source-icon">
              <Code2 size={16} />
            </span>
            <div>
              <strong>{hadaraVersion ? `HADARA v${hadaraVersion}` : "Markdown is canonical"}</strong>
              <span>
                Updated{" "}
                {new Date(docsUpdatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="source-status">SYNCED</span>
          </div>
        </aside>

        {menuOpen && (
          <button
            className="sidebar-scrim"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <section className="main-column">
          <header className="topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="menu-button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                aria-controls="docs-navigation"
              >
                <Menu size={18} />
              </button>
              <span>Docs</span>
              <ChevronRight size={13} />
              <strong>{active.label}</strong>
            </div>
            <div className="topbar-actions">
              <a
                href="https://github.com/ictseoyoungmin/HADARA"
                target="_blank"
                rel="noreferrer"
                aria-label="HADARA on GitHub"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <button
                type="button"
                className="theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <span className="theme-icon">
                  {theme === "dark" ? <MoonStar size={15} /> : <SunMedium size={15} />}
                </span>
                <span>{theme === "dark" ? "Dark" : "Light"}</span>
              </button>
            </div>
          </header>

          <section className="reader" ref={readerRef}>
           <div className="reader-grid">
            <article className="paper" key={active.id}>
              <div className="paper-ornament ornament-top" aria-hidden="true" />
              <div className="paper-ornament ornament-bottom" aria-hidden="true" />

              <div className="doc-progress">
                <span>{String(pageIndex + 1).padStart(2, "0")}</span>
                <i />
                <span>{String(pages.length).padStart(2, "0")}</span>
              </div>

              <header className="article-hero">
                <div className="eyebrow">
                  <Sparkles size={13} />
                  {active.eyebrow}
                </div>
                <h1>
                  {active.title.split("\n").map((line, index) => (
                    <span key={index}>{line}</span>
                  ))}
                </h1>
                <p className="lead">{active.lead}</p>

                {active.id === "home" && (
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="primary-action"
                      onClick={() => selectPage("getting-started")}
                    >
                      Get started <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="secondary-action"
                      onClick={() => selectPage("workflow")}
                    >
                      View lifecycle
                    </button>
                  </div>
                )}
              </header>

              {active.callout && (
                <div className="ink-callout">
                  <PackageCheck size={19} />
                  <p>{active.callout}</p>
                </div>
              )}

              <section className="content-section" id="principles">
                <div className="section-heading">
                  <span>Overview</span>
                  <h2>{active.id === "home" ? "Roles at a glance" : "Three points to keep"}</h2>
                </div>
                <div className="principle-grid">
                  {active.cards.map((card, index) => (
                    <article
                      className="principle-card"
                      key={card.title}
                      style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
                    >
                      <span>{card.kicker}</span>
                      <h3>{renderInline(card.titleTokens)}</h3>
                      <p>{renderInline(card.bodyTokens)}</p>
                      <i aria-hidden="true" />
                    </article>
                  ))}
                </div>
              </section>

              {active.command && (
                <section className="content-section command-section" id="commands">
                  <div className="section-heading">
                    <span>{commandCopy.eyebrow}</span>
                    <h2>{commandCopy.title}</h2>
                    <p>{commandCopy.detail}</p>
                  </div>
                  <CommandBlock command={active.command} />
                </section>
              )}

              {active.sections.map((section) => (
                <section className="content-section" id={section.id} key={section.id}>
                  <div className="section-heading">
                    <h2>{renderInline(section.headingTokens)}</h2>
                  </div>
                  {section.blocks.map((block, index) => (
                    <DocBlockView block={block} key={index} />
                  ))}
                </section>
              ))}

              {active.id === "home" && (
                <section className="lifecycle-strip" aria-label="HADARA lifecycle">
                  {["Orient", "Capsule", "Execute", "Evidence", "Close"].map(
                    (step, index) => (
                      <div key={step}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{step}</strong>
                        {index < 4 && <ArrowRight size={14} />}
                      </div>
                    ),
                  )}
                </section>
              )}

              <footer className="next-doc">
                <div>
                  <span>Continue reading</span>
                  <strong>{nextPage.label}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => selectPage(nextPage.id)}
                  aria-label={`Open ${nextPage.label}`}
                >
                  <ArrowRight size={18} />
                </button>
              </footer>
            </article>

            <aside className="on-this-page">
              <p>On this page</p>
              <a href="#principles" className={activeAnchor === "principles" ? "active" : undefined}>
                  <span className="toc-dot" /> Overview
              </a>
              {active.command && (
                <a href="#commands" className={activeAnchor === "commands" ? "active" : undefined}>
                  <span className="toc-dot" /> {commandCopy.nav}
                </a>
              )}
              {active.sections.map((section) => (
                <a
                  href={`#${section.id}`}
                  className={activeAnchor === section.id ? "active" : undefined}
                  key={section.id}
                >
                  <span className="toc-dot" /> {section.heading.replace(/[`*_~]/g, "")}
                </a>
              ))}
              <div className="read-state">
                <BookOpen size={14} />
                <span>
                  Reading path
                  <strong>
                    {pageIndex + 1} of {pages.length}
                  </strong>
                </span>
              </div>
            </aside>
           </div>
          </section>
        </section>
      </div>
    </main>
  );
}

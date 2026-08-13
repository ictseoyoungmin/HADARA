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
import { pageContent, type DocContent, type DocBlock, type PageId } from "./docs-content";
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
  "shield-check": ShieldCheck,
  "folder-tree": FolderTree,
  "git-branch": GitBranch,
  "clipboard-check": ClipboardCheck,
};

const pages: DocPage[] = pageContent.map((page) => ({
  ...page,
  icon: iconMap[page.icon] ?? BookOpen,
}));

const groups = ["Start here", "Core model", "CLI Reference", "Reference"] as const;

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

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span>H</span>
      <i />
    </div>
  );
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
        return (
          <a key={index} href={link.href} target="_blank" rel="noreferrer">
            {renderInline(link.tokens)}
          </a>
        );
      }
      case "br":
        return <br key={index} />;
      default:
        return <span key={index}>{"text" in token ? token.text : ""}</span>;
    }
  });
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
                  <th key={index}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
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
        <Tag className="doc-list">
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </Tag>
      );
    }
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
              <BrandMark />
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
            {groups.map((group) => (
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
                      Start with doctor <ArrowRight size={15} />
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
                  <span>Path</span>
                  <h2>
                    {active.id === "home"
                      ? "The shortest useful path"
                      : "What this page establishes"}
                  </h2>
                </div>
                <div className="principle-grid">
                  {active.cards.map((card, index) => (
                    <article
                      className="principle-card"
                      key={card.title}
                      style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
                    >
                      <span>{card.kicker}</span>
                      <h3>{card.title}</h3>
                      <p>{card.body}</p>
                      <i aria-hidden="true" />
                    </article>
                  ))}
                </div>
              </section>

              {active.command && (
                <section className="content-section command-section" id="commands">
                  <div className="section-heading">
                    <span>Command surface</span>
                    <h2>Keep the next action explicit</h2>
                    <p>
                      Commands remain copyable and reviewable; the documentation never executes
                      them for you.
                    </p>
                  </div>
                  <CommandBlock command={active.command} />
                </section>
              )}

              {active.sections.map((section) => (
                <section className="content-section" id={section.id} key={section.id}>
                  <div className="section-heading">
                    <h2>{section.heading}</h2>
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
                <span /> Overview
              </a>
              {active.command && (
                <a href="#commands" className={activeAnchor === "commands" ? "active" : undefined}>
                  <span /> Commands
                </a>
              )}
              {active.sections.map((section) => (
                <a
                  href={`#${section.id}`}
                  className={activeAnchor === section.id ? "active" : undefined}
                  key={section.id}
                >
                  <span /> {section.heading}
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

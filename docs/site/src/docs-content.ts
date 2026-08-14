import { marked, type Token, type Tokens } from "marked";

// Every `.md` file here becomes a page automatically — no code changes needed
// to add or remove one, only frontmatter `order` controls where it lands.
const sources = import.meta.glob("../content/docs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Referenced by bare filename in markdown (`![alt](two-supported-work-styles.png)`),
// resolved against the real Vite-hashed asset URL so the build pipeline handles it.
const images = import.meta.glob("../content/images/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolveImage(href: string): string {
  const match = Object.entries(images).find(([path]) => path.endsWith(`/${href}`));
  return match?.[1] ?? href;
}

export type PageId = string;

export type PageGroup = "Start here" | "Core model" | "Setup reference" | "Agent protocol" | "Reference";
export type PageAudience = "human" | "shared" | "agent-protocol";
export type CommandAudience = "human" | "agent-protocol";
export type NativeDiagramKind = "operating-model" | "agent-lifecycle";

export type DocBlock =
  | { type: "paragraph"; tokens: Token[] }
  | { type: "code"; language: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; header: Token[][]; rows: Token[][][] }
  | { type: "list"; ordered: boolean; start?: number; items: Token[][] }
  | { type: "subheading"; level: 3 | 4; tokens: Token[] }
  | { type: "blockquote"; blocks: DocBlock[] }
  | { type: "divider" }
  | { type: "diagram"; kind: NativeDiagramKind };

export type DocSection = { id: string; heading: string; headingTokens: Token[]; blocks: DocBlock[] };

export type DocContent = {
  id: PageId;
  group: PageGroup;
  label: string;
  short: string;
  icon?: string;
  audience: PageAudience;
  eyebrow: string;
  title: string;
  lead: string;
  callout?: string;
  command?: string;
  commandAudience?: CommandAudience;
  order: number;
  searchText: string;
  cards: Array<{
    kicker: string;
    title: string;
    body: string;
    titleTokens: Token[];
    bodyTokens: Token[];
  }>;
  sections: DocSection[];
};

function parseFrontmatter(source: string) {
  // Normalize CRLF so a Windows checkout can't silently break the parser.
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Documentation page is missing frontmatter");

  const meta = Object.fromEntries(
    match[1]
      .split("\n")
      .filter((line) => line.includes(":"))
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );

  return { meta, body: match[2] };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** marked's `Token` union includes an escape-hatch `Generic` variant whose
 * `tokens` field is optional, which keeps TS from narrowing `.tokens` to a
 * plain array on the concrete token types we actually get back. We never
 * register custom extensions, so this is always safe. */
function tokensOf(token: Token): Token[] {
  return "tokens" in token && token.tokens ? token.tokens : [];
}

/** `![alt](src)` immediately followed by `*caption*` on the next line has no
 * blank line between them, so marked tokenizes both into ONE paragraph's
 * inline tokens (image, then a lone newline text token, then the caption's
 * `em` token) rather than two separate paragraphs. */
function paragraphImageBlock(paragraph: Tokens.Paragraph): DocBlock | null {
  const inline = paragraph.tokens;
  if (inline[0]?.type !== "image") return null;
  const image = inline[0] as Tokens.Image;
  const rest = inline.slice(1).filter((token) => !(token.type === "text" && !token.text.trim()));
  const caption = rest.length === 1 && rest[0].type === "em" ? (rest[0] as Tokens.Em).text : undefined;
  return { type: "image", src: resolveImage(image.href), alt: image.text, caption };
}

/** List items are block-level; pull out the inline tokens editors actually write. */
function inlineTokensOfListItem(item: Tokens.ListItem): Token[] {
  const text = item.tokens.find((token): token is Tokens.Text => token.type === "text");
  return text ? tokensOf(text) : item.tokens;
}

function buildBlocks(tokens: Token[]): DocBlock[] {
  const blocks: DocBlock[] = [];
  for (const token of tokens) {
    if (token.type === "space" || token.type === "heading") continue;

    if (token.type === "paragraph") {
      const image = paragraphImageBlock(token as Tokens.Paragraph);
      if (image) {
        blocks.push(image);
        continue;
      }
      blocks.push({ type: "paragraph", tokens: tokensOf(token) });
    } else if (token.type === "code") {
      if (token.lang === "hadara-diagram") {
        const kind = token.text.trim();
        if (kind !== "operating-model" && kind !== "agent-lifecycle") {
          throw new Error(`Unknown HADARA diagram kind "${kind}"`);
        }
        blocks.push({ type: "diagram", kind });
      } else {
        blocks.push({ type: "code", language: token.lang ?? "text", code: token.text });
      }
    } else if (token.type === "table") {
      blocks.push({
        type: "table",
        header: token.header.map((cell: Tokens.TableCell) => cell.tokens),
        rows: token.rows.map((row: Tokens.TableCell[]) => row.map((cell) => cell.tokens)),
      });
    } else if (token.type === "list") {
      blocks.push({
        type: "list",
        ordered: token.ordered,
        start: typeof token.start === "number" ? token.start : undefined,
        items: token.items.map(inlineTokensOfListItem),
      });
    } else if (token.type === "heading" && (token.depth === 3 || token.depth === 4)) {
      blocks.push({ type: "subheading", level: token.depth, tokens: tokensOf(token) });
    } else if (token.type === "blockquote") {
      blocks.push({ type: "blockquote", blocks: buildBlocks(token.tokens ?? []) });
    } else if (token.type === "hr") {
      blocks.push({ type: "divider" });
    }
  }
  return blocks;
}

/** Groups markdown that follows the required hero/cards/command block into
 * free-form sections, split on H2 headings. This is the extensible half of
 * the content contract — everything above stays a fixed 3-card + 1-command
 * shape (enforced by tests/content-contract.test.mjs); everything an author
 * writes after that shell block can be arbitrary prose/code/image/table/list,
 * one section per `## Heading`. */
function buildSections(markdown: string): DocSection[] {
  if (!markdown.trim()) return [];
  const tokens = marked.lexer(markdown);
  const sections: DocSection[] = [];
  let current: { heading: string; headingTokens: Token[]; tokens: Token[] } | null = null;

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 2) {
      if (current) {
        sections.push({
          id: slugify(current.heading),
          heading: current.heading,
          headingTokens: current.headingTokens,
          blocks: buildBlocks(current.tokens),
        });
      }
      current = { heading: token.text, headingTokens: tokensOf(token), tokens: [] };
    } else if (current) {
      current.tokens.push(token);
    }
  }
  if (current) {
    sections.push({
      id: slugify(current.heading),
      heading: current.heading,
      headingTokens: current.headingTokens,
      blocks: buildBlocks(current.tokens),
    });
  }
  return sections;
}

function parsePage(source: string): DocContent {
  const { meta, body } = parseFrontmatter(source);
  const commandMatch = body.match(/```(?:shell|sh|bash)\n([\s\S]*?)```/);
  const command = commandMatch?.[1].trim();
  const cards = Array.from(
    body.matchAll(/^## (?!Commands$)(.+)\n### (.+)\n([^\n]+)(?=\n\n## |\n\n```|$)/gm),
    (match) => ({
      kicker: match[1].trim(),
      title: match[2].trim(),
      body: match[3].trim(),
      titleTokens: marked.Lexer.lexInline(match[2].trim()),
      bodyTokens: marked.Lexer.lexInline(match[3].trim()),
    }),
  );

  if (cards.length !== 3)
    throw new Error(`Expected three documentation cards for "${meta.id}", found ${cards.length}`);

  // The three hero cards are presentation metadata. Everything after the
  // third card remains article content, whether or not that page has a shell
  // transcript. Concept pages intentionally do not need a command block.
  const cardMatches = Array.from(body.matchAll(/^## (?!Commands$)(.+)\n### (.+)\n([^\n]+)(?=\n\n## |\n\n```|$)/gm));
  const afterCards = cardMatches[2] ? body.slice((cardMatches[2].index ?? 0) + cardMatches[2][0].length) : body;
  const trailingMarkdown = commandMatch ? afterCards.replace(commandMatch[0], "") : afterCards;

  return {
    id: meta.id as PageId,
    group: meta.group as PageGroup,
    label: meta.label,
    short: meta.short,
    icon: meta.icon,
    audience: (meta.audience as PageAudience | undefined) ?? "shared",
    eyebrow: meta.eyebrow,
    title: meta.title.replace(/\\n/g, "\n"),
    lead: meta.lead,
    callout: meta.callout,
    command,
    commandAudience: command
      ? ((meta.commandAudience as CommandAudience | undefined) ??
        (meta.audience === "human" ? "human" : "agent-protocol"))
      : undefined,
    order: Number(meta.order),
    searchText: body,
    cards,
    sections: buildSections(trailingMarkdown),
  };
}

export const pageContent = Object.values(sources).map(parsePage).sort((a, b) => a.order - b.order);

/**
 * Content contract test.
 *
 * The interface renders each markdown page through a strict contract
 * (src/docs-content.ts). This test enforces the same contract directly on the
 * files, so an authoring mistake fails `npm test` in CI instead of throwing at
 * runtime in a visitor's browser. Runs on plain Node — no build required.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "docs");
const GROUPS = new Set(["Start here", "Core model", "Setup reference", "Agent protocol", "Reference"]);
const AUDIENCES = new Set(["human", "shared", "agent-protocol", "release-operator"]);
const ICONS = new Set([
  "compass",
  "rocket",
  "orbit",
  "workflow",
  "boxes",
  "file-check",
  "shield-check",
  "folder-tree",
  "git-branch",
  "clipboard-check",
]);
const IMAGES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "images");
const REQUIRED_META = ["id", "group", "label", "short", "eyebrow", "title", "lead", "audience", "order"];

function parse(source, file) {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `${file}: missing frontmatter`);
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

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
const parsed = files.map((file) => ({
  file,
  ...parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"), file),
}));

test("every page carries the full frontmatter contract", () => {
  for (const { file, meta } of parsed) {
    for (const key of REQUIRED_META) {
      assert.ok(meta[key]?.length, `${file}: frontmatter "${key}" is missing or empty`);
    }
    assert.ok(GROUPS.has(meta.group), `${file}: unknown group "${meta.group}"`);
    if (meta.icon) assert.ok(ICONS.has(meta.icon), `${file}: unknown icon "${meta.icon}" (would fall back silently)`);
    assert.ok(AUDIENCES.has(meta.audience), `${file}: unknown audience "${meta.audience}"`);
    assert.ok(Number.isFinite(Number(meta.order)), `${file}: order must be numeric`);
  }
});

test("ids match filenames and are unique; orders are unique", () => {
  const ids = new Set();
  const orders = new Set();
  for (const { file, meta } of parsed) {
    assert.equal(meta.id, path.basename(file, ".md"), `${file}: id must match the filename`);
    assert.ok(!ids.has(meta.id), `duplicate id "${meta.id}"`);
    assert.ok(!orders.has(meta.order), `duplicate order ${meta.order} (${file})`);
    ids.add(meta.id);
    orders.add(meta.order);
  }
});

test("every page has exactly three cards in the ## kicker / ### title / body shape", () => {
  for (const { file, body } of parsed) {
    const cards = Array.from(body.matchAll(/^## (?!Commands$)(.+)\n### (.+)\n([^\n]+)/gm));
    assert.equal(cards.length, 3, `${file}: expected 3 cards, found ${cards.length}`);
    for (const card of cards) {
      assert.ok(card[3].trim().length >= 20, `${file}: card "${card[2].trim()}" body is too thin`);
    }
  }
});

test("agent protocol pages have a non-empty command transcript", () => {
  for (const { file, body } of parsed) {
    const { meta } = parsed.find((entry) => entry.file === file);
    if (meta.audience !== "agent-protocol" && meta.audience !== "release-operator") continue;
    const match = body.match(/```(?:shell|sh|bash)\n([\s\S]*?)```/);
    assert.ok(match, `${file}: agent-facing page expected at least one shell block`);
    assert.ok(match[1].trim().length > 0, `${file}: agent-facing command block is empty`);
  }
});

test("public docs do not teach removed routing or lifecycle commands", () => {
  const stale = [/hadara context pack/, /hadara task finish/, /hadara task ready/, /hadara task audit-close/, /--profile standard/];
  for (const { file, meta, body } of parsed) {
    for (const pattern of stale) assert.doesNotMatch(body, pattern, `${file}: stale public command ${pattern}`);
    if (meta.audience === "agent-protocol") assert.match(body, /agent/i, `${file}: agent page must name the agent boundary`);
  }
});

test("titles reserve \\n for intentional line breaks only", () => {
  for (const { file, meta } of parsed) {
    const lines = meta.title.split("\\n");
    assert.ok(lines.length <= 2, `${file}: title has more than one manual line break`);
    for (const line of lines) assert.ok(line.trim().length, `${file}: empty title line`);
  }
});

test("every image reference resolves to a file under content/images/", () => {
  const available = new Set(fs.readdirSync(IMAGES_DIR));
  for (const { file, body } of parsed) {
    for (const match of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const filename = match[1];
      assert.ok(available.has(filename), `${file}: image "${filename}" not found in content/images/`);
    }
  }
});

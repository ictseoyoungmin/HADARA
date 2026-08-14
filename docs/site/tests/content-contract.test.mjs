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
const AUDIENCES = new Set(["human", "shared", "agent-protocol"]);
const COMMAND_AUDIENCES = new Set(["human", "agent-protocol"]);
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
    if (meta.audience !== "agent-protocol") continue;
    const match = body.match(/```(?:shell|sh|bash)\n([\s\S]*?)```/);
    assert.ok(match, `${file}: agent-facing page expected at least one shell block`);
    assert.ok(match[1].trim().length > 0, `${file}: agent-facing command block is empty`);
  }
});

test("every shell transcript declares who normally executes it", () => {
  for (const { file, meta, body } of parsed) {
    const hasCommand = /```(?:shell|sh|bash)\n[\s\S]*?```/.test(body);
    if (!hasCommand) continue;
    assert.ok(COMMAND_AUDIENCES.has(meta.commandAudience), `${file}: missing or invalid commandAudience`);
  }
});

test("public docs do not teach removed routing or lifecycle commands", () => {
  const stale = [
    /hadara context pack/,
    /hadara task finish/,
    /hadara task ready/,
    /hadara task audit-close/,
    /task finalize/,
    /--profile standard/,
  ];
  for (const { file, meta, body } of parsed) {
    for (const pattern of stale) assert.doesNotMatch(body, pattern, `${file}: stale public command ${pattern}`);
    if (meta.audience === "agent-protocol") assert.match(body, /agent/i, `${file}: agent page must name the agent boundary`);
  }
});

test("public information architecture explains protocol and recovery without release-control claims", () => {
  const ids = new Set(parsed.map(({ meta }) => meta.id));
  assert.ok(ids.has("project-protocol-files"), "missing Project Protocol Files page");
  assert.ok(ids.has("limits-and-recovery"), "missing user-facing Limits & Recovery page");
  assert.ok(!ids.has("approval-boundaries"), "general external-action approval is not a HADARA public product surface");
  assert.ok(!ids.has("release-boundaries"), "release-operator internals must not be a public docs page");

  const protocolPage = parsed.find(({ meta }) => meta.id === "project-protocol-files");
  for (const required of ["AGENTS.md", "HADARA_WORKFLOW.md", "TASK_BOARD.md", "READ_MAP.md", "TASK.md", "HANDOFF.md"]) {
    assert.match(protocolPage.body, new RegExp(required.replace(".", "\\.")), `protocol page must explain ${required}`);
  }

  const publicCopy = parsed.map(({ meta, body }) => `${Object.values(meta).join("\n")}\n${body}`).join("\n");
  for (const releaseControlClaim of [
    /release gates/i,
    /silently publishing/i,
    /permission to publish/i,
    /approval boundaries/i,
    /external authority/i,
    /release platform/i,
    /registries, deployments, messages, payments/i,
  ]) {
    assert.doesNotMatch(publicCopy, releaseControlClaim, `public copy claims release or external-action control: ${releaseControlClaim}`);
  }
});

test("onboarding explains preset effects, agent connection, real outputs, and recovery routes", () => {
  const byId = Object.fromEntries(parsed.map((entry) => [entry.meta.id, entry]));
  for (const preset of ["minimal", "standard", "governed"]) {
    assert.ok(byId["cli-init"].body.includes(`| \`${preset}\``), `init reference must explain ${preset}`);
  }
  for (const artifact of ["AGENTS.md", ".hadara/project.json", ".hadara/documents.json", "READ_MAP.md", "TASK_BOARD.md"]) {
    assert.ok(byId["getting-started"].body.includes(artifact), `getting started must explain ${artifact}`);
  }
  assert.match(byId["getting-started"].body, /## What init creates[\s\S]*## After init/);
  assert.doesNotMatch(byId["getting-started"].body, /--preset|--plan-hash|--adopt|init upgrade/);
  assert.equal(byId["cli-init"].meta.label, "Init Reference");
  assert.match(byId["cli-init"].meta.lead, /Getting Started owns the plain interactive path/);
  assert.match(byId["cli-init"].body, /--preset minimal/);
  assert.match(byId["cli-init"].body, /--plan-hash/);
  assert.match(byId["cli-init"].body, /--adopt/);
  assert.doesNotMatch(parsed.map((entry) => entry.body).join("\n"), /hadara init upgrade/);
  assert.match(byId["what-is-hadara"].body, /Any agent runtime that discovers `AGENTS\.md`/);
  assert.match(byId["task-capsules"].body, /# T-0042 Fix retry backoff/);
  assert.match(byId.evidence.body, /Failed \/ Blocked \/ Residual Evidence/);
  for (const link of ["#evidence", "#limits-and-recovery"]) {
    assert.ok(byId.home.body.includes(`(${link})`), `home must route to ${link}`);
  }
  assert.equal(byId.workflow.meta.group, "Core model");
  assert.equal(byId.workflow.meta.audience, "shared");
});

test("public projection docs preserve current-build lineage and controlled relationships", () => {
  const byId = Object.fromEntries(parsed.map((entry) => [entry.meta.id, entry]));
  const protocol = byId["project-protocol-files"].body;
  for (const term of ["Document`, `Read Policy`, and `Status", "readTier", "readFirst", "doNotReadByDefault", "Close Summary"]) {
    assert.ok(protocol.includes(term), `protocol docs must distinguish or trace ${term}`);
  }
  assert.match(protocol, /`Targets`[\s\S]*supplied when the capsule is created/);
  assert.match(protocol, /`Result`[\s\S]*During close/);

  const evidence = byId.evidence.body;
  for (const field of ["command preview", "argvHash", "exitCode", "durationMs", "stdoutHash", "stderrHash"]) {
    assert.ok(evidence.includes(field), `evidence docs must represent generated validation density: ${field}`);
  }
  assert.match(evidence, /Human-readable[\s\S]*reviewable Markdown/);

  const capsules = byId["task-capsules"].body;
  assert.match(capsules, /## `TASK\.md`: the complete bounded work contract/);
  assert.match(capsules, /### Complete `TASK\.md` example/);
  assert.match(capsules, /### Complete `HANDOFF\.md` example/);
  assert.match(capsules, /^## Close Summary$/m);
  assert.doesNotMatch(capsules, /deliberately abridged|matching excerpt|omits only/i);
  assert.match(capsules, /\| Status \| Draft \|/);
  assert.match(capsules, /\| Existing request API \| constraint \| active \|/);
  assert.match(capsules, /\| 2026-08-14 \| Done \| Completed required validation and prepared close sources\. \|/);
  assert.match(capsules, /TASK and HANDOFF identities become `Done`[\s\S]*Task Board row becomes `Done`[\s\S]*`Result` receives the exact `Close Summary`/);
  for (const section of ["Identity", "Goal", "Scope", "Plan", "Acceptance", "Validation", "Inputs / Constraints", "Changes", "Risks / Follow-ups", "Close Summary", "History"]) {
    assert.ok(capsules.includes(`\`${section}\``) || capsules.includes(`| ${section} |`), `task capsule docs must include actual TASK section ${section}`);
  }
  for (const section of ["Last Completed", "Pre-Close Operator Action", "Post-Close Continuation", "Carry Forward Warnings"]) {
    assert.ok(capsules.includes(`\`${section}\``) || capsules.includes(`| ${section} |`), `task capsule docs must include actual HANDOFF section ${section}`);
  }
  assert.match(capsules, /\| ID \| Criterion \| State \| Evidence \| Reference \|/);
  assert.match(capsules, /\| Check \| Gate \| Status \| Detail \| Evidence \|/);
  assert.match(capsules, /\| Step \| Disposition \| Create Task \| Reason \| Required Reading \|/);
  assert.match(capsules, /`evidence\.jsonl` is zero-byte/);
  assert.match(capsules, /\| T-0042 \| Fix retry backoff \| Draft \| project \| tasks\/T-0042-fix-retry-backoff \| - \|/);
  assert.match(capsules, /\| `actionable` \| `yes` \|/);
  assert.match(capsules, /\| `waiting-for-operator` \| `no` \|/);
  assert.match(capsules, /`Create Task=yes` is valid only with `actionable`/);
  assert.match(capsules, /Pre-Close Operator Action` must already be `terminal\/no`/);
});

test("complete agent lifecycle traces mark the implementation-work interval", () => {
  const byId = Object.fromEntries(parsed.map((entry) => [entry.meta.id, entry]));
  const marker = "# Agent implementation work: update source, tests, and task-owned docs inside the capsule.";
  const followingCommand = {
    home: "hadara validation run",
    workflow: "hadara validation run",
    "cli-task-lifecycle": "hadara task close",
  };

  for (const [id, nextCommand] of Object.entries(followingCommand)) {
    const shellBlock = byId[id].body.match(/```shell\n([\s\S]*?)```/)?.[1];
    assert.ok(shellBlock, `${id} must include a shell trace`);
    assert.ok(shellBlock.includes(marker), `${id} must label the implementation-work interval`);
    assert.ok(shellBlock.indexOf("hadara task create") < shellBlock.indexOf(marker), `${id} marker must follow task create`);
    assert.ok(shellBlock.indexOf(marker) < shellBlock.indexOf(nextCommand), `${id} marker must precede ${nextCommand}`);
  }
});

test("lifecycle narrative and atomic task-command reference remain distinct", () => {
  const byId = Object.fromEntries(parsed.map((entry) => [entry.meta.id, entry]));
  const workflow = byId.workflow;
  const taskCommands = byId["cli-task-lifecycle"];
  const publicCopy = parsed.map((entry) => entry.body).join("\n");

  assert.equal(workflow.meta.label, "Lifecycle Workflow");
  assert.match(workflow.meta.lead, /end-to-end narrative/);
  for (const stage of ["orient", "contract", "implement", "validate", "evidence", "close"]) {
    assert.match(`${workflow.meta.lead}\n${workflow.body}`, new RegExp(stage, "i"), `workflow must own the ${stage} stage narrative`);
  }

  assert.equal(taskCommands.meta.label, "Task Commands");
  assert.match(taskCommands.meta.lead, /atomic command reference, not a second lifecycle narrative/);
  assert.match(taskCommands.body, /deliberately narrows its scope to the three task-state command atoms/);
  assert.doesNotMatch(publicCopy, /context graph --task T-XXXX --json/);
  assert.doesNotMatch(publicCopy, /removed public `context pack` routing/);
});

test("supported work styles uses a delivery-sized WebP", () => {
  const webp = path.join(IMAGES_DIR, "two-supported-work-styles.webp");
  assert.ok(fs.existsSync(webp), "optimized supported-work-styles WebP is missing");
  assert.ok(fs.statSync(webp).size < 400_000, "supported-work-styles WebP must remain below 400 KB");
  assert.ok(!fs.existsSync(path.join(IMAGES_DIR, "two-supported-work-styles.png")), "unreferenced 2 MB PNG must not return");
  assert.match(parsed.find(({ meta }) => meta.id === "what-is-hadara").body, /two-supported-work-styles\.webp/);
});

test("native diagram markers replace legacy SVG diagrams", () => {
  const allBody = parsed.map(({ body }) => body).join("\n");
  assert.match(allBody, /```hadara-diagram\noperating-model\n```/, "missing native operating model diagram");
  assert.match(allBody, /```hadara-diagram\nagent-lifecycle\n```/, "missing native lifecycle diagram");
  assert.equal((allBody.match(/```hadara-diagram\noperating-model\n```/g) ?? []).length, 1, "operating model diagram should have one narrative owner");
  assert.doesNotMatch(allBody, /hadara-(?:operating-model|lifecycle)\.svg/, "legacy SVG diagram reference remains");
});

test("page chrome hides audience metadata while native diagrams expose hardened semantics", () => {
  const appSource = fs.readFileSync(path.join(CONTENT_DIR, "..", "..", "src", "App.tsx"), "utf8");
  const cssSource = fs.readFileSync(path.join(CONTENT_DIR, "..", "..", "src", "globals.css"), "utf8");
  assert.doesNotMatch(appSource, /audience-badge/, "audience metadata must not render as a page badge");
  assert.doesNotMatch(appSource, /BrandMark|brand-mark/, "sidebar brand must not render a separate emblem");
  assert.doesNotMatch(cssSource, /brand-mark/, "removed sidebar emblem styles must not remain");
  assert.match(appSource, /<strong>HADARA<\/strong>[\s\S]*<span>Documentation<\/span>/, "text-only brand lockup must remain");
  for (const semantic of ["guarded write", "Agent protocol surface", "Invariant", "Lifecycle guards", "Durable foundation"]) {
    assert.match(appSource, new RegExp(semantic, "i"), `native diagrams must expose ${semantic}`);
  }
});

test("public copy avoids generation labels and duplicated page ownership", () => {
  const byId = Object.fromEntries(parsed.map((entry) => [entry.meta.id, entry]));
  const publicCopy = parsed.map(({ meta, body }) => `${Object.values(meta).join("\n")}\n${body}`).join("\n");

  for (const internalTerm of [
    "Init v1",
    "Evidence v2",
    "presetOrigin",
    "HANDOFF_CONTINUATION_SEMANTIC_CONFLICT",
    "current built CLI",
    "legacy --result",
  ]) {
    assert.doesNotMatch(publicCopy, new RegExp(internalTerm, "i"), `public copy exposes internal generation vocabulary: ${internalTerm}`);
  }

  assert.doesNotMatch(byId["cli-init"].body, /AGENTS\.md|TASK_BOARD\.md|READ_MAP\.md/, "Init Reference must not repeat Getting Started's core-file inventory");
  assert.match(byId["getting-started"].body, /AGENTS\.md[\s\S]*TASK_BOARD\.md/);
  assert.match(byId["what-is-hadara"].body, /Start with the human path[\s\S]*Getting Started/);
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

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * The one place the deployed URL lives. Used for the canonical link, Open
 * Graph tags (og:image must be absolute), robots.txt, and sitemap.xml.
 * Change this if the repository name or domain changes.
 */
const SITE_URL = "https://ictseoyoungmin.github.io/HADARA";

const configDir = new URL(".", import.meta.url);

// The site is absorbed under HADARA-dev/docs/site/, so the repository root
// package is the single source for the displayed HADARA version.
function readHadaraVersion(): string | null {
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", configDir), "utf-8"));
  return typeof pkg.version === "string" ? pkg.version : null;
}

function readDocsUpdatedAt(): string {
  try {
    return execSync("git log -1 --format=%cI -- .", { cwd: fileURLToPath(configDir) })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString();
  }
}

const metaModuleId = "virtual:hadara-meta";
const resolvedMetaModuleId = "\0" + metaModuleId;

/** Exposes readHadaraVersion()/readDocsUpdatedAt() to client code as a virtual
 * module. Using `define` here doesn't work: Vite 7 only substitutes `define`
 * keys for client code at build time, not in dev, so the identifiers would be
 * undefined at runtime while `npm run dev` is running. */
function hadaraMeta(): Plugin {
  return {
    name: "hadara-meta",
    resolveId(id) {
      if (id === metaModuleId) return resolvedMetaModuleId;
    },
    load(id) {
      if (id === resolvedMetaModuleId) {
        return [
          `export const hadaraVersion = ${JSON.stringify(readHadaraVersion())};`,
          `export const docsUpdatedAt = ${JSON.stringify(readDocsUpdatedAt())};`,
        ].join("\n");
      }
    },
  };
}

/** Replaces __SITE_URL__ in index.html and emits robots.txt + sitemap.xml. */
function seo(): Plugin {
  return {
    name: "hadara-seo",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", SITE_URL);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
      // The reader is hash-routed, so crawlers see one document; the sitemap
      // therefore lists the single canonical URL rather than fragment links.
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          `  <url>`,
          `    <loc>${SITE_URL}/</loc>`,
          `    <changefreq>weekly</changefreq>`,
          `  </url>`,
          `</urlset>`,
          ``,
        ].join("\n"),
      });
    },
  };
}

export default defineConfig({
  // Relative base: the build works from any path — user pages, project pages
  // (username.github.io/HADARA/), or a custom domain — without editing config.
  base: "./",
  plugins: [react(), tailwindcss(), seo(), hadaraMeta()],
});

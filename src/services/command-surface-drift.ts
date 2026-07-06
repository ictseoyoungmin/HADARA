import fs from 'node:fs';
import path from 'node:path';

/**
 * FD-011: command-surface drift detection between the source-of-truth
 * command registry and an installed/packed artifact.
 *
 * Spike decision (T-0499): two comparisons, both directions each —
 *  (a) source registry command ids vs the installed CLI's own
 *      `commands --json` registry projection, and
 *  (b) the installed registry's top-level verbs vs `case '<verb>':`
 *      routing tokens statically parsed from the installed
 *      `dist/cli/main.js` dispatcher.
 * Handler-export contracts (invasive) and `--help` output parsing
 * (fragile) were rejected. Sub-command routing parity below the top
 * level is deferred.
 */

export interface CommandSurfaceDiff {
  ok: boolean;
  missingFromInstalled: string[];
  extraInInstalled: string[];
}

export function diffCommandIds(sourceIds: readonly string[], installedIds: readonly string[]): CommandSurfaceDiff {
  const source = new Set(sourceIds);
  const installed = new Set(installedIds);
  const missingFromInstalled = [...source].filter((id) => !installed.has(id)).sort();
  const extraInInstalled = [...installed].filter((id) => !source.has(id)).sort();
  return {
    ok: missingFromInstalled.length === 0 && extraInInstalled.length === 0,
    missingFromInstalled,
    extraInInstalled
  };
}

/**
 * Extract top-level `case 'verb':` tokens from a compiled dispatcher source.
 * The tsc output preserves switch cases as `case 'help':` / `case "help":`.
 */
export function extractDispatcherCaseTokens(mainJsSource: string): string[] {
  const tokens = new Set<string>();
  const pattern = /case\s+['"]([a-z][a-z0-9-]*)['"]\s*:/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(mainJsSource)) !== null) {
    tokens.add(match[1]);
  }
  return [...tokens].sort();
}

/**
 * Top-level verbs implied by registry entries: the first token after
 * `hadara` in each entry's documented command pattern.
 */
export function extractRegistryTopLevelVerbs(commandPatterns: readonly string[]): string[] {
  const verbs = new Set<string>();
  for (const pattern of commandPatterns) {
    const match = /^hadara\s+([a-z][a-z0-9-]*)/.exec(pattern.trim());
    if (match) verbs.add(match[1]);
  }
  return [...verbs].sort();
}

export interface RoutingParityDiff {
  ok: boolean;
  registryVerbsWithoutRouting: string[];
  routedVerbsWithoutRegistry: string[];
}

export function diffRoutingParity(registryVerbs: readonly string[], dispatcherTokens: readonly string[]): RoutingParityDiff {
  const routed = new Set(dispatcherTokens);
  const registered = new Set(registryVerbs);
  const registryVerbsWithoutRouting = [...registered].filter((verb) => !routed.has(verb)).sort();
  const routedVerbsWithoutRegistry = [...routed].filter((verb) => !registered.has(verb)).sort();
  return {
    ok: registryVerbsWithoutRouting.length === 0 && routedVerbsWithoutRegistry.length === 0,
    registryVerbsWithoutRouting,
    routedVerbsWithoutRegistry
  };
}

/**
 * Locate the installed package root under an isolated npm global prefix,
 * covering posix (`<prefix>/lib/node_modules/hadara`) and Windows
 * (`<prefix>/node_modules/hadara`) layouts.
 */
export function findInstalledPackageRoot(installPrefix: string): string | null {
  const candidates = [
    path.join(installPrefix, 'lib', 'node_modules', 'hadara'),
    path.join(installPrefix, 'node_modules', 'hadara')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'package.json'))) return candidate;
  }
  return null;
}

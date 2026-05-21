const SECRET_PATTERNS: RegExp[] = [
  /sk-[A-Za-z0-9_-]{16,}/g,
  /xox[baprs]-[A-Za-z0-9-]{10,}/g,
  /(api[_-]?key\s*=\s*)[^\s]+/gi,
  /(token\s*=\s*)[^\s]+/gi,
  /(password\s*=\s*)[^\s]+/gi,
  /(authorization:\s*bearer\s+)[^\s]+/gi
];

export function redactSecrets(input: string): string {
  return SECRET_PATTERNS.reduce((text, pattern) => text.replace(pattern, '$1[REDACTED]'), input);
}

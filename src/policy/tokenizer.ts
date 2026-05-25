export interface ShellCommandAst {
  tokens: string[];
  operators: string[];
}

export function tokenizeShellCommand(command: string): ShellCommandAst {
  const tokens: string[] = [];
  const operators: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];
    const next = command[index + 1];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    const twoCharOperator = `${char}${next}`;
    if (twoCharOperator === '&&' || twoCharOperator === '||') {
      pushToken(tokens, current);
      current = '';
      operators.push(twoCharOperator);
      index += 1;
      continue;
    }

    if (char === '|' || char === ';') {
      pushToken(tokens, current);
      current = '';
      operators.push(char);
      continue;
    }

    if (/\s/.test(char)) {
      pushToken(tokens, current);
      current = '';
      continue;
    }

    current += char;
  }

  pushToken(tokens, current);
  return { tokens, operators };
}

function pushToken(tokens: string[], value: string): void {
  const trimmed = value.trim();
  if (trimmed) tokens.push(trimmed);
}

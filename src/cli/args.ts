export class CliArgsError extends Error {
  constructor(
    public readonly code:
      | 'CLI_OPTION_MISSING_VALUE'
      | 'CLI_OPTION_VALUE_LOOKS_LIKE_FLAG'
      | 'CLI_OPTION_REQUIRED'
      | 'CLI_OPTION_INTEGER_INVALID'
      | 'CLI_OPTION_INVALID_VALUE',
    message: string
  ) {
    super(message);
    this.name = 'CliArgsError';
  }
}

export interface IntegerOptionBounds {
  fallback?: number;
  min?: number;
  max?: number;
}

export function getStringOption(args: string[], name: string, fallback?: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  const value = args[index + 1];
  rejectMissingValue(name, value);
  rejectValueThatLooksLikeFlag(name, value);
  return value;
}

export function getRequiredStringOption(args: string[], name: string): string {
  const value = getStringOption(args, name);
  if (value === undefined) {
    throw new CliArgsError('CLI_OPTION_REQUIRED', `${name} is required`);
  }
  return value;
}

export function getIntegerOption(args: string[], name: string, bounds: IntegerOptionBounds = {}): number | undefined {
  const fallback = bounds.fallback === undefined ? undefined : String(bounds.fallback);
  const value = getStringOption(args, name, fallback);
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) {
    throw new CliArgsError('CLI_OPTION_INTEGER_INVALID', integerMessage(name, bounds));
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || (bounds.min !== undefined && parsed < bounds.min) || (bounds.max !== undefined && parsed > bounds.max)) {
    throw new CliArgsError('CLI_OPTION_INTEGER_INVALID', integerMessage(name, bounds));
  }
  return parsed;
}

export function getFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

export function rejectMissingValue(name: string, value: string | undefined): void {
  if (value === undefined) {
    throw new CliArgsError('CLI_OPTION_MISSING_VALUE', `${name} requires a value`);
  }
}

export function rejectValueThatLooksLikeFlag(name: string, value: string): void {
  if (value.startsWith('--')) {
    throw new CliArgsError('CLI_OPTION_VALUE_LOOKS_LIKE_FLAG', `${name} value must not look like a flag`);
  }
}

function integerMessage(name: string, bounds: IntegerOptionBounds): string {
  if (bounds.min !== undefined && bounds.max !== undefined) return `${name} must be an integer from ${bounds.min} to ${bounds.max}`;
  if (bounds.min !== undefined) return `${name} must be an integer greater than or equal to ${bounds.min}`;
  if (bounds.max !== undefined) return `${name} must be an integer less than or equal to ${bounds.max}`;
  return `${name} must be an integer`;
}

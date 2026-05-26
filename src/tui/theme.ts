export type TuiThemeName = 'none' | 'hadara' | 'contrast';

type TuiThemeRole =
  | 'canvas'
  | 'panel'
  | 'panel2'
  | 'border'
  | 'text'
  | 'text2'
  | 'muted'
  | 'dim'
  | 'gold'
  | 'gold2'
  | 'teal'
  | 'teal2'
  | 'pass'
  | 'warn'
  | 'fail'
  | 'violet'
  | 'white'
  | 'black';

const ANSI_RESET = '\x1b[0m';

const THEME_HEX: Record<Exclude<TuiThemeName, 'none'>, Record<TuiThemeRole, string>> = {
  hadara: {
    canvas: '#0B1114',
    panel: '#121D22',
    panel2: '#17262C',
    border: '#34434A',
    text: '#DED6C2',
    text2: '#BDB49D',
    muted: '#848978',
    dim: '#5D675F',
    gold: '#C6A15F',
    gold2: '#E0B96D',
    teal: '#63AEB8',
    teal2: '#82C7CE',
    pass: '#82BE86',
    warn: '#D0A45A',
    fail: '#D97B73',
    violet: '#A891DD',
    white: '#F2EBD8',
    black: '#081014'
  },
  contrast: {
    canvas: '#050505',
    panel: '#111111',
    panel2: '#242424',
    border: '#777777',
    text: '#F3F3F3',
    text2: '#D1D1D1',
    muted: '#AAAAAA',
    dim: '#777777',
    gold: '#FFD166',
    gold2: '#FFE08A',
    teal: '#4ECDC4',
    teal2: '#8CF5EA',
    pass: '#74F174',
    warn: '#FFD166',
    fail: '#FF6B6B',
    violet: '#C4A7FF',
    white: '#FFFFFF',
    black: '#000000'
  }
};

export function normalizeTuiThemeName(value: string | undefined, fallback: TuiThemeName = 'none'): TuiThemeName {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized === 'hadara' || normalized === 'contrast' || normalized === 'none') return normalized;
  return fallback;
}

export function tuiFg(theme: TuiThemeName, role: TuiThemeRole, text: string): string {
  if (theme === 'none') return text;
  return `${ansiFg(theme, role)}${text}${ANSI_RESET}`;
}

export function tuiBg(theme: TuiThemeName, role: TuiThemeRole, text = ''): string {
  if (theme === 'none') return text;
  return `${ansiBg(theme, role)}${text}${ANSI_RESET}`;
}

export function tuiSwatch(theme: TuiThemeName, background: TuiThemeRole, foreground: TuiThemeRole, text: string): string {
  if (theme === 'none') return text;
  return `${ansiBg(theme, background)}${ansiFg(theme, foreground)}${text}${ANSI_RESET}`;
}

export function tuiColorEnabled(theme: TuiThemeName): boolean {
  return theme !== 'none';
}

function ansiFg(theme: Exclude<TuiThemeName, 'none'>, role: TuiThemeRole): string {
  const [red, green, blue] = hexToRgb(THEME_HEX[theme][role]);
  return `\x1b[38;2;${red};${green};${blue}m`;
}

function ansiBg(theme: Exclude<TuiThemeName, 'none'>, role: TuiThemeRole): string {
  const [red, green, blue] = hexToRgb(THEME_HEX[theme][role]);
  return `\x1b[48;2;${red};${green};${blue}m`;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)];
}
